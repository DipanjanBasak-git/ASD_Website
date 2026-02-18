'use client';

import Container from '@/components/ui/Container';
import styles from './privacy.module.css';

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.updated}>Last Updated: February 2026</p>

                    <section className={styles.section}>
                        <h2>1. Introduction</h2>
                        <p>
                            The SMART-ASD Platform is committed to protecting the privacy and confidentiality of all participants in our autism spectrum disorder research. This privacy policy outlines how we collect, use, store, and protect your personal and health information.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Information We Collect</h2>
                        <h3>Personal Information:</h3>
                        <ul>
                            <li>Name, date of birth, and contact information</li>
                            <li>Guardian/parent information for minor participants</li>
                            <li>Demographic data (age, gender)</li>
                        </ul>
                        <h3>Health Information:</h3>
                        <ul>
                            <li>Behavioral screening responses</li>
                            <li>Clinical observations and assessments</li>
                            <li>Therapy session notes and progress records</li>
                            <li>Prescription and treatment information</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. How We Use Your Information</h2>
                        <p>Your information is used solely for:</p>
                        <ul>
                            <li><strong>Research purposes:</strong> To advance understanding of autism spectrum disorders</li>
                            <li><strong>Clinical support:</strong> To provide appropriate therapeutic interventions</li>
                            <li><strong>Data analysis:</strong> To identify patterns and improve screening tools</li>
                            <li><strong>Institutional compliance:</strong> To meet regulatory and ethical requirements</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Data Protection & Security</h2>
                        <p>We implement industry-standard security measures:</p>
                        <ul>
                            <li>End-to-end encryption for all sensitive data</li>
                            <li>Role-based access control (only authorized personnel can access data)</li>
                            <li>Regular security audits and compliance checks</li>
                            <li>Secure database storage with encrypted backups</li>
                            <li>Audit logging of all data access and modifications</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Data Sharing & Disclosure</h2>
                        <p>We do NOT share your personal information with third parties except:</p>
                        <ul>
                            <li>With your explicit written consent</li>
                            <li>When required by law or legal process</li>
                            <li>For de-identified research publications (no personal identifiers)</li>
                            <li>With institutional review boards for ethical oversight</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Your Rights</h2>
                        <p>As a participant, you have the right to:</p>
                        <ul>
                            <li>Access your personal data at any time</li>
                            <li>Request corrections to inaccurate information</li>
                            <li>Withdraw from the study at any time</li>
                            <li>Request deletion of your data (subject to legal requirements)</li>
                            <li>Receive a copy of your data in a portable format</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Data Retention</h2>
                        <p>
                            Research data is retained for a minimum of 7 years as per institutional guidelines. After this period, data may be anonymized for long-term research or securely destroyed.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Contact Us</h2>
                        <p>
                            For any questions, concerns, or to exercise your privacy rights, please contact us:
                        </p>
                        <p>
                            <strong>Email:</strong> smartasdplatform@gmail.com
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
