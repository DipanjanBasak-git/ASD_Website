/**
 * Python Questionnaire Model Inference Client
 *
 * Communicates with the local Flask inference service (python_inference/app.py)
 * running on port 5001.
 *
 * The service is started externally (or via the start script).
 * This module provides a typed, error-safe wrapper around the HTTP call.
 *
 * SECURITY: The Flask service binds only to 127.0.0.1. It is never exposed publicly.
 * Model file paths are never returned to the client.
 */

const INFERENCE_SERVICE_URL =
    process.env.QUESTIONNAIRE_MODEL_URL || 'http://127.0.0.1:5001';

const TIMEOUT_MS = 30_000; // 30s — RF inference is fast but give margin

export type QuestionnaireFeatures = {
    age: number;
    gender: 'male' | 'female';
    hyperactive: 'Y' | 'N';
    responsive: 'Y' | 'N';
    epilepsy: 'Y' | 'N';
    diagnosed: number;
    color_recognize: 'Y' | 'N';
    emotional_response: 'Y' | 'N';
    head_injury: 'Y' | 'N';
    speech: 'Y' | 'N';
    eye_contact: 'Y' | 'N';
};

export type QuestionnaireResult = {
    prediction: string;        // 'Mild' | 'Moderate'
    confidence: number;        // [0, 1]
    probabilities: Record<string, number>; // { 'Mild': x, 'Moderate': y }
    classes: string[];
};

/**
 * Call the questionnaire inference service.
 * Throws on network error, timeout, or model error.
 */
export async function runQuestionnaireInference(
    features: QuestionnaireFeatures
): Promise<QuestionnaireResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
        response = await fetch(`${INFERENCE_SERVICE_URL}/infer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(features),
            signal: controller.signal,
        });
    } catch (err: unknown) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Questionnaire model inference timed out after 30s');
        }
        throw new Error(
            'Questionnaire inference service is unavailable. ' +
            'Please ensure the Python service is running.'
        );
    } finally {
        clearTimeout(timer);
    }

    if (!response.ok) {
        let detail = '';
        try {
            const errBody = await response.json();
            detail = errBody.error || JSON.stringify(errBody);
        } catch {
            detail = `HTTP ${response.status}`;
        }
        throw new Error(`Questionnaire model error: ${detail}`);
    }

    const result = await response.json();

    // Validate expected fields
    if (!result.prediction || typeof result.confidence !== 'number') {
        throw new Error('Malformed response from questionnaire inference service');
    }

    return result as QuestionnaireResult;
}

/**
 * Check if the inference service is reachable.
 * Returns true if healthy, false otherwise.
 */
export async function checkInferenceServiceHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${INFERENCE_SERVICE_URL}/health`, {
            signal: AbortSignal.timeout(3000),
        });
        return res.ok;
    } catch {
        return false;
    }
}
