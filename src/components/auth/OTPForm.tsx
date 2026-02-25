import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import styles from './AuthModal.module.css';

interface OTPFormProps {
    email: string;
    onSuccess: () => void;
}

export default function OTPForm({ email, onSuccess }: OTPFormProps) {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Close modal after successful verification
            onSuccess();

            // Redirect to login page internally to trigger auth or router refresh
            router.push('/login?registered=true');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className={styles.title}>Verify Email</h1>
            <p className={styles.subtitle}>Enter the code sent to {email}</p>

            {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee', color: '#c00', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleVerifyOTP} className={styles.formSpace}>
                <Input
                    label="Verification Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Enter 6-digit code"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.button}
                >
                    {isLoading ? 'Verifying...' : 'Verify & Complete Registration'}
                </button>
            </form>
        </>
    );
}
