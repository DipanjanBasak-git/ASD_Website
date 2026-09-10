'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import styles from './Counsellor.module.css';
import BackButton from '@/components/ui/BackButton';
import ProfessionalPrescriptionLookup from '@/components/prescriptions/ProfessionalPrescriptionLookup';
import { useLanguage } from '@/context/LanguageContext';

export default function CounsellorDashboard() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        guardianName: '',
        guardianPhone: '',
        address: '',
        institutionId: 'inst-001'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successId, setSuccessId] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/patient/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'counsellor-01',
                    ...formData
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccessId(data.uniqueId);
                // Reset form
                setFormData({ ...formData, firstName: '', lastName: '', guardianPhone: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <BackButton label={t.common.backHome} href="/" />
                <h1 className={styles.title} style={{ marginTop: '0.75rem' }}>{t.counsellorDashboard.title}</h1>
                <p className={styles.subtitle}>{t.counsellorDashboard.subtitle}</p>
            </header>

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <h2 className={styles.cardTitle}>{t.counsellorDashboard.newRegistration}</h2>

                    {successId && (
                        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 border border-green-200">
                            {t.counsellorDashboard.successGen} <strong>{successId}</strong>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.regForm}>
                        <Input
                            label={t.counsellorDashboard.firstName} name="firstName" required
                            value={formData.firstName} onChange={handleChange}
                        />
                        <Input
                            label={t.counsellorDashboard.lastName} name="lastName" required
                            value={formData.lastName} onChange={handleChange}
                        />

                        <Input
                            label={t.counsellorDashboard.dob}
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                        />

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t.counsellorDashboard.gender}</label>
                            <select
                                name="gender"
                                className={styles.select}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">{t.counsellorDashboard.male}</option>
                                <option value="Female">{t.counsellorDashboard.female}</option>
                                <option value="Other">{t.counsellorDashboard.other}</option>
                            </select>
                        </div>

                        <h3 className={`${styles.cardTitle} ${styles.fullWidth} mt-4`}>{t.counsellorDashboard.guardianInfo}</h3>

                        <Input
                            label={t.counsellorDashboard.guardianName} name="guardianName" required
                            value={formData.guardianName} onChange={handleChange}
                        />
                        <Input
                            label={t.counsellorDashboard.contactPhone} name="guardianPhone" required
                            value={formData.guardianPhone} onChange={handleChange}
                        />

                        <div className={styles.fullWidth}>
                            <Input
                                label={t.counsellorDashboard.address} name="address"
                                value={formData.address} onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? t.counsellorDashboard.registeringBtn : t.counsellorDashboard.registerBtn}
                        </button>
                    </form>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t.counsellorDashboard.pendingScreenings}</h3>
                        <p className="text-sm text-gray-500">{t.counsellorDashboard.noPending}</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t.counsellorDashboard.quickStats}</h3>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-500">{t.counsellorDashboard.registeredToday}</div>
                    </div>
                </div>
            </div>

            {/* ── Prescription Lookup ── */}
            <div style={{ padding: '0 2rem 2rem' }}>
                <ProfessionalPrescriptionLookup title={t.counsellorDashboard.rxRecordsTitle} />
            </div>
        </div>
    );
}
