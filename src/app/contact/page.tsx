'use client';

import Container from '@/components/ui/Container';
import styles from '../privacy/privacy.module.css';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>Contact Research Team</h1>
                    <p className={styles.updated}>We're here to help</p>

                    <section className={styles.section}>
                        <h2>Get in Touch</h2>
                        <p>
                            For research inquiries, technical support, or general questions about the SMART-ASD Platform:
                        </p>
                        <p>
                            <strong>Email:</strong> smartasdplatform@gmail.com
                        </p>
                        <p className={styles.note}>
                            We typically respond within 24-48 hours during business days.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>About This Platform</h2>
                        <p>
                            The SMART-ASD Platform is a research initiative focused on supporting early understanding of autism spectrum disorders through structured behavioral observation and responsible AI technology.
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
