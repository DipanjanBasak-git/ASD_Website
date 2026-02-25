import { useState } from 'react';
import Input from '@/components/ui/Input';
import styles from './AuthModal.module.css';

export type Role = 'PATIENT' | 'DOCTOR' | 'THERAPIST' | 'COUNSELLOR';

interface RegisterFormProps {
    role: Role;
    onBackToRoles: () => void;
    onSuccess: (email: string) => void;
}

export default function RegisterForm({ role, onBackToRoles, onSuccess }: RegisterFormProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [phone, setPhone] = useState('');
    const [consent, setConsent] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Password validation logic
    const passwordRules = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', valid: /[a-z]/.test(password) },
        { label: 'Contains number', valid: /[0-9]/.test(password) },
        { label: 'Contains special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (role === 'PATIENT' && !consent) {
            setError('You must accept the consent agreement');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    fullName,
                    email,
                    password,
                    dob: role === 'PATIENT' ? dob : undefined,
                    guardianName: role === 'PATIENT' ? guardianName : undefined,
                    phone
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Pass email back for OTP step
            onSuccess(email);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className={styles.title}>
                {role === 'PATIENT' ? 'Patient Registration' : `${role.charAt(0) + role.slice(1).toLowerCase()} Registration`}
            </h1>
            <p className={styles.subtitle}>Fill in your details</p>

            {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee', color: '#c00', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formSpace}>
                <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    tooltip={
                        <div>
                            <p style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>Password Requirements:</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {passwordRules.map((r, idx) => (
                                    <li key={idx} style={{
                                        color: r.valid ? '#4ade80' : '#ffa5a5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        marginBottom: '0.125rem'
                                    }}>
                                        <span>{r.valid ? '✓' : '•'}</span>
                                        {r.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                />

                {role === 'PATIENT' && (
                    <>
                        <Input
                            label="Date of Birth"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            label="Parent/Guardian Name"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </>
                )}

                <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isLoading}
                />

                {role === 'PATIENT' && (
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                style={{ marginTop: '0.25rem' }}
                            />
                            <span>I consent to the collection and processing of my data for research purposes</span>
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.button}
                    style={{ marginTop: '1rem' }}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <button
                onClick={onBackToRoles}
                style={{
                    marginTop: '1.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.9rem'
                }}
            >
                ← Back to role selection
            </button>
        </>
    );
}
