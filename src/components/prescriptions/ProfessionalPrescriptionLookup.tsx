'use client';

/**
 * ProfessionalPrescriptionLookup
 *
 * Comprehensive clinical patient profile viewer for Doctors, Therapists, and Counsellors.
 *
 * Security & Access Control:
 * - Server enforces active PatientAccessGrant or PrescriptionAccessGrant on every lookup
 * - Unauthorized professionals receive a clear denial response without data exposure
 * - Patient ID alone never grants access
 * - Private images and prescription documents served only via authenticated endpoints
 */

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ProfessionalPrescriptionLookup.module.css';

// ── Types ──────────────────────────────────────────────────────────────────

interface ParsedMedicine {
    name: string | null;
    strength: string | null;
    dosage: string | null;
    frequency: string | null;
    route: string | null;
    duration: string | null;
    instructions: string | null;
}

interface AiExtractedData {
    status: 'PROCESSED' | 'PARTIAL' | 'FAILED';
    patientName: string | null;
    prescriptionDate: string | null;
    doctorName: string | null;
    doctorLicense: string | null;
    diagnosis: string | null;
    medicines: ParsedMedicine[];
    additionalNotes: string | null;
    extractionConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNABLE';
    failureReason?: string;
}

interface GrantedPrescription {
    id: string;
    originalFileName: string | null;
    processingStatus: string;
    aiExtractedData: AiExtractedData | null;
    aiProcessedAt: string | null;
    aiFailureReason: string | null;
    details: string | null;
    prescribedBy: string | null;
    createdAt: string;
}

interface ScreeningItem {
    id: string;
    toolName: string;
    toolVersion: string;
    scoringVersion: string;
    calculatedScore: number;
    riskLevel: string;
    reviewStatus: string;
    hasFacialImage: boolean;
    imageUrl: string | null;
    rawResponse: any;
    createdAt: string;
}

interface PatientRecord {
    patientUniqueId: string;
    name: string;
    gender: string;
    dob: string;
    pipelineStage: string;
}

interface LookupResponse {
    granted: boolean;
    message?: string;
    patient?: PatientRecord;
    screenings?: ScreeningItem[];
    prescriptions?: GrantedPrescription[];
}

interface Props {
    title?: string;
}

export default function ProfessionalPrescriptionLookup({ title }: Props) {
    const { t } = useLanguage();
    const [patientUniqueId, setPatientUniqueId] = useState('');
    const [loading, setLoading] = useState(false);
    const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null);

    // Expandable section states
    const [screeningsOpen, setScreeningsOpen] = useState(true);
    const [prescriptionsOpen, setPrescriptionsOpen] = useState(true);
    const [expandedScreeningId, setExpandedScreeningId] = useState<string | null>(null);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = patientUniqueId.trim();
        if (!trimmed) return;

        setLoading(true);
        setLookupResult(null);

        try {
            const res = await fetch(`/api/prescriptions/professional/lookup?patientUniqueId=${encodeURIComponent(trimmed)}`);
            const data: LookupResponse = await res.json();
            setLookupResult(data);
            if (data.screenings && data.screenings.length > 0) {
                setExpandedScreeningId(data.screenings[0].id);
            }
        } catch (err) {
            console.error('[ProfessionalLookup error]', err);
            setLookupResult({
                granted: false,
                message: 'A network error occurred while looking up the record. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const formatAge = (dobString: string) => {
        try {
            const dob = new Date(dobString);
            const diffMs = Date.now() - dob.getTime();
            const ageDate = new Date(diffMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970) + ' yrs';
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M9 14l2 2 4-4" />
                    </svg>
                    <span>{title || t.professional.patientProfileTitle}</span>
                </h2>
            </div>

            {/* ── Lookup search box ───────────────────────────────────── */}
            <form onSubmit={handleLookup} className={styles.searchBox}>
                <input
                    type="text"
                    value={patientUniqueId}
                    onChange={(e) => setPatientUniqueId(e.target.value)}
                    placeholder={t.professional.searchPlaceholder}
                    className={styles.input}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !patientUniqueId.trim()} className={styles.btn}>
                    {loading ? (
                        <>
                            <span>{t.professional.searching}</span>
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span>{t.professional.lookupBtn}</span>
                        </>
                    )}
                </button>
            </form>

            {/* ── Denied message ──────────────────────────────────────── */}
            {lookupResult && !lookupResult.granted && (
                <div className={styles.deniedBox} role="alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                        <strong>{t.professional.accessDeniedTitle}:</strong>{' '}
                        {lookupResult.message || t.professional.noAccessGranted}
                    </div>
                </div>
            )}

            {/* ── Granted Patient Record ──────────────────────────────── */}
            {lookupResult?.granted && lookupResult.patient && (
                <div>
                    {/* Patient Card */}
                    <div className={styles.patientCard}>
                        <div>
                            <div className={styles.patientName}>{lookupResult.patient.name}</div>
                            <div className={styles.patientMeta}>
                                <span>{t.professional.age}: <strong>{formatAge(lookupResult.patient.dob)}</strong></span>
                                <span>{t.professional.gender}: <strong>{lookupResult.patient.gender}</strong></span>
                                <span>{t.common.status}: <strong>{lookupResult.patient.pipelineStage}</strong></span>
                            </div>
                        </div>
                        <div className={styles.idBadge}>
                            {lookupResult.patient.patientUniqueId}
                        </div>
                    </div>

                    {/* ── SECTION 1: Screening History & Multi-Modal Assessments ── */}
                    <div className={styles.accordionSection}>
                        <button
                            type="button"
                            className={styles.accordionHeader}
                            onClick={() => setScreeningsOpen(!screeningsOpen)}
                        >
                            <span className={styles.accordionTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                                <span>{t.professional.screeningsSection}</span>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={styles.accordionBadge}>
                                    {lookupResult.screenings?.length || 0}
                                </span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    style={{ transform: screeningsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        {screeningsOpen && (
                            <div className={styles.accordionContent}>
                                {(!lookupResult.screenings || lookupResult.screenings.length === 0) ? (
                                    <div style={{ color: '#64748b', fontSize: '0.88rem', padding: '1rem', textAlign: 'center' }}>
                                        {t.professional.noScreeningsYet}
                                    </div>
                                ) : (
                                    lookupResult.screenings.map((screening) => {
                                        const isExpanded = expandedScreeningId === screening.id;
                                        const raw = screening.rawResponse || {};
                                        const facial = raw.facial || {};
                                        const questionnaire = raw.questionnaire || {};
                                        const combined = raw.combined || {};
                                        const answers = raw.answers || {};

                                        const scoreClass =
                                            screening.riskLevel === 'HIGH' ? styles.scoreHigh :
                                            screening.riskLevel === 'MEDIUM' ? styles.scoreMed : styles.scoreLow;

                                        return (
                                            <div key={screening.id} className={styles.screeningItem}>
                                                <div className={styles.screeningTop}>
                                                    <div>
                                                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                                                            {screening.toolName} ({screening.scoringVersion || 'Standard'})
                                                        </strong>
                                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                                                            {new Date(screening.createdAt).toLocaleString()} · Record ID: #{screening.id.slice(0, 8)}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <span className={`${styles.scorePill} ${scoreClass}`}>
                                                            {screening.riskLevel} RISK ({screening.calculatedScore}%)
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedScreeningId(isExpanded ? null : screening.id)}
                                                            className={styles.docLink}
                                                        >
                                                            {isExpanded ? 'Hide Details' : 'View Details'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Multi-Modal Details */}
                                                {isExpanded && (
                                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        {/* Facial + Questionnaire Cards Grid */}
                                                        <div className={styles.gridTwo}>
                                                            {/* Facial Analysis */}
                                                            <div className={styles.cardInner}>
                                                                <div className={styles.cardInnerTitle}>
                                                                    <span>{t.professional.facialSection}</span>
                                                                    <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                                                                        Weight: 40%
                                                                    </span>
                                                                </div>

                                                                <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                                                                    {screening.imageUrl ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img
                                                                            src={screening.imageUrl}
                                                                            alt="Screening facial scan"
                                                                            className={styles.facialPreviewImg}
                                                                        />
                                                                    ) : (
                                                                        <div style={{ width: 80, height: 80, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8', marginRight: '1rem' }}>
                                                                            No Image
                                                                        </div>
                                                                    )}
                                                                    <div style={{ flex: 1, fontSize: '0.84rem' }}>
                                                                        <div>Assessment: <strong>{facial.prediction || 'Completed'}</strong></div>
                                                                        <div>ASD Risk: <strong>{facial.riskPercentage ?? (facial.score ? Math.round(facial.score * 100) : 'N/A')}%</strong></div>
                                                                        <div>Confidence: <strong>{facial.confidence || 'N/A'}%</strong></div>
                                                                        <div style={{ marginTop: '0.35rem', color: '#1e40af', fontWeight: 600 }}>
                                                                            Contribution: +{facial.contribution ?? 'N/A'}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Questionnaire Analysis */}
                                                            <div className={styles.cardInner}>
                                                                <div className={styles.cardInnerTitle}>
                                                                    <span>{t.professional.questionnaireSection}</span>
                                                                    <span style={{ fontSize: '0.75rem', background: '#ede9fe', color: '#5b21b6', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                                                                        Weight: 60%
                                                                    </span>
                                                                </div>
                                                                <div style={{ fontSize: '0.84rem', marginTop: '0.5rem' }}>
                                                                    <div>ISAA Clinical Profile: <strong>{questionnaire.prediction || 'Mild/Moderate'}</strong></div>
                                                                    <div>ASD Risk / Severity: <strong>{questionnaire.riskPercentage ?? questionnaire.confidence}%</strong></div>
                                                                    <div>Model Confidence: <strong>{questionnaire.confidence || 'N/A'}%</strong></div>
                                                                    <div style={{ marginTop: '0.35rem', color: '#6d28d9', fontWeight: 600 }}>
                                                                        Contribution: +{questionnaire.contribution ?? 'N/A'}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Questionnaire Questions & Patient Answers Table */}
                                                        {Object.keys(answers).length > 0 && (
                                                            <div className={styles.cardInner}>
                                                                <div className={styles.cardInnerTitle}>
                                                                    <span>{t.professional.questionsAnswers}</span>
                                                                </div>
                                                                <div style={{ overflowX: 'auto' }}>
                                                                    <table className={styles.qaTable}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>{t.professional.question}</th>
                                                                                <th>{t.professional.patientResponse}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Object.entries(answers).map(([k, v]) => (
                                                                                <tr key={k}>
                                                                                    <td style={{ textTransform: 'capitalize' }}>
                                                                                        {k.replace(/_/g, ' ')}
                                                                                    </td>
                                                                                    <td>
                                                                                        <strong style={{ color: v === 'Y' || v === 'yes' ? '#0f172a' : '#475569' }}>
                                                                                            {String(v)}
                                                                                        </strong>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Combined Summary Narrative */}
                                                        {combined.summary && (
                                                            <div style={{ padding: '0.85rem 1rem', background: '#eff6ff', borderRadius: 8, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.6 }}>
                                                                <strong>Clinical Narrative:</strong> {combined.summary}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── SECTION 2: Prescriptions & Digitized Records ──────── */}
                    <div className={styles.accordionSection}>
                        <button
                            type="button"
                            className={styles.accordionHeader}
                            onClick={() => setPrescriptionsOpen(!prescriptionsOpen)}
                        >
                            <span className={styles.accordionTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>{t.professional.prescriptionsSection}</span>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={styles.accordionBadge}>
                                    {lookupResult.prescriptions?.length || 0}
                                </span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    style={{ transform: prescriptionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        {prescriptionsOpen && (
                            <div className={styles.accordionContent}>
                                {(!lookupResult.prescriptions || lookupResult.prescriptions.length === 0) ? (
                                    <div style={{ color: '#64748b', fontSize: '0.88rem', padding: '1rem', textAlign: 'center' }}>
                                        {t.professional.noPrescriptionsYet}
                                    </div>
                                ) : (
                                    lookupResult.prescriptions.map((rx) => {
                                        const ai = rx.aiExtractedData;
                                        return (
                                            <div key={rx.id} className={styles.rxCard}>
                                                <div className={styles.rxHeader}>
                                                    <div>
                                                        <div className={styles.rxTitle}>
                                                            {rx.originalFileName || 'Prescription Document'}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                                                            Prescribed by: {ai?.doctorName || rx.prescribedBy || 'Attending Physician'} · {new Date(rx.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={`/api/prescriptions/${rx.id}/file`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.docLink}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                        <span>{t.professional.viewDocument}</span>
                                                    </a>
                                                </div>

                                                {ai?.diagnosis && (
                                                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                        Diagnosis: <strong>{ai.diagnosis}</strong>
                                                    </div>
                                                )}

                                                {/* Digitized Medicines */}
                                                {ai?.medicines && ai.medicines.length > 0 && (
                                                    <div>
                                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                                                            {t.professional.medicinesPrescribed}:
                                                        </div>
                                                        <div className={styles.medsList}>
                                                            {ai.medicines.map((med, idx) => (
                                                                <div key={idx} className={styles.medItem}>
                                                                    <strong>{med.name}</strong> {med.strength && `(${med.strength})`}
                                                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                                                                        {med.dosage && `${t.professional.dosage}: ${med.dosage} · `}
                                                                        {med.frequency && `${t.professional.frequency}: ${med.frequency}`}
                                                                        {med.instructions && ` · ${med.instructions}`}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ai?.additionalNotes && (
                                                    <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                                        Notes: {ai.additionalNotes}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
