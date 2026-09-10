'use client';

import Container from '@/components/ui/Container';
import styles from './privacy.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>{t.privacyPage.title}</h1>
                    <p className={styles.updated}>{t.privacyPage.updated}</p>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec1Title}</h2>
                        <p>{t.privacyPage.sec1Text}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec2Title}</h2>
                        <h3>{t.privacyPage.sec2PersonalTitle}</h3>
                        <ul>
                            {t.privacyPage.sec2PersonalList.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <h3>{t.privacyPage.sec2HealthTitle}</h3>
                        <ul>
                            {t.privacyPage.sec2HealthList.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec3Title}</h2>
                        <p>{t.privacyPage.sec3Text}</p>
                        <ul>
                            {t.privacyPage.sec3List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec4Title}</h2>
                        <p>{t.privacyPage.sec4Text}</p>
                        <ul>
                            {t.privacyPage.sec4List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec5Title}</h2>
                        <p>{t.privacyPage.sec5Text}</p>
                        <ul>
                            {t.privacyPage.sec5List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec6Title}</h2>
                        <p>{t.privacyPage.sec6Text}</p>
                        <ul>
                            {t.privacyPage.sec6List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec7Title}</h2>
                        <p>{t.privacyPage.sec7Text}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.privacyPage.sec8Title}</h2>
                        <p>{t.privacyPage.sec8Text}</p>
                        <p>
                            <strong>{t.privacyPage.sec8EmailLabel}</strong> smartasdplatform@gmail.com
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
