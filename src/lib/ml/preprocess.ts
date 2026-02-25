/**
 * ASD Image Preprocessor
 *
 * Uses pure @tensorflow/tfjs (no native bindings).
 * Decodes image via the 'jimp' library (pure JS) for Node.js compatibility.
 *
 * Preprocessing matches training notebook exactly:
 *   - Resize to 224×224 (bilinear, matches Keras default)
 *   - Normalize pixels: divide by 255  (rescale=1/255)
 *   - Add batch dimension: [224,224,3] → [1,224,224,3]
 */

import * as tf from '@tensorflow/tfjs';

const IMG_SIZE: [number, number] = [224, 224];

/**
 * Preprocess a raw image buffer into a model-ready tensor.
 * Returns a [1, 224, 224, 3] float32 tensor.
 * Caller must dispose the returned tensor after use.
 */
export async function preprocessImage(buffer: Buffer): Promise<tf.Tensor4D> {
    // Dynamically import Jimp (pure JS image decoder, no native deps)
    const { Jimp } = await import('jimp');

    const image = await Jimp.fromBuffer(buffer);

    // Resize to 224×224
    image.resize({ w: IMG_SIZE[0], h: IMG_SIZE[1] });

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Extract RGB pixel data (Jimp stores RGBA — we take R,G,B, skip A)
    const pixelData = new Float32Array(width * height * 3);
    let pixelIdx = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4; // RGBA
            pixelData[pixelIdx++] = image.bitmap.data[idx] / 255.0; // R
            pixelData[pixelIdx++] = image.bitmap.data[idx + 1] / 255.0; // G
            pixelData[pixelIdx++] = image.bitmap.data[idx + 2] / 255.0; // B
        }
    }

    // Create tensor [224, 224, 3] and add batch dimension → [1, 224, 224, 3]
    const tensor3d = tf.tensor3d(pixelData, [height, width, 3], 'float32');
    const tensor4d = tensor3d.expandDims(0) as tf.Tensor4D;
    tensor3d.dispose();

    return tensor4d;
}
