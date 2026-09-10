/**
 * Prescription AI Parser
 *
 * Uses Google Gemini Vision API to extract structured data from prescription images.
 * Provider-agnostic design: to switch providers, replace the callGeminiVision()
 * function only — the ParsedPrescription interface and callers remain unchanged.
 *
 * IMPORTANT SAFETY DISCLAIMERS:
 * - This is an EXTRACTION tool only. It does NOT diagnose.
 * - Missing fields are stored as null, never fabricated.
 * - The original prescription remains the source of truth.
 * - AI output must be verified against the original document.
 */

export interface ParsedMedicine {
    name: string | null;
    strength: string | null;
    dosage: string | null;
    frequency: string | null;
    route: string | null;
    duration: string | null;
    instructions: string | null;
}

export interface ParsedPrescription {
    status: 'PROCESSED' | 'FAILED' | 'PARTIAL';
    patientName: string | null;
    prescriptionDate: string | null;
    doctorName: string | null;
    doctorLicense: string | null;
    diagnosis: string | null;
    medicines: ParsedMedicine[];
    additionalNotes: string | null;
    extractionConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNABLE';
    rawAiResponse?: string;   // For debugging only, not shown in UI
    failureReason?: string;
}

const EXTRACTION_PROMPT = `You are a medical prescription digitalization assistant.
Your task is to extract structured information from the prescription image provided.

CRITICAL RULES:
1. NEVER invent or fabricate any information.
2. If a field is not clearly readable or present, set it to null.
3. Do NOT diagnose the patient.
4. Do NOT modify or interpret the doctor's instructions — only transcribe them exactly.
5. If the image is unclear, blurry, or unreadable, return status: "FAILED".

Return a JSON object with exactly this structure (no extra fields, no markdown fences):
{
  "status": "PROCESSED" | "PARTIAL" | "FAILED",
  "patientName": string | null,
  "prescriptionDate": string | null,
  "doctorName": string | null,
  "doctorLicense": string | null,
  "diagnosis": string | null,
  "medicines": [
    {
      "name": string | null,
      "strength": string | null,
      "dosage": string | null,
      "frequency": string | null,
      "route": string | null,
      "duration": string | null,
      "instructions": string | null
    }
  ],
  "additionalNotes": string | null,
  "extractionConfidence": "HIGH" | "MEDIUM" | "LOW" | "UNABLE"
}

Use "PARTIAL" if you extracted some but not all information.
Use "FAILED" if the image is unreadable or is not a prescription.
Use "UNABLE" for extractionConfidence if you cannot reliably read the image.`;

/**
 * Call the Google Gemini Vision API.
 */
async function callGeminiVision(imageBuffer: Buffer, mimeType: string): Promise<string> {
    const apiKey = process.env.PRESCRIPTION_AI_API_KEY;
    const model = process.env.PRESCRIPTION_AI_MODEL || 'gemini-3.6-flash';

    if (!apiKey) {
        throw new Error('PRESCRIPTION_AI_API_KEY is not configured.');
    }

    const base64Image = imageBuffer.toString('base64');

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: EXTRACTION_PROMPT },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.1,      // Low temperature = more factual, less creative
            maxOutputTokens: 2048,
        },
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[aiParser] Gemini API error ${response.status}:`, errorText);
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('Gemini returned an empty response.');
    }

    return text;
}

/**
 * Parse the AI text response into a structured ParsedPrescription.
 */
function parseAiResponse(rawText: string): ParsedPrescription {
    // Strip any markdown code fences if present
    const cleaned = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    const parsed = JSON.parse(cleaned);

    // Normalize and validate the response structure
    return {
        status: ['PROCESSED', 'PARTIAL', 'FAILED'].includes(parsed.status)
            ? parsed.status
            : 'PARTIAL',
        patientName: parsed.patientName ?? null,
        prescriptionDate: parsed.prescriptionDate ?? null,
        doctorName: parsed.doctorName ?? null,
        doctorLicense: parsed.doctorLicense ?? null,
        diagnosis: parsed.diagnosis ?? null,
        medicines: Array.isArray(parsed.medicines)
            ? parsed.medicines.map((m: any) => ({
                name: m.name ?? null,
                strength: m.strength ?? null,
                dosage: m.dosage ?? null,
                frequency: m.frequency ?? null,
                route: m.route ?? null,
                duration: m.duration ?? null,
                instructions: m.instructions ?? null,
            }))
            : [],
        additionalNotes: parsed.additionalNotes ?? null,
        extractionConfidence: ['HIGH', 'MEDIUM', 'LOW', 'UNABLE'].includes(parsed.extractionConfidence)
            ? parsed.extractionConfidence
            : 'LOW',
        rawAiResponse: rawText,
    };
}

/**
 * Main entry point: parse a prescription image.
 *
 * @param imageBuffer - Raw image bytes
 * @param mimeType - MIME type (image/jpeg, image/png)
 * @returns ParsedPrescription (never throws — returns FAILED on error)
 */
export async function parsePrescriptionImage(
    imageBuffer: Buffer,
    mimeType: string
): Promise<ParsedPrescription> {
    try {
        const rawText = await callGeminiVision(imageBuffer, mimeType);
        return parseAiResponse(rawText);
    } catch (error: any) {
        console.error('[aiParser] Prescription parsing failed:', error?.message);

        // Determine a user-friendly failure reason
        let failureReason = 'AI processing encountered an error.';
        if (error?.message?.includes('PRESCRIPTION_AI_API_KEY is not configured')) {
            failureReason = 'AI parsing service is not configured. Your prescription has been saved — please contact support to enable AI extraction.';
        } else if (error?.message?.includes('Gemini API error')) {
            // Extract the HTTP status code for a more helpful message
            const statusMatch = error.message.match(/Gemini API error (\d+)/);
            const statusCode = statusMatch ? statusMatch[1] : 'unknown';
            failureReason = `AI parsing failed (HTTP ${statusCode}). Check the PRESCRIPTION_AI_MODEL setting or API key quota.`;
        } else if (error instanceof SyntaxError) {
            failureReason = 'Unable to reliably extract all prescription details. Please verify the original prescription.';
        }

        return {
            status: 'FAILED',
            patientName: null,
            prescriptionDate: null,
            doctorName: null,
            doctorLicense: null,
            diagnosis: null,
            medicines: [],
            additionalNotes: null,
            extractionConfidence: 'UNABLE',
            failureReason,
        };
    }
}
