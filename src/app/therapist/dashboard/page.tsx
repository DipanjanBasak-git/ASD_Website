'use client';

import { useState, useEffect } from 'react';
import styles from './Therapist.module.css';
import classNames from 'classnames';
import BackButton from '@/components/ui/BackButton';
import ProfessionalPrescriptionLookup from '@/components/prescriptions/ProfessionalPrescriptionLookup';
import { useLanguage } from '@/context/LanguageContext';

export default function TherapistDashboard() {
    const { t } = useLanguage();
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Mock fetch for now, reuse patient list API
        fetch('/api/patient/list')
            .then(res => res.json())
            .then(data => {
                if (data.success) setPatients(data.patients);
            });
    }, []);

    const handleSave = async () => {
        if (!selectedPatient) return;
        setIsSaving(true);
        try {
            const patient = patients.find(p => p.id === selectedPatient);
            const visitId = patient?.visits?.[0]?.id;

            if (!visitId) {
                alert(t.therapistDashboard.noActiveVisit);
                return;
            }

            await fetch('/api/therapy/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'therapist-01',
                    patientId: selectedPatient,
                    visitId: visitId,
                    notes,
                    progress: "Stable"
                })
            });
            setNotes('');
            alert(t.therapistDashboard.saveSuccess);
        } catch (error) {
            console.error(error);
            alert(t.therapistDashboard.saveFailed);
        } finally {
            setIsSaving(false);
        }
    };

    const activePatientData = patients.find(p => p.id === selectedPatient);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <BackButton label={t.common.backHome} href="/" />
                <h1 className={styles.title} style={{ marginTop: '0.75rem' }}>{t.therapistDashboard.title}</h1>
                <p className={styles.subtitle}>{t.therapistDashboard.subtitle}</p>
            </header>

            <div className={styles.layout}>
                <aside className={styles.patientList}>
                    <div className={styles.listHeader}>
                        {t.therapistDashboard.myPatients} ({patients.length})
                    </div>
                    <div className={styles.listContent}>
                        {patients.map(p => (
                            <div
                                key={p.id}
                                className={classNames(styles.patientItem, {
                                    [styles.active]: selectedPatient === p.id
                                })}
                                onClick={() => setSelectedPatient(p.id)}
                            >
                                <div className={styles.patientName}>{p.firstName} {p.lastName}</div>
                                <div className={styles.patientMeta}>{t.common.id}: {p.patientUniqueId}</div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={styles.workspace}>
                    {selectedPatient && activePatientData ? (
                        <>
                            <div>
                                <h2 className={styles.workspaceTitle}>
                                    {t.therapistDashboard.sessionNotes} {activePatientData.firstName} {activePatientData.lastName}
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    {t.therapistDashboard.stage} {activePatientData.pipelineStage}
                                </p>
                            </div>

                            <textarea
                                className={styles.notesArea}
                                placeholder={t.therapistDashboard.notesPlaceholder}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />

                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? t.therapistDashboard.savingBtn : t.therapistDashboard.saveBtn}
                            </button>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            {t.therapistDashboard.emptyState}
                        </div>
                    )}
                </main>
            </div>

            {/* ── Prescription Lookup ── */}
            <div style={{ padding: '0 2rem 2rem' }}>
                <ProfessionalPrescriptionLookup title={t.therapistDashboard.rxRecordsTitle} />
            </div>
        </div>
    );
}
