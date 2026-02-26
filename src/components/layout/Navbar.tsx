'use client';

import { useState, useRef, useEffect } from 'react';
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
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openLoginModal = () => {
        setAuthModalState('LOGIN_FORM');
        setIsAuthModalOpen(true);
    };

    const openRegisterModal = () => {
        setAuthModalState('ROLE_SELECTION');
        setIsAuthModalOpen(true);
    };

    // Get display name and initials
    const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';
    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const getDashboardPath = () => {
        if (!user?.role) return '/';
        const roleMap: Record<string, string> = {
            PATIENT: '/patient/dashboard',
            DOCTOR: '/doctor/dashboard',
            THERAPIST: '/therapist/dashboard',
            COUNSELLOR: '/counsellor/dashboard',
        };
        return roleMap[user.role] || '/';
    };

    if (isAuthPage) return null;

    return (
        <>
            <nav className={styles.navbar}>
                <Container className={styles.navContainer}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <Link href="/">ASD Research Platform</Link>
                    </div>

                    {/* Nav links + profile */}
                    <div className={styles.rightSection}>
                        <ul className={styles.navLinks}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/research">Research</Link></li>
                        </ul>

                        {!isLoading && (
                            user ? (
                                /* ── Profile Dropdown ─────────────────────────── */
                                <div className={styles.profileWrapper} ref={dropdownRef}>
                                    <button
                                        className={styles.profileTrigger}
                                        onClick={() => setIsProfileOpen(v => !v)}
                                        aria-haspopup="true"
                                        aria-expanded={isProfileOpen}
                                        aria-label="Open profile menu"
                                        id="profile-menu-btn"
                                    >
                                        <span className={styles.avatar}>{initials}</span>
                                        <span className={styles.profileName}>{displayName.split(' ')[0]}</span>
                                        <svg
                                            className={`${styles.chevron} ${isProfileOpen ? styles.chevronOpen : ''}`}
                                            width="14" height="14" viewBox="0 0 14 14" fill="none"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {isProfileOpen && (
                                        <div className={styles.dropdown} role="menu">
                                            <div className={styles.dropdownUser}>
                                                <div className={styles.dropdownName}>{displayName}</div>
                                                <div className={styles.dropdownRole}>{user.role}</div>
                                            </div>
                                            <div className={styles.dropdownDivider} />
                                            <Link
                                                href={getDashboardPath()}
                                                className={styles.dropdownItem}
                                                role="menuitem"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                                                    <path d="M1.5 7.5L7.5 1.5L13.5 7.5M2.5 6.5V12.5C2.5 13.05 2.95 13.5 3.5 13.5H6V9.5H9V13.5H11.5C12.05 13.5 12.5 13.05 12.5 12.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Dashboard
                                            </Link>
                                            <div className={styles.dropdownDivider} />
                                            <button
                                                className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                                                role="menuitem"
                                                onClick={() => { setIsProfileOpen(false); logout(); }}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                                                    <path d="M10 1H13.5C13.78 1 14 1.22 14 1.5V13.5C14 13.78 13.78 14 13.5 14H10M6 10.5L9.5 7M9.5 7L6 3.5M9.5 7H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ── Auth buttons ─────────────────────────────── */
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <button onClick={openLoginModal} className={styles.authLink}>Login</button>
                                    <button onClick={openRegisterModal} className={styles.registerBtn}>Register</button>
                                </div>
                            )
                        )}
                    </div>
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
