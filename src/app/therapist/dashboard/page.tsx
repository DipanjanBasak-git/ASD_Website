'use client';

import { useState, useEffect } from 'react';
import styles from './Therapist.module.css';
import classNames from 'classnames';

export default function TherapistDashboard() {
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
            // Find active visit or create new one (simplified for dashboard)
            // In real app, we'd select a specific visit
            const patient = patients.find(p => p.id === selectedPatient);
            const visitId = patient?.visits?.[0]?.id; // Use latest visit

            if (!visitId) {
                alert("No active visit found for this patient. Please ensure they are checked in.");
                return;
            }

            await fetch('/api/therapy/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'therapist-01', // Mock
                    patientId: selectedPatient,
                    visitId: visitId, // Mock
                    notes,
                    progress: "Stable"
                })
            });
            setNotes('');
            alert("Therapy notes saved successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to save notes.");
        } finally {
            setIsSaving(false);
        }
    };

    const activePatientData = patients.find(p => p.id === selectedPatient);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Therapy Session Console</h1>
                <p className={styles.subtitle}>Occupational Therapy & Intervention Log</p>
            </header>

            <div className={styles.layout}>
                <aside className={styles.patientList}>
                    <div className={styles.listHeader}>
                        My Patients ({patients.length})
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
                                <div className={styles.patientMeta}>ID: {p.patientUniqueId}</div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={styles.workspace}>
                    {selectedPatient && activePatientData ? (
                        <>
                            <div>
                                <h2 className={styles.workspaceTitle}>
                                    Session Notes: {activePatientData.firstName} {activePatientData.lastName}
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Stage: {activePatientData.pipelineStage}
                                </p>
                            </div>

                            <textarea
                                className={styles.notesArea}
                                placeholder="Enter detailed clinical observations, sensory profile updates, and intervention response..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />

                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving Encrypted Log...' : 'Sign & Save Record'}
                            </button>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            Select a patient from the list to begin charting.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
