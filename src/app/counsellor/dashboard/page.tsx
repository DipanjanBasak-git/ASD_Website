'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import styles from './Counsellor.module.css';

export default function CounsellorDashboard() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        guardianName: '',
        guardianPhone: '',
        address: '',
        institutionId: 'inst-001' // mock for now
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
                    userId: 'counsellor-01', // mock user ID until session is fully hydrated
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
                <h1 className={styles.title}>Counsellor Dashboard</h1>
                <p className={styles.subtitle}>Patient Intake & Registration</p>
            </header>

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <h2 className={styles.cardTitle}>New Patient Registration</h2>

                    {successId && (
                        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 border border-green-200">
                            Success! Patient ID Generated: <strong>{successId}</strong>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.regForm}>
                        <Input
                            label="First Name" name="firstName" required
                            value={formData.firstName} onChange={handleChange}
                        />
                        <Input
                            label="Last Name" name="lastName" required
                            value={formData.lastName} onChange={handleChange}
                        />

                        <Input
                            label="Date of Birth"
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                        />

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Gender</label>
                            <select
                                name="gender"
                                className={styles.select}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <h3 className={`${styles.cardTitle} ${styles.fullWidth} mt-4`}>Guardian Information</h3>

                        <Input
                            label="Guardian Name" name="guardianName" required
                            value={formData.guardianName} onChange={handleChange}
                        />
                        <Input
                            label="Contact Phone" name="guardianPhone" required
                            value={formData.guardianPhone} onChange={handleChange}
                        />

                        <div className={styles.fullWidth}>
                            <Input
                                label="Address" name="address"
                                value={formData.address} onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register Patient'}
                        </button>
                    </form>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Pending Screenings</h3>
                        <p className="text-sm text-gray-500">No pending actions.</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Quick Stats</h3>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-500">Patients Registered Today</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
