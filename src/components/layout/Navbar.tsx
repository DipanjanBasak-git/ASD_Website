'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import AuthModal, { AuthModalState } from '@/components/auth/AuthModal';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const isAuthPage = ['/login', '/register', '/forgot-password'].some(p => pathname?.startsWith(p));

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalState, setAuthModalState] = useState<AuthModalState>('ROLE_SELECTION');

    const openLoginModal = () => {
        setAuthModalState('LOGIN_FORM');
        setIsAuthModalOpen(true);
    };

    const openRegisterModal = () => {
        setAuthModalState('ROLE_SELECTION');
        setIsAuthModalOpen(true);
    };

    if (isAuthPage) return null;

    return (
        <>
            <nav className={styles.navbar}>
                <Container className={styles.navContainer}>
                    <div className={styles.logo}>
                        <Link href="/">ASD Research Platform</Link>
                    </div>
                    <ul className={styles.navLinks}>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/research">Research</Link></li>
                        {!isLoading && (
                            user ? (
                                <>
                                    <li>
                                        <button
                                            onClick={logout}
                                            className={styles.authLink}
                                            style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button onClick={openLoginModal} className={styles.authLink}>Login</button>
                                    <button onClick={openRegisterModal} className={styles.registerBtn}>Register</button>
                                </li>
                            )
                        )}
                    </ul>
                </Container>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialState={authModalState}
            />
        </>
    );
}
