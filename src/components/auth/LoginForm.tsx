import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import styles from './AuthModal.module.css';
import { useAuth } from '@/context/AuthContext';

interface LoginFormProps {
    onSwitchToRegister: () => void;
    onSuccess: () => void;
}

export default function LoginForm({ onSwitchToRegister, onSuccess }: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { refreshUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Refresh auth state before redirecting
            await refreshUser();

            // Call success handler to close modal BEFORE redirecting
            onSuccess();

            // Redirect to role-specific dashboard
            router.push(data.redirectUrl);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>Please sign in with your credentials</p>

            {error && (
                <div style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    background: '#fee',
                    color: '#c00',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className={styles.formSpace}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.button}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <p className={styles.helperText}>
                    New user?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    >
                        Register
                    </button>
                </p>
                <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
                    <a href="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Forgot Password?</a>
                </p>
            </div>

            <div className={styles.footer}>
                <p style={{ fontSize: '0.75rem', color: '#999', margin: 0 }}>Restricted to authorized personnel only.</p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#999', marginBottom: 0 }}>
                    Contact at : <a href="mailto:smartasdplatform@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>smartasdplatform@gmail.com</a>
                </p>
            </div>
        </>
    );
}
