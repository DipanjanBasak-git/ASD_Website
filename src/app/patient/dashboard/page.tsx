'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import PrescriptionSection from '@/components/patient/PrescriptionSection';
import { useLanguage } from '@/context/LanguageContext';

type DashboardData = {
    profile: {
        id: string;
        name: string;
        dob: string;
        institution: string;
    };
    screenings: Array<{ date: string; tool: string; risk: string; status: string }>;
    prescriptions: Array<{ id: string; date: string; details: string; doctor: string; downloadUrl: string | null }>;
    therapy: Array<{ date: string; summary: string; progress: string | null }>;
};

export default function PatientDashboard() {
    const { t } = useLanguage();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/patient/dashboard');
                if (!res.ok) throw new Error('Failed to load dashboard data');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(t.patientDashboard.loadError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [t.patientDashboard.loadError]);

    if (loading) return <Container><div style={{ padding: '4rem 0', textAlign: 'center' }}>{t.patientDashboard.loadingPortal}</div></Container>;
    if (error) return <Container><div style={{ padding: '4rem 0', color: 'red' }}>{error}</div></Container>;
    if (!data) return null;

    return (
        <Container>
            <div style={{ padding: '2.5rem 0 4rem' }}>
                {/* ── Top nav: back + patient id ──────────────────────────────── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.75rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}>
                    <BackButton label={t.common.backHome} href="/" />
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>
                            {t.common.id}: {data.profile.id}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#888' }}>{data.profile.institution}</div>
                    </div>
                </div>

                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.patientDashboard.portalTitle}</h1>
                    <p style={{ color: '#666' }}>{t.patientDashboard.dashboardFor} <strong>{data.profile.name}</strong></p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Screenings */}
                    <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{t.patientDashboard.screeningHistory}</h2>
                        {data.screenings.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>{t.patientDashboard.noScreenings}</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {data.screenings.map((s, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f5f5f5' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{s.tool}</strong>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                background: s.risk === 'HIGH' ? '#fee2e2' : '#dcfce7',
                                                color: s.risk === 'HIGH' ? '#b91c1c' : '#15803d'
                                            }}>{s.risk} {t.patientDashboard.risk}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                            {new Date(s.date).toLocaleDateString()} • {s.status}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Link href="/screening" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 500 }}>
                            {t.patientDashboard.startNewScreening}
                        </Link>
                    </div>

                    {/* Prescriptions */}
                    <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <PrescriptionSection />
                    </div>

                    {/* Therapy */}
                    <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{t.patientDashboard.therapyProgress}</h2>
                        {data.therapy.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>{t.patientDashboard.noTherapy}</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {data.therapy.map((tItem, i) => (
                                    <li key={i} style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontWeight: '500' }}>{tItem.summary}</div>
                                        {tItem.progress && <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '2px' }}>{t.patientDashboard.progressLabel} {tItem.progress}</div>}
                                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(tItem.date).toLocaleDateString()}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </Container>
    );
}
