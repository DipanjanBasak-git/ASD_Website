'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import styles from './Login.module.css';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setShowInfo(false);

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            setShowInfo(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <Container className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Institutional Access</h1>
                    <p className={styles.subtitle}>
                        Please sign in with your verified research or clinical credentials.
                    </p>

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? 'Connecting to institutional login…' : 'Sign in with SSO'}
                    </button>

                    <p className={styles.helperText}>
                        Access will be enabled during approved institutional deployment.
                    </p>

                    {showInfo && (
                        <div className={styles.statusMessage} role="alert">
                            Institutional authentication is not enabled in this research build.
                        </div>
                    )}

                    <div className={styles.infoFooter}>
                        <p>Restricted to authorized personnel only.</p>
                        <p style={{ marginTop: '0.25rem' }}>Session ID: placeholder-login-flow</p>
                    </div>
                </div>
            </Container>
        </div>
    );
}
