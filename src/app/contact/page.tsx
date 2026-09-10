'use client';

import Container from '@/components/ui/Container';
import styles from '../privacy/privacy.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>{t.contactPage.title}</h1>
                    <p className={styles.updated}>{t.contactPage.subtitle}</p>

                    <section className={styles.section}>
                        <h2>{t.contactPage.getInTouch}</h2>
                        <p>
                            {t.contactPage.inquiriesText}
                        </p>
                        <p>
                            <strong>{t.contactPage.emailLabel}</strong> smartasdplatform@gmail.com
                        </p>
                        <p className={styles.note}>
                            {t.contactPage.responseNotice}
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.contactPage.aboutPlatformTitle}</h2>
                        <p>
                            {t.contactPage.aboutPlatformText}
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
