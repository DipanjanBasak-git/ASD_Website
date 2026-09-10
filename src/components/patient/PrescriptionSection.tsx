'use client';

/**
 * PrescriptionSection
 *
 * Replaces the static "No prescriptions available." card on the Patient Dashboard.
 * Provides: upload, view, digital prescription card, consent management.
 *
 * Uses the same CSS variable system and card patterns as the rest of the dashboard.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './PrescriptionSection.module.css';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ─────────────────────────────────────────────────────────────────────

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

interface AccessGrant {
    id: string;
    professionalId: string;
    grantedAt: string;
    professional: { fullName: string | null; id: string };
}

interface Prescription {
    id: string;
    originalFileName: string | null;
    fileMimeType: string | null;
    processingStatus: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
    aiExtractedData: AiExtractedData | null;
    aiProcessedAt: string | null;
    aiFailureReason: string | null;
    details: string | null;
    prescribedBy: string | null;
    createdAt: string;
    updatedAt: string;
    accessGrants: AccessGrant[];
}

interface SearchResult {
    id: string;
    fullName: string | null;
    role: { name: string };
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const { t } = useLanguage();
    const cls = {
        PROCESSING: styles.statusProcessing,
        PROCESSED: styles.statusProcessed,
        FAILED: styles.statusFailed,
        PENDING: styles.statusPending,
    }[status] || styles.statusPending;

    const label = {
        PROCESSING: t.prescriptions.statusProcessing,
        PROCESSED: t.prescriptions.statusProcessed,
        FAILED: t.prescriptions.statusFailed,
        PENDING: t.prescriptions.statusPending,
    }[status] || status;

    return <span className={`${styles.statusBadge} ${cls}`}>{label}</span>;
}

// ─── Digital Prescription Card ─────────────────────────────────────────────────

function DigitalRxCard({
    data,
    prescriptionId,
    fileName,
}: {
    data: AiExtractedData;
    prescriptionId: string;
    fileName: string | null;
}) {
    const { t } = useLanguage();
    const handleViewOriginal = useCallback(() => {
        window.open(`/api/prescriptions/${prescriptionId}/file`, '_blank', 'noopener,noreferrer');
    }, [prescriptionId]);

    if (data.status === 'FAILED') {
        return (
            <div className={styles.rxCard}>
                <div className={styles.rxCardTitle}>{t.prescriptions.digitalRxTitle}</div>
                <p className={styles.rxFailedMsg}>
                    {data.failureReason ||
                        "We couldn't reliably extract all prescription details. Please view the original prescription."}
                </p>
                <div className={styles.itemActions} style={{ marginTop: '0.75rem' }}>
                    <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={handleViewOriginal}>
                        {t.prescriptions.viewOriginal}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.rxCard}>
            <div className={styles.rxCardTitle}>{t.prescriptions.digitalRxTitle}</div>

            {/* Header fields */}
            {data.prescriptionDate && (
                <div className={styles.rxField}>
                    <span className={styles.rxFieldLabel}>{t.prescriptions.date}</span>
                    <span className={styles.rxFieldValue}>{data.prescriptionDate}</span>
                </div>
            )}
            {data.doctorName && (
                <div className={styles.rxField}>
                    <span className={styles.rxFieldLabel}>{t.prescriptions.doctor}</span>
                    <span className={styles.rxFieldValue}>{data.doctorName}</span>
                </div>
            )}
            {data.doctorLicense && (
                <div className={styles.rxField}>
                    <span className={styles.rxFieldLabel}>{t.prescriptions.license}</span>
                    <span className={styles.rxFieldValue}>{data.doctorLicense}</span>
                </div>
            )}
            {data.diagnosis && (
                <div className={styles.rxField}>
                    <span className={styles.rxFieldLabel}>{t.prescriptions.clinicalNotes}</span>
                    <span className={styles.rxFieldValue}>{data.diagnosis}</span>
                </div>
            )}

            {/* Medicine list */}
            {data.medicines && data.medicines.length > 0 && (
                <>
                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '1rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t.prescriptions.medications}
                    </div>
                    <ul className={styles.rxMedicineList}>
                        {data.medicines.map((med, i) => (
                            <li key={i} className={styles.rxMedicineItem}>
                                <div className={styles.rxMedicineName}>
                                    {i + 1}. {med.name || 'Unknown medication'}
                                </div>
                                <div className={styles.rxMedicineDetails}>
                                    {med.strength && (
                                        <div className={styles.rxMedicineDetail}>
                                            <span>{t.prescriptions.strength}</span>{med.strength}
                                        </div>
                                    )}
                                    {med.dosage && (
                                        <div className={styles.rxMedicineDetail}>
                                            <span>{t.prescriptions.dosage}</span>{med.dosage}
                                        </div>
                                    )}
                                    {med.frequency && (
                                        <div className={styles.rxMedicineDetail}>
                                            <span>{t.prescriptions.frequency}</span>{med.frequency}
                                        </div>
                                    )}
                                    {med.duration && (
                                        <div className={styles.rxMedicineDetail}>
                                            <span>{t.prescriptions.duration}</span>{med.duration}
                                        </div>
                                    )}
                                    {med.route && (
                                        <div className={styles.rxMedicineDetail}>
                                            <span>{t.prescriptions.route}</span>{med.route}
                                        </div>
                                    )}
                                    {med.instructions && (
                                        <div className={styles.rxMedicineDetail} style={{ gridColumn: '1 / -1' }}>
                                            <span>{t.prescriptions.instructions}</span>{med.instructions}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {data.additionalNotes && (
                <div className={styles.rxField} style={{ marginTop: '0.75rem' }}>
                    <span className={styles.rxFieldLabel}>{t.prescriptions.notes}</span>
                    <span className={styles.rxFieldValue}>{data.additionalNotes}</span>
                </div>
            )}

            {/* Confidence & disclaimer */}
            <div className={styles.rxField} style={{ marginTop: '0.5rem' }}>
                <span className={styles.rxFieldLabel}>{t.prescriptions.confidence}</span>
                <span className={styles.rxFieldValue}>{data.extractionConfidence}</span>
            </div>

            <div className={styles.rxDisclaimer}>
                {t.prescriptions.disclaimer}
            </div>

            <div className={styles.itemActions} style={{ marginTop: '0.75rem' }}>
                <button
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                    onClick={handleViewOriginal}
                >
                    {t.prescriptions.viewOriginal}
                </button>
            </div>
        </div>
    );
}

// ─── Access Manager (Consent Panel) ───────────────────────────────────────────

function AccessManager({
    prescription,
    onRefresh,
}: {
    prescription: Prescription;
    onRefresh: () => void;
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isGranting, setIsGranting] = useState(false);
    const [grantMsg, setGrantMsg] = useState<string | null>(null);
    const [grantError, setGrantError] = useState<string | null>(null);
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced professional search
    useEffect(() => {
        if (searchRef.current) clearTimeout(searchRef.current);
        if (searchQuery.length < 2) { setSearchResults([]); return; }

        searchRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/prescriptions/professionals/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data.professionals || []);
            } catch { setSearchResults([]); }
        }, 300);

        return () => { if (searchRef.current) clearTimeout(searchRef.current); };
    }, [searchQuery]);

    const grantAccess = async (professional: SearchResult) => {
        setIsGranting(true);
        setGrantMsg(null);
        setGrantError(null);
        try {
            const res = await fetch(`/api/prescriptions/${prescription.id}/grants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professionalId: professional.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setGrantMsg(`Access granted to ${professional.fullName || 'Professional'}`);
                setSearchQuery('');
                setSearchResults([]);
                onRefresh();
            } else {
                setGrantError(data.error || 'Failed to grant access');
            }
        } catch {
            setGrantError('Network error — please try again');
        } finally {
            setIsGranting(false);
        }
    };

    const revokeAccess = async (professionalId: string, name: string) => {
        if (!confirm(`Revoke access for ${name}? They will immediately lose access to this prescription.`)) return;
        try {
            const res = await fetch(`/api/prescriptions/${prescription.id}/grants/${professionalId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                onRefresh();
            }
        } catch {
            alert('Failed to revoke access. Please try again.');
        }
    };

    return (
        <div className={styles.accessPanel}>
            <div className={styles.accessPanelTitle}>{t.prescriptions.accessTitle}</div>

            {/* Active grants */}
            {prescription.accessGrants.length > 0 ? (
                <>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.4rem' }}>
                        {t.prescriptions.authorizedPros}
                    </div>
                    {prescription.accessGrants.map(grant => (
                        <div key={grant.id} className={styles.grantItem}>
                            <div>
                                <span className={styles.grantName}>
                                    {grant.professional.fullName || 'Professional'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.78rem', color: '#888' }}>
                                    {t.prescriptions.granted} {new Date(grant.grantedAt).toLocaleDateString()}
                                </span>
                                <button
                                    className={styles.revokeBtn}
                                    onClick={() => revokeAccess(grant.professionalId, grant.professional.fullName || 'this professional')}
                                >
                                    {t.prescriptions.revoke}
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '0.5rem' }}>
                    {t.prescriptions.noAccess}
                </div>
            )}

            {/* Grant new access */}
            <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.3rem' }}>
                    {t.prescriptions.grantAccessTo}
                </div>
                <div className={styles.grantSearch}>
                    <input
                        className={styles.grantSearchInput}
                        type="text"
                        placeholder={t.prescriptions.searchPlaceholder}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        disabled={isGranting}
                    />
                </div>
                {searchResults.length > 0 && (
                    <ul className={styles.grantSearchResults}>
                        {searchResults.map(p => (
                            <li
                                key={p.id}
                                className={styles.grantSearchResultItem}
                                onClick={() => grantAccess(p)}
                            >
                                <span>{p.fullName || 'Unknown'}</span>
                                <span style={{ fontSize: '0.75rem', color: '#888', background: '#f0f0f0', padding: '1px 6px', borderRadius: '10px' }}>
                                    {p.role.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                {grantMsg && <div className={styles.successMsg}>{grantMsg}</div>}
                {grantError && <div className={styles.errorMsg}>{grantError}</div>}
            </div>
        </div>
    );
}

// ─── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    const MAX_SIZE = 10 * 1024 * 1024;

    const handleFile = (selected: File) => {
        setError(null);
        if (!ALLOWED_TYPES.includes(selected.type)) {
            setError('Invalid file type. Only JPG and PNG images are accepted.');
            return;
        }
        if (selected.size === 0) {
            setError('The file appears to be empty.');
            return;
        }
        if (selected.size > MAX_SIZE) {
            setError('File is too large. Maximum size is 10 MB.');
            return;
        }
        setFile(selected);
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target?.result as string);
        reader.readAsDataURL(selected);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setUploadState('uploading');
        setError(null);

        const formData = new FormData();
        formData.append('prescription', file);

        try {
            const res = await fetch('/api/prescriptions', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Upload failed. Please try again.');
                setUploadState('error');
                return;
            }

            setUploadState('processing');
            // Show processing state briefly, then notify parent
            setTimeout(() => {
                setUploadState('done');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1200);
            }, 1500);

        } catch {
            setError('Network error. Please check your connection and try again.');
            setUploadState('error');
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        setUploadState('idle');
    };

    return (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>

                <h2 className={styles.modalTitle} id="upload-modal-title">{t.prescriptions.uploadModalTitle}</h2>
                <p className={styles.modalSubtitle}>
                    {t.prescriptions.uploadModalSubtitle}
                </p>

                {/* Processing states */}
                {uploadState === 'uploading' && (
                    <div className={styles.processingState}>
                        <div className={styles.spinner} />
                        {t.prescriptions.uploadingMsg}
                    </div>
                )}
                {uploadState === 'processing' && (
                    <div className={styles.processingState}>
                        <div className={styles.spinner} />
                        {t.prescriptions.extractingMsg}
                    </div>
                )}
                {uploadState === 'done' && (
                    <div className={styles.successMsg}>
                        {t.prescriptions.successMsg}
                    </div>
                )}

                {/* Upload zone (only show when idle/error) */}
                {(uploadState === 'idle' || uploadState === 'error') && !file && (
                    <div
                        className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                        aria-label="Upload prescription image"
                    >
                        <div className={styles.uploadZoneIcon}>📄</div>
                        <p className={styles.uploadZoneText}>{t.prescriptions.dragDrop}</p>
                        <p className={styles.uploadZoneHint}>{t.prescriptions.or}</p>
                        <button
                            type="button"
                            className={styles.browseBtn}
                            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        >
                            {t.prescriptions.browse}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className={styles.hiddenInput}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                        />
                    </div>
                )}

                {/* File preview */}
                {file && preview && uploadState === 'idle' && (
                    <div className={styles.previewContainer}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Prescription preview" className={styles.previewImage} />
                        <div className={styles.previewFileName}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</div>
                        <button className={styles.clearPreviewBtn} onClick={clearFile} aria-label="Remove file">✕</button>
                    </div>
                )}

                {error && <div className={styles.errorMsg}>{error}</div>}

                {/* Submit */}
                {file && (uploadState === 'idle' || uploadState === 'error') && (
                    <button
                        id="prescription-upload-submit"
                        className={styles.submitBtn}
                        onClick={handleUpload}
                        disabled={isUploading}
                    >
                        {t.prescriptions.uploadSubmit}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main PrescriptionSection ──────────────────────────────────────────────────

export default function PrescriptionSection() {
    const { t } = useLanguage();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchPrescriptions = useCallback(async () => {
        try {
            const res = await fetch('/api/prescriptions');
            if (!res.ok) throw new Error('Failed to load prescriptions');
            const data = await res.json();
            setPrescriptions(data.prescriptions || []);
        } catch {
            setError(t.prescriptions.loadError);
        } finally {
            setLoading(false);
        }
    }, [t.prescriptions.loadError]);

    useEffect(() => {
        fetchPrescriptions();
    }, [fetchPrescriptions]);

    // Auto-poll for PROCESSING prescriptions (every 5 seconds)
    useEffect(() => {
        const hasProcessing = prescriptions.some(p =>
            p.processingStatus === 'PROCESSING' || p.processingStatus === 'PENDING'
        );
        if (!hasProcessing) return;
        const timer = setTimeout(fetchPrescriptions, 5000);
        return () => clearTimeout(timer);
    }, [prescriptions, fetchPrescriptions]);

    const handleDelete = async (id: string) => {
        if (!confirm(t.prescriptions.confirmDelete)) return;
        try {
            const res = await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPrescriptions(prev => prev.filter(p => p.id !== id));
                if (expandedId === id) setExpandedId(null);
            } else {
                alert('Failed to delete prescription. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        }
    };

    const handleRetry = async (id: string) => {
        try {
            // Optimistically update UI to show processing
            setPrescriptions(prev =>
                prev.map(p => p.id === id ? { ...p, processingStatus: 'PROCESSING' as const, aiFailureReason: null } : p)
            );
            const res = await fetch(`/api/prescriptions/${id}/retry`, { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Retry failed. Please try again.');
                fetchPrescriptions(); // Revert to actual state
            }
        } catch {
            alert('Network error. Please try again.');
            fetchPrescriptions();
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <>
            {/* ── Section header ── */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t.prescriptions.title}</h2>
                <button
                    id="prescription-upload-btn"
                    className={styles.uploadBtn}
                    onClick={() => setShowUploadModal(true)}
                    aria-label="Upload new prescription"
                >
                    <span>+</span> {t.prescriptions.uploadBtn}
                </button>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className={styles.processingState}>
                    <div className={styles.spinner} /> {t.prescriptions.loading}
                </div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : prescriptions.length === 0 ? (
                <p className={styles.emptyState}>
                    {t.prescriptions.emptyState}<br />
                    {t.prescriptions.emptySubtext}
                </p>
            ) : (
                <ul className={styles.prescriptionList}>
                    {prescriptions.map((p, index) => (
                        <li key={p.id} className={styles.prescriptionItem}>
                            {/* Item header */}
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemName}>
                                        {t.prescriptions.prescriptionNumber}{prescriptions.length - index}
                                        {p.originalFileName && (
                                            <span style={{ fontWeight: 400, color: '#888', marginLeft: '0.4rem', fontSize: '0.8rem' }}>
                                                ({p.originalFileName})
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.itemDate}>
                                        {t.prescriptions.uploaded} {new Date(p.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <StatusBadge status={p.processingStatus} />
                            </div>

                            {/* Processing indicator */}
                            {(p.processingStatus === 'PROCESSING' || p.processingStatus === 'PENDING') && (
                                <div className={styles.processingState} style={{ marginTop: '0.5rem' }}>
                                    <div className={styles.spinner} />
                                    {t.prescriptions.extractingMsg}
                                </div>
                            )}

                            {/* Actions */}
                            <div className={styles.itemActions}>
                                {p.processingStatus === 'PROCESSED' && (
                                    <button
                                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                        onClick={() => toggleExpand(p.id)}
                                        aria-expanded={expandedId === p.id}
                                    >
                                        {expandedId === p.id ? t.prescriptions.hideDetails : t.prescriptions.viewDigital}
                                    </button>
                                )}
                                {p.processingStatus === 'FAILED' && (
                                    <>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                            onClick={() => handleRetry(p.id)}
                                        >
                                            {t.prescriptions.retryParsing}
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                                            onClick={() => window.open(`/api/prescriptions/${p.id}/file`, '_blank', 'noopener,noreferrer')}
                                        >
                                            {t.prescriptions.viewOriginal}
                                        </button>
                                    </>
                                )}
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                                    onClick={() => toggleExpand(p.id)}
                                    aria-label="Manage prescription access"
                                >
                                    {expandedId === p.id ? t.prescriptions.collapse : t.prescriptions.accessDetails}
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                    onClick={() => handleDelete(p.id)}
                                    aria-label="Delete prescription"
                                >
                                    {t.prescriptions.delete}
                                </button>
                            </div>

                            {/* Expanded view */}
                            {expandedId === p.id && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    {/* Digital RX card */}
                                    {p.aiExtractedData && (
                                        <DigitalRxCard
                                            data={p.aiExtractedData}
                                            prescriptionId={p.id}
                                            fileName={p.originalFileName}
                                        />
                                    )}

                                    {/* Access manager */}
                                    <AccessManager
                                        prescription={p}
                                        onRefresh={fetchPrescriptions}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Upload modal */}
            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        fetchPrescriptions();
                    }}
                />
            )}
        </>
    );
}
