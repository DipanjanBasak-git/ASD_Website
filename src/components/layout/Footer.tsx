import Container from '@/components/ui/Container';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.disclaimerSection}>
                        <p className={styles.disclaimerText}>
                            <strong>Research Use Only.</strong> This system does not diagnose Autism Spectrum Disorder.
                            It supports structured behavioral observation only and does not replace professional evaluation.
                        </p>
                    </div>
                    <div className={styles.links}>
                        <span>© {new Date().getFullYear()} ASD Research Platform</span>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/ethics">Ethics & Consent</a>
                        <a href="/contact">Contact Research Team</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
