/**
 * Prescription File Storage Utility
 *
 * Files are stored OUTSIDE the /public directory.
 * They are served ONLY via authenticated API routes.
 * This prevents direct public access to sensitive medical documents.
 */

import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Storage root: <project_root>/uploads/prescriptions
// This directory is NOT inside /public — no static serving.
const UPLOAD_ROOT = path.resolve(
    process.cwd(),
    process.env.PRESCRIPTION_UPLOAD_DIR || 'uploads/prescriptions'
);

export const ALLOWED_MIME_TYPES: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg':  '.jpg',
    'image/png':  '.png',
};

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Ensure the upload directory exists.
 */
function ensureUploadDir(): void {
    if (!fs.existsSync(UPLOAD_ROOT)) {
        fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    }
}

/**
 * Save a prescription file buffer to disk.
 * Returns the relative path (for DB storage) and the saved filename.
 */
export async function savePrescriptionFile(
    buffer: Buffer,
    mimeType: string,
    originalName: string
): Promise<{ relativePath: string; savedFileName: string }> {
    ensureUploadDir();

    const ext = ALLOWED_MIME_TYPES[mimeType];
    if (!ext) {
        throw new Error(`Unsupported file type: ${mimeType}`);
    }

    const uniqueName = `${uuidv4()}${ext}`;
    const absolutePath = path.join(UPLOAD_ROOT, uniqueName);

    fs.writeFileSync(absolutePath, buffer);

    // Store the relative path from project root
    const relativePath = path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');

    return { relativePath, savedFileName: originalName };
}

/**
 * Read a prescription file from disk.
 * Returns the buffer and the resolved absolute path.
 * Throws if the file doesn't exist.
 *
 * SECURITY: Always validate that the relativePath came from your DB,
 * never from user input directly.
 */
export function readPrescriptionFile(relativePath: string): {
    buffer: Buffer;
    absolutePath: string;
} {
    // Resolve safely — prevent path traversal
    const absolutePath = path.resolve(process.cwd(), relativePath);

    // Ensure it stays within the UPLOAD_ROOT
    if (!absolutePath.startsWith(UPLOAD_ROOT)) {
        throw new Error('Path traversal detected — access denied.');
    }

    if (!fs.existsSync(absolutePath)) {
        throw new Error('Prescription file not found on disk.');
    }

    const buffer = fs.readFileSync(absolutePath);
    return { buffer, absolutePath };
}

/**
 * Delete a prescription file from disk.
 * Silently succeeds if the file doesn't exist.
 */
export function deletePrescriptionFile(relativePath: string): void {
    try {
        const absolutePath = path.resolve(process.cwd(), relativePath);
        if (!absolutePath.startsWith(UPLOAD_ROOT)) return; // Safety check
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch {
        // Non-fatal: log but continue
        console.warn('Could not delete prescription file:', relativePath);
    }
}

/**
 * Validate a file before saving.
 * Returns an error string or null if valid.
 */
export function validatePrescriptionFile(
    buffer: Buffer,
    mimeType: string,
    fileName: string
): string | null {
    if (!ALLOWED_MIME_TYPES[mimeType]) {
        return 'Invalid file type. Only JPG and PNG images are accepted.';
    }
    if (buffer.length === 0) {
        return 'The uploaded file appears to be empty.';
    }
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
        return 'File size exceeds the 10 MB limit. Please use a smaller image.';
    }
    return null; // Valid
}
