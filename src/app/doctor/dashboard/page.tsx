'use client';

import { useEffect, useState } from 'react';
import styles from './Doctor.module.css';
import classNames from 'classnames';
import BackButton from '@/components/ui/BackButton';
import ProfessionalPrescriptionLookup from '@/components/prescriptions/ProfessionalPrescriptionLookup';
import { useLanguage } from '@/context/LanguageContext';

interface Patient {
    id: string;
    patientUniqueId: string;
    firstName: string;
    lastName: string;
    pipelineStage: string;
    riskFlags?: { riskLevel: string }[];
}

export default function DoctorDashboard() {
    const { t } = useLanguage();
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
                    <BackButton label={t.common.backHome} href="/" />
                    <h1 className={styles.title} style={{ marginTop: '0.75rem' }}>{t.doctorDashboard.title}</h1>
                    <p className={styles.subtitle}>
                        {t.doctorDashboard.pendingReview} <strong>{stats.pending}</strong> | {t.doctorDashboard.highRiskAlerts} <strong className="text-red-600">{stats.highRisk}</strong>
                    </p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.refreshBtn} onClick={() => window.location.reload()}>{t.doctorDashboard.refreshList}</button>
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
                                <div>{t.doctorDashboard.status} <span className="font-medium">{patient.pipelineStage}</span></div>

                                {isHighRisk ? (
                                    <div className={classNames(styles.riskTag, styles.ItemHigh)}>
                                        {t.doctorDashboard.highRiskDetected}
                                    </div>
                                ) : (
                                    <div className={classNames(styles.riskTag, styles.ItemLow)}>
                                        {t.doctorDashboard.stableNoFlags}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {patients.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {t.doctorDashboard.noPatients}
                    </div>
                )}
            </div>

            {/* ── Prescription Lookup ── */}
            <div style={{ padding: '0 2rem 2rem' }}>
                <ProfessionalPrescriptionLookup title={t.doctorDashboard.rxRecordsTitle} />
            </div>
        </div>
    );
}
