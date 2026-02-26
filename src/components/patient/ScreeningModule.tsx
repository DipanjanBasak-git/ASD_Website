'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import styles from './ScreeningModule.module.css';

type ScreeningResult = {
    score: number;
    prediction: string;
};

type PatientProfile = {
    name: string;
    id: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

// SVG icon components — no emoji, consistent design language
const ScanIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M21 9V5a2 2 0 00-2-2h-4M21 15v4a2 2 0 01-2 2h-4" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
);

const UploadIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

export default function ScreeningModule() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScreeningResult | null>(null);
    const [patient, setPatient] = useState<PatientProfile | null>(null);

    // ── Fetch patient profile ──────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/patient/dashboard')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.profile) {
                    setPatient({ name: data.profile.name, id: data.profile.id });
                }
            })
            .catch(() => { /* silently ignore */ });
    }, []);

    // ── File validation ────────────────────────────────────────────────────
    const handleFile = useCallback((file: File) => {
        setError(null);
        setResult(null);
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Only JPG and PNG images are accepted.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError('File too large. Maximum size is 5MB.');
            return;
        }
        if (file.size === 0) {
            setError('The selected file appears to be empty.');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    const handleBrowseClick = () => fileInputRef.current?.click();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // ── Run Screening ──────────────────────────────────────────────────────
    const handleRunScreening = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const form = new FormData();
            form.append('image', selectedFile);
            const res = await fetch('/api/screening/image', { method: 'POST', body: form });
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
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setLoading(false);
    };

    const isPositive = result?.prediction === 'ASD Positive';
    const scorePercent = result ? Math.round(result.score * 100) : 0;

    return (
        <div className={styles.page}>

            {/* ── Breadcrumb ─────────────────────────────────────────────── */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/patient/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
                <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                <span className={styles.breadcrumbCurrent}>ASD Image Screening</span>
            </nav>

            {/* ── Page header ────────────────────────────────────────────── */}
            <div className={styles.pageHeader}>
                <div className={styles.titleBlock}>
                    <div className={styles.titleRow}>
                        <div className={styles.iconWrap} aria-hidden="true">
                            <ScanIcon />
                        </div>
                        <h1 className={styles.title}>ASD Image Screening</h1>
                    </div>
                    <p className={styles.subtitle}>
                        AI-assisted facial analysis · EfficientNetB4 + ViT model
                    </p>
                </div>

                {/* Patient identity block — right side */}
                {patient && (
                    <div className={styles.patientCard}>
                        <div className={styles.patientLabel}>Patient</div>
                        <div className={styles.patientName}>{patient.name}</div>
                        <div className={styles.patientId}>{patient.id}</div>
                    </div>
                )}
            </div>

            {/* ── Upload section ─────────────────────────────────────────── */}
            {!result && (
                <div className={styles.uploadSection}>
                    <p className={styles.uploadContext}>
                        Upload a frontal facial image for ASD screening analysis
                    </p>

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
                            onChange={handleFileInputChange}
                            className={styles.hiddenInput}
                            aria-label="Upload patient image"
                        />

                        {selectedFile && previewUrl ? (
                            <div className={styles.previewContainer}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="Selected patient image preview"
                                    className={styles.previewImage}
                                />
                                <div className={styles.previewMeta}>
                                    <span className={styles.fileName}>{selectedFile.name}</span>
                                    <span className={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button type="button" onClick={handleBrowseClick} className={styles.changeBtn}>
                                    Change Image
                                </button>
                            </div>
                        ) : (
                            <div className={styles.uploadPrompt}>
                                <div className={styles.uploadIconWrap}>
                                    <UploadIcon />
                                </div>
                                <p className={styles.uploadText}>Drag &amp; drop image here</p>
                                <p className={styles.uploadOr}>or</p>
                                <button
                                    type="button"
                                    onClick={handleBrowseClick}
                                    className={styles.browseBtn}
                                    id="browse-image-btn"
                                >
                                    Browse Image
                                </button>
                                <p className={styles.uploadHint}>JPG, PNG &nbsp;·&nbsp; Max 5MB</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className={styles.errorBox} role="alert">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                <circle cx="8" cy="8" r="7" stroke="#c53030" strokeWidth="1.4" />
                                <path d="M8 5v4M8 11v.5" stroke="#c53030" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleRunScreening}
                        disabled={!selectedFile || loading}
                        className={`${styles.runBtn} ${(!selectedFile || loading) ? styles.runBtnDisabled : ''}`}
                        aria-busy={loading}
                        id="run-screening-btn"
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner} aria-hidden="true" />
                                Analyzing image…
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Run Screening
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* ── Result Panel ────────────────────────────────────────────── */}
            {result && (
                <div className={`${styles.resultPanel} ${isPositive ? styles.positive : styles.negative}`}>
                    {/* Result header */}
                    <div className={styles.resultHeader}>
                        <div className={`${styles.resultIndicator} ${isPositive ? styles.indicatorPositive : styles.indicatorNegative}`}>
                            {isPositive ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <circle cx="10" cy="10" r="9" fill="#fee2e2" stroke="#f87171" strokeWidth="1.5" />
                                    <path d="M10 6v5M10 13v.5" stroke="#c53030" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <circle cx="10" cy="10" r="9" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1.5" />
                                    <path d="M6.5 10l2.5 2.5 4.5-5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <span className={styles.resultLabel}>ASD Screening Result</span>
                        </div>

                        {patient && (
                            <div className={styles.resultPatient}>
                                {patient.name} &nbsp;·&nbsp; <span style={{ opacity: 0.65 }}>{patient.id}</span>
                            </div>
                        )}
                    </div>

                    {/* Score and assessment */}
                    <div className={styles.scoreRow}>
                        <div className={styles.scoreBlock}>
                            <div className={styles.scoreLabel}>ASD Likelihood Score</div>
                            <div className={styles.scoreValue}>{scorePercent}%</div>
                        </div>
                        <div className={styles.statusBlock}>
                            <div className={styles.scoreLabel}>Assessment</div>
                            <div className={`${styles.statusBadge} ${isPositive ? styles.badgePositive : styles.badgeNegative}`}>
                                {isPositive ? 'High Likelihood — ASD Positive' : 'Low Likelihood — ASD Negative'}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className={styles.progressTrack}>
                        <div
                            className={`${styles.progressFill} ${isPositive ? styles.progressPositive : styles.progressNegative}`}
                            style={{ width: `${scorePercent}%` }}
                            role="progressbar"
                            aria-valuenow={scorePercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                        <div className={styles.progressThreshold} aria-hidden="true" />
                    </div>
                    <div className={styles.progressLabels}>
                        <span>0% — ASD Negative</span>
                        <span>50% threshold</span>
                        <span>100% — ASD Positive</span>
                    </div>

                    {/* Model info row */}
                    <div className={styles.modelInfo}>
                        <span>Model: <strong>EfficientNetB4 + ViT</strong></span>
                        <span>Prediction confidence: <strong>{scorePercent}%</strong></span>
                    </div>

                    {/* Disclaimer */}
                    <div className={styles.disclaimer}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                            <circle cx="7" cy="7" r="6" stroke="#6b7280" strokeWidth="1.2" />
                            <path d="M7 6v4M7 4.5v.5" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        <p>
                            <strong>Medical Disclaimer:</strong> This AI screening tool provides predictive insights based on image analysis and is <strong>not a clinical diagnosis</strong>. Results must be interpreted by a qualified healthcare professional.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className={styles.resultActions}>
                        <button type="button" onClick={handleReset} className={styles.resetBtn} id="new-screening-btn">
                            Run Another Screening
                        </button>
                        <Link href="/patient/dashboard" className={styles.backToDashBtn}>
                            ← Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
