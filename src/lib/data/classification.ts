export type InteractionMetadata = {
    sessionId: string;
    timestamp: string;
    durationSeconds: number;
    activityType: string;
};

export type CaregiverInput = {
    sessionId: string;
    questionId: string;
    response: string;
    caregiverId?: string; // Optional/Hashed
};

export type AnonymizedFeature = {
    sessionId: string;
    featureId: string;
    value: number[];
    timestamp: string;
};

// Strict separation of storage buckets
const MOCK_DB = {
    metadata: [] as InteractionMetadata[],
    inputs: [] as CaregiverInput[],
    features: [] as AnonymizedFeature[],
    logs: [] as string[],
};

export function storeMetadata(data: InteractionMetadata) {
    // In real app, this goes to a specific table/collection
    MOCK_DB.metadata.push(data);
    console.log("[SECURE STORAGE] Metadata stored", data.sessionId);
}

export function storeCaregiverInput(data: CaregiverInput) {
    // In real app, this is encrypted
    MOCK_DB.inputs.push(data);
    console.log("[SECURE STORAGE] Input stored", data.sessionId);
}

export function storeAnonymizedFeature(data: AnonymizedFeature) {
    // In real app, this is the ONLY data exposed to ML research pipeline
    MOCK_DB.features.push(data);
    console.log("[SECURE STORAGE] Feature stored", data.sessionId);
}

export function logSystemEvent(event: string) {
    // No personal data allowed here
    const timestamp = new Date().toISOString();
    MOCK_DB.logs.push(`[${timestamp}] ${event}`);
}
