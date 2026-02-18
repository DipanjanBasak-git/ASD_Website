/**
 * REGULATORY-GRADE SCORING ENGINE
 * 
 * Rules:
 * 1. Deterministic execution
 * 2. Immutable logic (versioned)
 * 3. No external dependencies
 */

export interface ScoringResult {
    score: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    flaggedItems: string[];
}

// M-CHAT-R/F Scoring Logic (Standard Clinical Algorithm)
export function scoreMCHAT(responses: Record<string, boolean>): ScoringResult {
    let score = 0;
    const flagged: string[] = [];

    // Critical Items that indicate risk if FAILED (i.e., answer is NO usually, except for some)
    // Standard M-CHAT-R items scoring:
    // Most items: NO = 1 point (At Risk), YES = 0 (Pass)
    // Exceptions: Items 2, 5, 12: YES = 1 point (At Risk), NO = 0 (Pass)

    // Mappings based on standard 20-item M-CHAT-R
    // 1. Point at things? (NO=1)
    // 2. Wonder if deaf? (YES=1) << REVERSE
    // 3. Play pretend? (NO=1)
    // 4. Climb things? (NO=1)
    // 5. Finger movements? (YES=1) << REVERSE
    // 6. Point with finger? (NO=1)
    // 7. Interest in children? (NO=1)
    // 8. Show things? (NO=1)
    // 9. Bring things? (NO=1)
    // 10. Respond to name? (NO=1)
    // 11. Smile back? (NO=1)
    // 12. Upset by noises? (YES=1) << REVERSE
    // 13. Walk? (NO=1)
    // 14. Look at you? (NO=1)
    // 15. Copy you? (NO=1)
    // 16. Turn head? (NO=1)
    // 17. Look at pointed? (NO=1)
    // 18. Understand verify? (NO=1)
    // 19. New things? (NO=1)
    // 20. Movement skill? (NO=1)

    const reverseItems = ["2", "5", "12"];

    for (const [questionId, answer] of Object.entries(responses)) {
        const isReverse = reverseItems.includes(questionId);

        // If Reverse: YES is Bad (1)
        // If Normal: NO is Bad (1)

        let isAtRisk = false;
        if (isReverse) {
            if (answer === true) isAtRisk = true;
        } else {
            if (answer === false) isAtRisk = true;
        }

        if (isAtRisk) {
            score++;
            flagged.push(questionId);
        }
    }

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (score >= 8) riskLevel = "HIGH";
    else if (score >= 3) riskLevel = "MEDIUM";

    return { score, riskLevel, flaggedItems: flagged };
}

// CARS-2 Scoring Logic (simplified wrapper for manual entry validation)
export function calculateCARS2(ratings: Record<string, number>): ScoringResult {
    let score = 0;
    const flagged: string[] = [];

    // 15 Items, rated 1-4
    for (const [category, rating] of Object.entries(ratings)) {
        score += rating;
        if (rating >= 3) {
            flagged.push(category);
        }
    }

    // CARS-2 Standard Cutoffs
    // < 30: Minimal/No Symptoms
    // 30 - 36.5: Mild-Moderate
    // > 36.5: Severe

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (score > 36.5) riskLevel = "HIGH";
    else if (score >= 30) riskLevel = "MEDIUM";

    return { score, riskLevel, flaggedItems: flagged };
}
