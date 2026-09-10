'use client';

import Container from '@/components/ui/Container';
import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.disclaimerSection}>
                        <p className={styles.disclaimerText}>
                            <strong>{t.footer.disclaimerTitle}</strong> {t.footer.disclaimerText}
                        </p>
                    </div>
                    <div className={styles.links}>
                        <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
                        <a href="/privacy">{t.footer.privacyPolicy}</a>
                        <a href="/ethics">{t.footer.ethicsConsent}</a>
                        <a href="/contact">{t.footer.contact}</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
