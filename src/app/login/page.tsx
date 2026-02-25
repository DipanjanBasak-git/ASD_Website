'use client';

import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import styles from '@/components/auth/AuthModal.module.css';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Container>
                <div
                    className={`${styles.modalContent} ${styles.modalMedium} ${styles.modalScrollable}`}
                    style={{
                        opacity: 1,
                        transform: 'none',
                        animation: 'none',
                        position: 'relative'
                    }}
                >
                    <div className={styles.formWrapper}>
                        <LoginForm
                            onSwitchToRegister={() => router.push('/register')}
                            onSuccess={() => { }}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}
