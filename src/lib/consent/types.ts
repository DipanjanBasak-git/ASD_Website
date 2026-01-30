export type ConsentStatus = 'pending' | 'accepted' | 'declined';

export interface ConsentState {
    status: ConsentStatus;
    timestamp: string | null; // ISO string
    policyVersion: string;
}

export const CURRENT_POLICY_VERSION = "1.0.0";
