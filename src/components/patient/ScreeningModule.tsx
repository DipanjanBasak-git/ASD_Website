'use client';

import { useRef, useState, useCallback } from 'react';
import styles from './ScreeningModule.module.css';

type ScreeningResult = {
    score: number;
    prediction: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ScreeningModule() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScreeningResult | null>(null);

    // ── File validation & state update ───────────────────────────────────────
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
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }, []);

    // ── Browse button ─────────────────────────────────────────────────────────
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        // Reset input so the same file can be re-selected
        e.target.value = '';
    };

    // ── Drag & Drop ───────────────────────────────────────────────────────────
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // ── Run Screening ─────────────────────────────────────────────────────────
    const handleRunScreening = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const form = new FormData();
            form.append('image', selectedFile);

            const res = await fetch('/api/screening/image', {
                method: 'POST',
                body: form,
            });

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

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setLoading(false);
    };

    // ── Computed ──────────────────────────────────────────────────────────────
    const isPositive = result?.prediction === 'ASD Positive';
    const scorePercent = result ? Math.round(result.score * 100) : 0;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerIcon}>🧠</div>
                <div>
                    <h1 className={styles.title}>ASD Image Screening</h1>
                    <p className={styles.subtitle}>
                        AI-assisted analysis using the trained EfficientNetB4 + ViT model
                    </p>
                </div>
            </div>

            {/* Upload Section */}
            {!result && (
                <>
                    <div
                        className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${selectedFile ? styles.hasFile : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileInputChange}
                            className={styles.hiddenInput}
                            aria-label="Upload patient image"
                        />

                        {selectedFile && previewUrl ? (
                            /* Preview */
                            <div className={styles.previewContainer}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="Selected patient image preview"
                                    className={styles.previewImage}
                                />
                                <div className={styles.previewInfo}>
                                    <span className={styles.fileName}>{selectedFile.name}</span>
                                    <span className={styles.fileSize}>
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleBrowseClick}
                                    className={styles.changeBtn}
                                    aria-label="Change image"
                                >
                                    Change Image
                                </button>
                            </div>
                        ) : (
                            /* Upload prompt */
                            <div className={styles.uploadPrompt}>
                                <div className={styles.uploadIcon}>📁</div>
                                <p className={styles.uploadText}>
                                    Drag &amp; drop a patient image here
                                </p>
                                <p className={styles.uploadOr}>— or —</p>
                                <button
                                    type="button"
                                    onClick={handleBrowseClick}
                                    className={styles.browseBtn}
                                    id="browse-image-btn"
                                >
                                    Browse Image
                                </button>
                                <p className={styles.uploadHint}>Supported: JPG, PNG · Max: 5MB</p>
                            </div>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className={styles.errorBox} role="alert">
                            <span className={styles.errorIcon}>⚠️</span> {error}
                        </div>
                    )}

                    {/* Run Screening button */}
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
                                Analyzing…
                            </>
                        ) : (
                            'Run Screening'
                        )}
                    </button>
                </>
            )}

            {/* Result Panel */}
            {result && (
                <div className={`${styles.resultPanel} ${isPositive ? styles.positive : styles.negative}`}>
                    <div className={styles.resultHeader}>
                        <span className={styles.resultIcon}>{isPositive ? '🔴' : '🟢'}</span>
                        <h2 className={styles.resultTitle}>ASD Screening Result</h2>
                    </div>

                    <div className={styles.scoreRow}>
                        <div className={styles.scoreBlock}>
                            <div className={styles.scoreLabel}>Confidence Score</div>
                            <div className={styles.scoreValue}>{scorePercent}%</div>
                        </div>
                        <div className={styles.statusBlock}>
                            <div className={styles.scoreLabel}>Assessment</div>
                            <div className={`${styles.statusBadge} ${isPositive ? styles.badgePositive : styles.badgeNegative}`}>
                                {isPositive ? 'High Likelihood (ASD Positive)' : 'Low Likelihood (ASD Negative)'}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className={styles.progressBar}>
                        <div
                            className={`${styles.progressFill} ${isPositive ? styles.progressPositive : styles.progressNegative}`}
                            style={{ width: `${scorePercent}%` }}
                            role="progressbar"
                            aria-valuenow={scorePercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <div className={styles.progressLabels}>
                        <span>0%</span>
                        <span className={styles.threshold}>50% threshold</span>
                        <span>100%</span>
                    </div>

                    {/* Disclaimer */}
                    <div className={styles.disclaimer}>
                        <span className={styles.disclaimerIcon}>ℹ️</span>
                        <p>
                            <strong>Medical Disclaimer:</strong> This AI-based screening tool provides
                            predictive insights based on image analysis and is{' '}
                            <strong>not a clinical diagnosis</strong>. Results should be interpreted by a
                            qualified healthcare professional. Do not make clinical decisions based solely
                            on this result.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        className={styles.resetBtn}
                        id="new-screening-btn"
                    >
                        Run Another Screening
                    </button>
                </div>
            )}
        </div>
    );
}
