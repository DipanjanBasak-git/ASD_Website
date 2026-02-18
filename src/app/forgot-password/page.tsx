'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import styles from '../login/Login.module.css';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reset code');
            }

            setSuccess(data.message);
            setStep('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setSuccess(data.message);
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <Container className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>
                        {step === 'email'
                            ? 'Enter your email to receive a reset code'
                            : 'Enter the code and your new password'}
                    </p>

                    {error && (
                        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee', color: '#c00', borderRadius: '4px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#efe', color: '#060', borderRadius: '4px', fontSize: '0.9rem' }}>
                            {success}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleRequestOTP} className={styles.formSpace}>
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={styles.button}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className={styles.formSpace}>
                            <Input
                                label="Verification Code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                            />

                            <Input
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={styles.button}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}

                    <p className={styles.helperText} style={{ marginTop: '1.5rem' }}>
                        Remember your password? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Login</Link>
                    </p>
                </div>
            </Container>
        </div>
    );
}
