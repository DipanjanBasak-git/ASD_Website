'use client';

import Container from '@/components/ui/Container';
import styles from '../privacy/privacy.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function EthicsConsentPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>{t.ethicsPage.title}</h1>
                    <p className={styles.updated}>{t.ethicsPage.subtitle}</p>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec1Title}</h2>
                        <p>{t.ethicsPage.sec1Text}</p>
                        <ul>
                            {t.ethicsPage.sec1List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec2Title}</h2>
                        <p>{t.ethicsPage.sec2Text}</p>
                        <ul>
                            {t.ethicsPage.sec2List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec3Title}</h2>
                        <h3>{t.ethicsPage.sec3Subtitle}</h3>
                        <ul>
                            {t.ethicsPage.sec3List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec4Title}</h2>
                        <p>{t.ethicsPage.sec4Text}</p>
                        <ul>
                            {t.ethicsPage.sec4List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec5Title}</h2>
                        <p>{t.ethicsPage.sec5Text}</p>
                        <ul>
                            {t.ethicsPage.sec5List.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec6Title}</h2>
                        <h3>{t.ethicsPage.sec6RisksTitle}</h3>
                        <ul>
                            {t.ethicsPage.sec6RisksList.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <h3>{t.ethicsPage.sec6BenefitsTitle}</h3>
                        <ul>
                            {t.ethicsPage.sec6BenefitsList.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec7Title}</h2>
                        <p>{t.ethicsPage.sec7Text}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>{t.ethicsPage.sec8Title}</h2>
                        <p>{t.ethicsPage.sec8Text}</p>
                        <p>
                            <strong>{t.ethicsPage.sec8EmailLabel}</strong> smartasdplatform@gmail.com
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
