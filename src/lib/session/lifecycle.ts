import { v4 as uuidv4 } from 'uuid'; // We need to install uuid
import { hasValidConsent } from '@/lib/consent/store';

export interface SessionContext {
    sessionId: string;
    startTime: string;
    isActive: boolean;
}

const SESSION_KEY = 'asd_research_session';

export function startSession(): SessionContext | null {
    if (!hasValidConsent()) {
        console.warn("Attempted to start session without valid consent.");
        return null;
    }

    const session: SessionContext = {
        sessionId: uuidv4(),
        startTime: new Date().toISOString(),
        isActive: true,
    };

    if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
}

export function getActiveSession(): SessionContext | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as SessionContext;
    } catch {
        return null;
    }
}

export function endSession(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SESSION_KEY);
}
