'use client';

import Container from '@/components/ui/Container';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function ResearchPage() {
    const { t } = useLanguage();

    return (
        <section className={styles.researchPage}>
            <Container>
                {/* Intro Section */}
                <div className={styles.introSection}>
                    <h1 className={styles.heading}>
                        {t.researchPage.heading}
                    </h1>
                    <p className={styles.introText}>
                        {t.researchPage.introText}
                    </p>
                </div>

                <div className={styles.gridContainer}>
                    {/* Placeholder Grid */}
                    <div className={styles.cardsGrid}>
                        <div className={styles.card}>
                            <div className={`${styles.cardIcon} ${styles.iconOne}`}>1</div>
                            <h3 className={styles.cardTitle}>{t.researchPage.card1Title}</h3>
                            <p className={styles.cardText}>
                                {t.researchPage.card1Text}
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={`${styles.cardIcon} ${styles.iconTwo}`}>2</div>
                            <h3 className={styles.cardTitle}>{t.researchPage.card2Title}</h3>
                            <p className={styles.cardText}>
                                {t.researchPage.card2Text}
                            </p>
                        </div>
                    </div>

                    {/* Dark Contextual Panel & Side Content */}
                    <div className={styles.sidePanel}>
                        <div className="research-card-global">
                            <h3>{t.researchPage.ethicsTitle}</h3>
                            <ul>
                                <li><strong>{t.researchPage.ethicsItem1Title}</strong> {t.researchPage.ethicsItem1Text}</li>
                                <li><strong>{t.researchPage.ethicsItem2Title}</strong> {t.researchPage.ethicsItem2Text}</li>
                                <li><strong>{t.researchPage.ethicsItem3Title}</strong> {t.researchPage.ethicsItem3Text}</li>
                            </ul>
                            <span className="note">
                                {t.researchPage.ethicsNote}
                            </span>
                        </div>

                        <div className={styles.citationCard}>
                            <h3>{t.researchPage.citationTitle}</h3>
                            <p>
                                {t.researchPage.citationText}
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
