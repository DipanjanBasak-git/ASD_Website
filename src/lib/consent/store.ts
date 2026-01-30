import { ConsentState, ConsentStatus, CURRENT_POLICY_VERSION } from './types';

const STORAGE_KEY = 'asd_research_consent';

export function getConsent(): ConsentState {
    if (typeof window === 'undefined') {
        return { status: 'pending', timestamp: null, policyVersion: CURRENT_POLICY_VERSION };
    }

    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return { status: 'pending', timestamp: null, policyVersion: CURRENT_POLICY_VERSION };
        }
        return JSON.parse(stored) as ConsentState;
    } catch (e) {
        console.error("Failed to parse consent", e);
        return { status: 'pending', timestamp: null, policyVersion: CURRENT_POLICY_VERSION };
    }
}

export function saveConsent(status: ConsentStatus): void {
    if (typeof window === 'undefined') return;

    const state: ConsentState = {
        status,
        timestamp: new Date().toISOString(),
        policyVersion: CURRENT_POLICY_VERSION,
    };

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save consent", e);
    }
}

export function hasValidConsent(): boolean {
    const state = getConsent();
    return state.status === 'accepted' && state.policyVersion === CURRENT_POLICY_VERSION;
}
