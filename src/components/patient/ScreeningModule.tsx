'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ScreeningModule.module.css';

// ── Types ──────────────────────────────────────────────────────────────────
type FacialResult = {
    prediction: string;
    score: number;
    riskPercentage: number;
    confidence: number;
    weight: number;
    contribution: number;
};

type QuestionnaireResult = {
    prediction: string;
    riskPercentage: number;
    confidence: number;
    probabilities: Record<string, number>;
    weight: number;
    contribution: number;
};

type CombinedResult = {
    score: number;
    scorePercentage: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    facialWeight: number;
    questionnaireWeight: number;
    facialContribution: number;
    questionnaireContribution: number;
    assessment: string;
    summary: string;
};

type ScreeningResult = {
    screeningId?: string | null;
    imageUrl?: string | null;
    patient?: {
        name: string;
        patientUniqueId: string;
    };
    facial: FacialResult;
    questionnaire: QuestionnaireResult;
    combined: CombinedResult;
    disclaimer: string;
};

type PatientProfile = {
    name: string;
    id: string;
};

type QuestionnaireAnswers = {
    age: string;
    gender: string;
    hyperactive: string;
    responsive: string;
    epilepsy: string;
    diagnosed: string;
    color_recognize: string;
    emotional_response: string;
    head_injury: string;
    speech: string;
    eye_contact: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const INITIAL_ANSWERS: QuestionnaireAnswers = {
    age: '', gender: '', hyperactive: '', responsive: '',
    epilepsy: '', diagnosed: '', color_recognize: '',
    emotional_response: '', head_injury: '', speech: '', eye_contact: '',
};

// ── SVG icons ──────────────────────────────────────────────────────────────
const ScanIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M21 9V5a2 2 0 00-2-2h-4M21 15v4a2 2 0 01-2 2h-4" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const UploadIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CheckCircle = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.4" fill="#d1fae5" />
        <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AlertCircle = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#c53030" strokeWidth="1.4" fill="#fee2e2" />
        <path d="M8 5v4M8 11v.5" stroke="#c53030" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

// ── Main component ─────────────────────────────────────────────────────────
export default function ScreeningModule() {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    // Questionnaire state
    const [answers, setAnswers] = useState<QuestionnaireAnswers>(INITIAL_ANSWERS);
    const [questionnaireErrors, setQuestionnaireErrors] = useState<Partial<QuestionnaireAnswers>>({});

    // Submission state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScreeningResult | null>(null);
    const [patient, setPatient] = useState<PatientProfile | null>(null);

    // Fetch patient
    useEffect(() => {
        fetch('/api/patient/dashboard')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.profile) setPatient({ name: data.profile.name, id: data.profile.id }); })
            .catch(() => { });
    }, []);

    // ── Image handling ───────────────────────────────────────────────────────
    const handleFile = useCallback((file: File) => {
        setImageError(null);
        setResult(null);
        if (!ALLOWED_TYPES.includes(file.type)) {
            setImageError('Only JPG and PNG images are accepted.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setImageError('File too large. Maximum size is 5MB.');
            return;
        }
        if (file.size === 0) {
            setImageError('The selected file appears to be empty.');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    const handleBrowseClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
        e.target.value = '';
    };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    // ── Questionnaire handling ───────────────────────────────────────────────
    const handleAnswer = (key: keyof QuestionnaireAnswers, value: string) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
        setQuestionnaireErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const validateQuestionnaire = (): boolean => {
        const errs: Partial<QuestionnaireAnswers> = {};
        (Object.keys(INITIAL_ANSWERS) as (keyof QuestionnaireAnswers)[]).forEach(k => {
            if (!answers[k] || answers[k].trim() === '') {
                errs[k] = 'Required';
            }
        });
        if (answers.age && (isNaN(Number(answers.age)) || Number(answers.age) <= 0 || Number(answers.age) > 30)) {
            errs.age = 'Enter a valid age (0–30 years)';
        }
        if (answers.diagnosed && (isNaN(Number(answers.diagnosed)) || Number(answers.diagnosed) < 0 || Number(answers.diagnosed) > 30)) {
            errs.diagnosed = 'Enter a valid duration (0–30 years)';
        }
        setQuestionnaireErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!selectedFile) {
            setImageError('Please select a facial photograph.');
            return;
        }
        if (!validateQuestionnaire()) {
            setError(t.screening.validationError);
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const form = new FormData();
            form.append('image', selectedFile);
            form.append('questionnaire', JSON.stringify({
                age: Number(answers.age),
                gender: answers.gender,
                hyperactive: answers.hyperactive,
                responsive: answers.responsive,
                epilepsy: answers.epilepsy,
                diagnosed: Number(answers.diagnosed),
                color_recognize: answers.color_recognize,
                emotional_response: answers.emotional_response,
                head_injury: answers.head_injury,
                speech: answers.speech,
                eye_contact: answers.eye_contact,
            }));

            const res = await fetch('/api/screening/combined', { method: 'POST', body: form });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Screening failed. Please try again.');
                return;
            }
            setResult(data);
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null); setPreviewUrl(null); setResult(null);
        setError(null); setLoading(false); setImageError(null);
        setAnswers(INITIAL_ANSWERS); setQuestionnaireErrors({});
    };

    // ── Questionnaire items definition ─────────────────────────────────────────
    const questionnaireItems = [
        {
            key: 'age' as const,
            label: t.questionnaire.age.label,
            type: 'number',
            placeholder: t.questionnaire.age.placeholder,
            hint: t.questionnaire.age.hint,
        },
        {
            key: 'gender' as const,
            label: t.questionnaire.gender.label,
            type: 'select',
            options: [
                { value: 'male', label: t.questionnaire.gender.male },
                { value: 'female', label: t.questionnaire.gender.female },
            ],
            hint: '',
        },
        {
            key: 'hyperactive' as const,
            label: t.questionnaire.hyperactive.label,
            type: 'yn',
            hint: t.questionnaire.hyperactive.hint,
        },
        {
            key: 'responsive' as const,
            label: t.questionnaire.responsive.label,
            type: 'yn',
            hint: t.questionnaire.responsive.hint,
        },
        {
            key: 'epilepsy' as const,
            label: t.questionnaire.epilepsy.label,
            type: 'yn',
            hint: t.questionnaire.epilepsy.hint,
        },
        {
            key: 'diagnosed' as const,
            label: t.questionnaire.diagnosed.label,
            type: 'number',
            placeholder: t.questionnaire.diagnosed.placeholder,
            hint: t.questionnaire.diagnosed.hint,
        },
        {
            key: 'color_recognize' as const,
            label: t.questionnaire.color_recognize.label,
            type: 'yn',
            hint: t.questionnaire.color_recognize.hint,
        },
        {
            key: 'emotional_response' as const,
            label: t.questionnaire.emotional_response.label,
            type: 'yn',
            hint: t.questionnaire.emotional_response.hint,
        },
        {
            key: 'head_injury' as const,
            label: t.questionnaire.head_injury.label,
            type: 'yn',
            hint: t.questionnaire.head_injury.hint,
        },
        {
            key: 'speech' as const,
            label: t.questionnaire.speech.label,
            type: 'yn',
            hint: t.questionnaire.speech.hint,
        },
        {
            key: 'eye_contact' as const,
            label: t.questionnaire.eye_contact.label,
            type: 'yn',
            hint: t.questionnaire.eye_contact.hint,
        },
    ];

    // ── Render result section ────────────────────────────────────────────────
    if (result) {
        const facialPositive = result.facial.prediction === 'ASD Positive';
        const facialRisk = result.facial.riskPercentage ?? Math.round(result.facial.score * 100);
        const questionnaireRisk = result.questionnaire.riskPercentage ?? Math.round(result.questionnaire.confidence);
        const riskLevel = result.combined.riskLevel || 'LOW';

        return (
            <div className={styles.page}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link href="/patient/dashboard" className={styles.breadcrumbLink}>{t.screening.breadcrumbDashboard}</Link>
                    <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                    <span className={styles.breadcrumbCurrent}>{t.screening.breadcrumbScreening}</span>
                </nav>

                <div className={styles.pageHeader}>
                    <div className={styles.titleBlock}>
                        <div className={styles.titleRow}>
                            <div className={styles.iconWrap}><ScanIcon /></div>
                            <h1 className={styles.title}>{t.results.title}</h1>
                        </div>
                        <p className={styles.subtitle}>{t.results.subtitle}</p>
                    </div>
                    {patient && (
                        <div className={styles.patientCard}>
                            <div className={styles.patientLabel}>{t.results.patientLabel}</div>
                            <div className={styles.patientName}>{patient.name}</div>
                            <div className={styles.patientId}>{patient.id}</div>
                        </div>
                    )}
                </div>

                {/* ── Results grid ──────────────────────────────────────── */}
                <div className={styles.resultsGrid}>

                    {/* Facial Analysis Card */}
                    <div className={`${styles.resultCard} ${facialPositive ? styles.resultCardPositive : styles.resultCardNegative}`}>
                        <div className={styles.resultCardHeader}>
                            <div className={styles.resultCardIcon}>
                                {facialPositive ? <AlertCircle /> : <CheckCircle />}
                            </div>
                            <div>
                                <div className={styles.resultCardTitle}>
                                    {t.results.facialTitle}
                                    <span className={styles.weightBadge}>Weight: 40%</span>
                                </div>
                                <div className={styles.resultCardModel}>{t.results.facialModel}</div>
                            </div>
                        </div>
                        <div className={styles.resultCardBody}>
                            {previewUrl && (
                                <div className={styles.previewThumbWrap}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="Screening input" className={styles.previewThumb} />
                                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                        {facialPositive ? 'ASD biomarkers detected' : 'Neutral facial markers'}
                                    </span>
                                </div>
                            )}

                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>{t.results.assessment}</span>
                                <span className={`${styles.metricBadge} ${facialPositive ? styles.badgePositive : styles.badgeNegative}`}>
                                    {result.facial.prediction}
                                </span>
                            </div>
                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>{t.results.facialScore}</span>
                                <span className={styles.metricValue}>{facialRisk}%</span>
                            </div>
                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>{t.results.facialConfidence}</span>
                                <span className={styles.metricValue}>{result.facial.confidence}%</span>
                            </div>

                            <div className={styles.contributionBox}>
                                <span className={styles.contributionLabel}>Score Contribution (40% Weight):</span>
                                <span className={styles.contributionValue}>+{result.facial.contribution ?? (facialRisk * 0.4).toFixed(1)}%</span>
                            </div>

                            <div className={styles.progressTrack} style={{ marginTop: '0.6rem' }}>
                                <div
                                    className={`${styles.progressFill} ${facialPositive ? styles.progressPositive : styles.progressNegative}`}
                                    style={{ width: `${facialRisk}%` }}
                                    role="progressbar"
                                    aria-valuenow={facialRisk}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                                <div className={styles.progressThreshold} aria-hidden="true" />
                            </div>
                            <div className={styles.progressLabels}>
                                <span>0%</span>
                                <span>{t.results.threshold50}</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Questionnaire Analysis Card */}
                    <div className={`${styles.resultCard} ${styles.resultCardQuestionnaire}`}>
                        <div className={styles.resultCardHeader}>
                            <div className={styles.resultCardIcon}>
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <circle cx="8" cy="8" r="7" stroke="#7c3aed" strokeWidth="1.4" fill="#ede9fe" />
                                    <path d="M6 6c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 1.5-2 3" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" />
                                    <circle cx="8" cy="12.5" r=".5" fill="#7c3aed" />
                                </svg>
                            </div>
                            <div>
                                <div className={styles.resultCardTitle}>
                                    {t.results.questionnaireTitle}
                                    <span className={`${styles.weightBadge} ${styles.weightBadgeQuestionnaire}`}>Weight: 60%</span>
                                </div>
                                <div className={styles.resultCardModel}>{t.results.questionnaireModel}</div>
                            </div>
                        </div>
                        <div className={styles.resultCardBody}>
                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>{t.results.isaaProfile}</span>
                                <span className={`${styles.metricBadge} ${styles.badgeQuestionnaire}`}>
                                    {result.questionnaire.prediction}
                                </span>
                            </div>
                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>ASD Risk / Severity</span>
                                <span className={styles.metricValue}>{questionnaireRisk}%</span>
                            </div>
                            <div className={styles.resultMetric}>
                                <span className={styles.metricLabel}>{t.results.modelConfidence}</span>
                                <span className={styles.metricValue}>{result.questionnaire.confidence}%</span>
                            </div>

                            <div className={styles.contributionBox}>
                                <span className={styles.contributionLabel}>Score Contribution (60% Weight):</span>
                                <span className={styles.contributionValue}>+{result.questionnaire.contribution ?? (questionnaireRisk * 0.6).toFixed(1)}%</span>
                            </div>

                            {/* Class probabilities */}
                            <div className={styles.probGrid} style={{ marginTop: '0.6rem' }}>
                                {result.questionnaire.probabilities && Object.entries(result.questionnaire.probabilities).map(([cls, prob]) => (
                                    <div key={cls} className={styles.probItem}>
                                        <span className={styles.probLabel}>{cls}</span>
                                        <div className={styles.probBar}>
                                            <div className={styles.probFill} style={{ width: `${Math.round(prob * 100)}%` }} />
                                        </div>
                                        <span className={styles.probVal}>{Math.round(prob * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.modelNote}>
                                {t.results.modelNote}
                            </div>
                        </div>
                    </div>

                    {/* Combined Assessment Card */}
                    <div className={styles.combinedCard}>
                        <div className={styles.combinedHeader}>
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <circle cx="10" cy="10" r="9" stroke="#1e40af" strokeWidth="1.5" fill="#dbeafe" />
                                <path d="M6 10l3 3 5-5" stroke="#1e40af" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className={styles.combinedTitle}>{t.results.combinedTitle}</span>
                            <span className={`${styles.riskBadge} ${riskLevel === 'HIGH' ? styles.riskBadgeHigh : riskLevel === 'MEDIUM' ? styles.riskBadgeMed : styles.riskBadgeLow}`} style={{ marginLeft: 'auto' }}>
                                {t.results.riskCategory}: {riskLevel}
                            </span>
                        </div>

                        <div className={styles.formulaBox}>
                            {t.results.combinedFormula}
                            <div style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                                ({facialRisk}% × 0.4) + ({questionnaireRisk}% × 0.6) = <strong>{result.combined.scorePercentage}%</strong>
                            </div>
                        </div>

                        <div className={styles.combinedAssessment}>{result.combined.assessment}</div>
                        <div className={styles.combinedConfidence}>
                            {t.results.finalScore}: <strong style={{ fontSize: '1.25rem', color: '#1e3a8a' }}>{result.combined.scorePercentage}%</strong>
                            {result.screeningId && (
                                <span style={{ marginLeft: '1rem', color: '#64748b' }}>
                                    Record Ref: #{result.screeningId.slice(0, 8)}
                                </span>
                            )}
                        </div>
                        <p className={styles.combinedSummary}>{result.combined.summary}</p>

                        <div className={styles.disclaimer}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                                <circle cx="7" cy="7" r="6" stroke="#6b7280" strokeWidth="1.2" />
                                <path d="M7 6v4M7 4.5v.5" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            <p>
                                <strong>{t.results.medicalDisclaimerTitle}:</strong> {result.disclaimer || t.results.medicalDisclaimer}
                            </p>
                        </div>

                        <div className={styles.resultActions} style={{ marginTop: '1.25rem' }}>
                            <button onClick={handleReset} className={styles.resetBtn}>
                                {t.results.newScreening}
                            </button>
                            <button onClick={() => window.print()} className={styles.backToDashBtn}>
                                {t.results.downloadReport}
                            </button>
                            <Link href="/patient/dashboard" className={styles.backToDashBtn}>
                                {t.results.returnDashboard}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render input form ────────────────────────────────────────────────────
    return (
        <div className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/patient/dashboard" className={styles.breadcrumbLink}>{t.screening.breadcrumbDashboard}</Link>
                <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                <span className={styles.breadcrumbCurrent}>{t.screening.breadcrumbScreening}</span>
            </nav>

            <div className={styles.pageHeader}>
                <div className={styles.titleBlock}>
                    <div className={styles.titleRow}>
                        <div className={styles.iconWrap}><ScanIcon /></div>
                        <h1 className={styles.title}>{t.screening.pageTitle}</h1>
                    </div>
                    <p className={styles.subtitle}>{t.screening.pageSubtitle}</p>
                </div>
                {patient && (
                    <div className={styles.patientCard}>
                        <div className={styles.patientLabel}>{t.results.patientLabel}</div>
                        <div className={styles.patientName}>{patient.name}</div>
                        <div className={styles.patientId}>{patient.id}</div>
                    </div>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div className={styles.errorBox} role="alert">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            )}

            {/* ── STEP 1: Facial photo upload ───────────────────────── */}
            <section className={styles.stepSection}>
                <div className={styles.stepHeader}>
                    <div className={`${styles.stepBadge} ${selectedFile ? styles.stepBadgeDone : ''}`}>
                        {selectedFile ? '✓' : '1'}
                    </div>
                    <div>
                        <h2 className={styles.stepTitle}>{t.screening.step1Title}</h2>
                        <p className={styles.stepDesc}>{t.screening.step1Subtitle}</p>
                    </div>
                </div>

                <div
                    className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${selectedFile ? styles.hasFile : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        className={styles.hiddenInput}
                        style={{ display: 'none' }}
                        aria-label="Upload patient image"
                    />

                    {selectedFile && previewUrl ? (
                        <div className={styles.previewContainer}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt="Selected patient image preview" className={styles.previewImage} />
                            <div className={styles.previewMeta}>
                                <span className={styles.fileName}>{selectedFile.name}</span>
                                <span className={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <button type="button" onClick={handleBrowseClick} className={styles.changeBtn}>
                                {t.screening.changeImage || 'Change Image'}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.uploadPrompt}>
                            <div className={styles.uploadIconWrap}>
                                <UploadIcon />
                            </div>
                            <p className={styles.uploadText}>{t.screening.dragDropText}</p>
                            <p className={styles.uploadOr}>{t.screening.orBrowse}</p>
                            <button
                                type="button"
                                onClick={handleBrowseClick}
                                className={styles.browseBtn}
                                id="browse-image-btn"
                            >
                                {t.screening.browseFiles}
                            </button>
                            <p className={styles.uploadHint}>{t.screening.imageRequirements}</p>
                        </div>
                    )}
                </div>

                {imageError && (
                    <div className={styles.fieldError} style={{ marginTop: '0.5rem' }}>{imageError}</div>
                )}
            </section>

            {/* ── STEP 2: Questionnaire ─────────────────────────────── */}
            <section className={styles.stepSection}>
                <div className={styles.stepHeader}>
                    <div className={styles.stepBadge}>2</div>
                    <div>
                        <h2 className={styles.stepTitle}>{t.screening.step2Title}</h2>
                        <p className={styles.stepDesc}>{t.screening.step2Subtitle}</p>
                    </div>
                </div>

                <div className={styles.questionnaireGrid}>
                    {questionnaireItems.map((q) => {
                        const val = answers[q.key];
                        const isDone = val && val.trim() !== '';
                        const hasError = !!questionnaireErrors[q.key];

                        return (
                            <div
                                key={q.key}
                                className={`${styles.questionItem} ${isDone ? styles.questionItemDone : ''} ${hasError ? styles.questionItemError : ''}`}
                            >
                                <label className={styles.questionLabel}>
                                    <span>{q.label}</span>
                                    {q.hint && <span className={styles.questionHint}>{q.hint}</span>}
                                </label>

                                {q.type === 'yn' && (
                                    <div className={styles.ynGroup}>
                                        <button
                                            type="button"
                                            className={`${styles.ynBtn} ${val === 'Y' ? styles.ynBtnActive : ''}`}
                                            onClick={() => handleAnswer(q.key, 'Y')}
                                        >
                                            {t.questionnaire.yes}
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.ynBtn} ${val === 'N' ? styles.ynBtnActive : ''}`}
                                            onClick={() => handleAnswer(q.key, 'N')}
                                        >
                                            {t.questionnaire.no}
                                        </button>
                                    </div>
                                )}

                                {q.type === 'select' && (
                                    <select
                                        className={styles.questionSelect}
                                        value={val}
                                        onChange={e => handleAnswer(q.key, e.target.value)}
                                    >
                                        <option value="">-- Select --</option>
                                        {q.options?.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                )}

                                {q.type === 'number' && (
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="30"
                                        placeholder={q.placeholder}
                                        className={styles.questionInput}
                                        value={val}
                                        onChange={e => handleAnswer(q.key, e.target.value)}
                                    />
                                )}

                                {hasError && (
                                    <div className={styles.fieldError}>{questionnaireErrors[q.key]}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Submit button ─────────────────────────────────────── */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`${styles.runBtn} ${loading ? styles.runBtnDisabled : ''}`}
            >
                {loading ? (
                    <>
                        <div className={styles.spinner} />
                        <span>{t.screening.analyzing}</span>
                    </>
                ) : (
                    <>
                        <ScanIcon />
                        <span>{t.screening.submitScreening}</span>
                    </>
                )}
            </button>
            <p className={styles.formIncompleteHint}>
                {t.screening.disclaimerNotice}
            </p>
        </div>
    );
}
