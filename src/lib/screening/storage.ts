/**
 * Screening Facial Image Storage Utility
 *
 * Files are stored OUTSIDE the /public directory under uploads/screenings.
 * They are served ONLY via authenticated API routes with role/permission verification.
 * This prevents direct public access to sensitive patient facial images.
 */

import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_ROOT = path.resolve(
    process.cwd(),
    process.env.SCREENING_UPLOAD_DIR || 'uploads/screenings'
);

export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg':  '.jpg',
    'image/png':  '.png',
};

function ensureUploadDir(): void {
    if (!fs.existsSync(UPLOAD_ROOT)) {
        fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    }
}

/**
 * Save a facial screening image buffer securely to disk.
 * Returns the relative path for DB persistence and unique filename.
 */
export async function saveScreeningImage(
    buffer: Buffer,
    mimeType: string
): Promise<{ relativePath: string; savedFileName: string }> {
    ensureUploadDir();

    const ext = ALLOWED_IMAGE_MIME_TYPES[mimeType] || '.jpg';
    const uniqueName = `${uuidv4()}${ext}`;
    const absolutePath = path.join(UPLOAD_ROOT, uniqueName);

    fs.writeFileSync(absolutePath, buffer);

    const relativePath = path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');

    return {
        relativePath,
        savedFileName: uniqueName,
    };
}

/**
 * Read a screening image from disk securely.
 */
export async function readScreeningImage(
    relativePath: string
): Promise<{ buffer: Buffer; mimeType: string }> {
    const absolutePath = path.resolve(process.cwd(), relativePath);

    // Directory traversal prevention
    if (!absolutePath.startsWith(UPLOAD_ROOT)) {
        throw new Error('Invalid file path: path traversal detected');
    }

    if (!fs.existsSync(absolutePath)) {
        throw new Error('Screening image file not found on disk');
    }

    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

    return { buffer, mimeType };
}
