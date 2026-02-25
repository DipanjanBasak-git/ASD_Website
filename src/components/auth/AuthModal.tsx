'use client';

import { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';
import LoginForm from './LoginForm';
import RegisterForm, { Role } from './RegisterForm';
import OTPForm from './OTPForm';

export type AuthModalState = 'ROLE_SELECTION' | 'LOGIN_FORM' | 'REGISTER_FORM' | 'OTP_FORM';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialState?: AuthModalState;
}

export default function AuthModal({ isOpen, onClose, initialState = 'ROLE_SELECTION' }: AuthModalProps) {
    const [step, setStep] = useState<AuthModalState>(initialState);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [registeredEmail, setRegisteredEmail] = useState<string>('');
    const [isClosing, setIsClosing] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(initialState);
            setSelectedRole(null);
            setIsClosing(false);

            // Add focus trap by disabling background scrolling
            document.body.style.overflow = 'hidden';

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    handleClose();
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, initialState]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for fade out animation if we added one (or just close immediately)
    };

    if (!isOpen) return null;

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep('REGISTER_FORM');
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div
                className={`${styles.modalContent} ${step === 'ROLE_SELECTION' ? styles.modalWide : styles.modalMedium} ${step !== 'ROLE_SELECTION' ? styles.modalScrollable : ''}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                role="dialog"
                aria-modal="true"
            >
                <button className={styles.closeButton} onClick={handleClose} aria-label="Close modal">
                    &times;
                </button>

                {step === 'ROLE_SELECTION' && (
                    <>
                        <h1 className={styles.title}>Welcome</h1>
                        <p className={styles.subtitle}>Select your role to continue registration</p>

                        <div className={styles.roleGrid}>
                            <button className={styles.roleBox} onClick={() => handleRoleSelect('PATIENT')}>
                                <div className={styles.roleIcon}>
                                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                                </div>
                                <div className={styles.roleContent}>
                                    <span className={styles.roleTitle}>Patient / Guardian</span>
                                    <span className={styles.roleDesc}>Register for monitoring and support</span>
                                </div>
                            </button>

                            <button className={styles.roleBox} onClick={() => handleRoleSelect('DOCTOR')}>
                                <div className={styles.roleIcon}>
                                    <svg viewBox="0 0 24 24"><path d="M18 14.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" opacity=".3" /><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM12 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.76 1.29 6 2H6z" /></svg>
                                </div>
                                <div className={styles.roleContent}>
                                    <span className={styles.roleTitle}>Doctor</span>
                                    <span className={styles.roleDesc}>Access clinical tools and patient records</span>
                                </div>
                            </button>

                            <button className={styles.roleBox} onClick={() => handleRoleSelect('THERAPIST')}>
                                <div className={styles.roleIcon}>
                                    <svg viewBox="0 0 24 24"><path d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 11.02c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 5c-2.33 0-7 1.17-7 3.5V17h14v-1.48c0-2.33-4.67-3.5-7-3.5zm-5 2.5c.6-.36 2.45-1 5-1s4.41.64 5 1v.5H7v-.5z" /></svg>
                                </div>
                                <div className={styles.roleContent}>
                                    <span className={styles.roleTitle}>Therapist</span>
                                    <span className={styles.roleDesc}>Manage therapy sessions and progress</span>
                                </div>
                            </button>

                            <button className={styles.roleBox} onClick={() => handleRoleSelect('COUNSELLOR')}>
                                <div className={styles.roleIcon}>
                                    <svg viewBox="0 0 24 24"><path d="M21 3H3C1.9 3 1.01 3.9 1.01 5L1 21l4-4h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5.17L4 18.17V5h17v12z" /></svg>
                                </div>
                                <div className={styles.roleContent}>
                                    <span className={styles.roleTitle}>Counsellor</span>
                                    <span className={styles.roleDesc}>Provide guidance and consultations</span>
                                </div>
                            </button>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <p className={styles.helperText}>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setStep('LOGIN_FORM')}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </>
                )}

                {step === 'LOGIN_FORM' && (
                    <div className={styles.formWrapper}>
                        <LoginForm
                            onSwitchToRegister={() => setStep('ROLE_SELECTION')}
                            onSuccess={handleClose}
                        />
                    </div>
                )}

                {step === 'REGISTER_FORM' && selectedRole && (
                    <div className={styles.formWrapper}>
                        <RegisterForm
                            role={selectedRole}
                            onBackToRoles={() => setStep('ROLE_SELECTION')}
                            onSuccess={(email) => {
                                setRegisteredEmail(email);
                                setStep('OTP_FORM');
                            }}
                        />
                    </div>
                )}

                {step === 'OTP_FORM' && registeredEmail && (
                    <div className={styles.formWrapper}>
                        <OTPForm
                            email={registeredEmail}
                            onSuccess={handleClose}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
