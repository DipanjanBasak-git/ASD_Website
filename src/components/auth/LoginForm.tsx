import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import styles from './AuthModal.module.css';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

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
    const { t, triggerPostLoginModal } = useLanguage();

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

            // Call success handler to close auth modal
            onSuccess();

            // Trigger language selection modal after login
            triggerPostLoginModal();

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
            <h1 className={styles.title}>{t.auth.loginTitle}</h1>
            <p className={styles.subtitle}>{t.auth.loginSubtitle}</p>

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
                    label={t.auth.emailLabel}
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Input
                    label={t.auth.passwordLabel}
                    type="password"
                    placeholder={t.auth.passwordPlaceholder}
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
                    {isLoading ? t.auth.signingInBtn : t.auth.signInBtn}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <p className={styles.helperText}>
                    {t.auth.newUserPrompt}{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    >
                        {t.auth.registerLink}
                    </button>
                </p>
                <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
                    <a href="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t.auth.forgotPasswordLink}</a>
                </p>
            </div>

            <div className={styles.footer}>
                <p style={{ fontSize: '0.75rem', color: '#999', margin: 0 }}>{t.auth.restrictedNotice}</p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#999', marginBottom: 0 }}>
                    {t.auth.contactAt} <a href="mailto:smartasdplatform@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>smartasdplatform@gmail.com</a>
                </p>
            </div>
        </>
    );
}
