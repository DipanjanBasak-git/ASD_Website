'use client';

import { useEffect, useState } from 'react';
import styles from './Doctor.module.css';
import classNames from 'classnames';

interface Patient {
    id: string;
    patientUniqueId: string;
    firstName: string;
    lastName: string;
    pipelineStage: string;
    riskFlags?: { riskLevel: string }[];
}

export default function DoctorDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [stats, setStats] = useState({ highRisk: 0, pending: 0 });

    useEffect(() => {
        // Fetch Patients
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patient/list');
                const data = await res.json();
                if (data.success) {
                    setPatients(data.patients);
                    // Calc stats
                    const high = data.patients.filter((p: any) => p.riskFlags?.length > 0).length;
                    setStats({ highRisk: high, pending: data.patients.length });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Clinical Review Dashboard</h1>
                    <p className={styles.subtitle}>
                        Pending Review: <strong>{stats.pending}</strong> | High Risk Alerts: <strong className="text-red-600">{stats.highRisk}</strong>
                    </p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.refreshBtn} onClick={() => window.location.reload()}>Refresh List</button>
                    {/* <button className="bg-blue-600 text-white px-4 py-2 rounded">New Assessment</button> */}
                </div>
            </header>

            <div className={styles.grid}>
                {patients.map(patient => {
                    const isHighRisk = patient.riskFlags && patient.riskFlags.length > 0;
                    return (
                        <div key={patient.id} className={styles.patientCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.patientName}>{patient.firstName} {patient.lastName}</div>
                                <div className={styles.idBadge}>{patient.patientUniqueId}</div>
                            </div>
                            <div className={styles.cardBody}>
                                <div>Status: <span className="font-medium">{patient.pipelineStage}</span></div>

                                {isHighRisk ? (
                                    <div className={classNames(styles.riskTag, styles.ItemHigh)}>
                                        ⚠️ H-RISK DETECTED
                                    </div>
                                ) : (
                                    <div className={classNames(styles.riskTag, styles.ItemLow)}>
                                        Stable / No Flags
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {patients.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No patients assigned to your review queue.
                    </div>
                )}
            </div>
        </div>
    );
}
