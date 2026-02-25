/**
 * ASD Model Singleton Loader
 *
 * Uses pure @tensorflow/tfjs (no native bindings required).
 * Loads the TF.js GraphModel from public/model_tfjs/model.json using
 * a Node.js file system handler — works on any Node version including v22.
 *
 * Model is cached in a global variable to survive Next.js hot reloads.
 */

import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';

// ── Node.js file system IO handler for tf.loadGraphModel ─────────────────────
// @tensorflow/tfjs doesn't include file:// support in non-browser environments,
// so we implement a minimal IOHandler that reads from the local filesystem.
function nodeFileSystemHandler(modelJsonPath: string): tf.io.IOHandler {
    return {
        async load(): Promise<tf.io.ModelArtifacts> {
            const modelDir = path.dirname(modelJsonPath);

            // Read model.json
            const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, 'utf-8'));

            // Read all weight shards listed in weightsManifest
            const weightData: ArrayBuffer[] = [];
            if (modelJson.weightsManifest) {
                for (const group of modelJson.weightsManifest) {
                    for (const shardPath of group.paths) {
                        const fullPath = path.join(modelDir, shardPath);
                        const buf = fs.readFileSync(fullPath);
                        weightData.push(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
                    }
                }
            }

            // Concatenate all shards into a single ArrayBuffer
            const totalBytes = weightData.reduce((sum, ab) => sum + ab.byteLength, 0);
            const combined = new Uint8Array(totalBytes);
            let offset = 0;
            for (const shard of weightData) {
                combined.set(new Uint8Array(shard), offset);
                offset += shard.byteLength;
            }

            return {
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightsManifest?.[0]?.weights ?? [],
                weightData: combined.buffer,
                format: modelJson.format,
                generatedBy: modelJson.generatedBy,
                convertedBy: modelJson.convertedBy,
                signature: modelJson.signature,
                userDefinedMetadata: modelJson.userDefinedMetadata,
                modelInitializer: modelJson.modelInitializer,
            } as tf.io.ModelArtifacts;
        },
    };
}

// ── Global singleton — survives Next.js dev hot reloads ──────────────────────
declare global {
    // eslint-disable-next-line no-var
    var asdModel: tf.GraphModel | undefined;
}

export async function getModel(): Promise<tf.GraphModel> {
    if (!global.asdModel) {
        const modelJsonPath = path.join(process.cwd(), 'public', 'model_tfjs', 'model.json');

        console.log('[ASD Model] Loading graph model from:', modelJsonPath);
        const startTime = Date.now();

        const handler = nodeFileSystemHandler(modelJsonPath);
        global.asdModel = await tf.loadGraphModel(handler);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[ASD Model] Loaded successfully in ${elapsed}s`);
    }

    return global.asdModel;
}

// Cold-start preload: ensures model is ready before first user request.
getModel().catch((err) => {
    console.error('[ASD Model] Failed to preload:', err);
});
