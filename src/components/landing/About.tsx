'use client';

import Container from '@/components/ui/Container';
import styles from './About.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function About({ forceEnglish }: { forceEnglish?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const isHomePage = forceEnglish !== undefined ? forceEnglish : pathname === '/';

    // On home page, preserve English text ("apart from the home screen all other pages should be translated")
    if (isHomePage) {
        return (
            <section className={styles.about} id="about">
                <Container>
                    <div className={styles.grid}>
                        <div className={styles.textContent}>
                            <h2 className={styles.heading}>Early Observation, Respected.</h2>
                            <p className={styles.text}>
                                Early childhood is a critical window for understanding developmental patterns.
                                However, traditional clinical environments can be stressful for young children, often affecting behavior.
                            </p>
                            <p className={styles.text}>
                                This platform provides a bridge: <strong>structured, play-based observation</strong> that happens in a comfortable environment.
                                We focus on recording natural behavioral indicators related to social attention, communication intent, and reciprocity.
                            </p>
                            <div className={styles.domainTags}>
                                <span className={styles.tag}>Social Attention</span>
                                <span className={styles.tag}>Joint Engagement</span>
                                <span className={styles.tag}>Communication Intent</span>
                            </div>
                        </div>
                        <div className="research-card-global">
                            <h3>For Research & Screening Support</h3>
                            <ul>
                                <li>Designed for ages 18 months – 6 years</li>
                                <li>Data anonymized via local-first processing</li>
                                <li>Results meant for clinician review only</li>
                            </ul>
                            <span className="note">
                                Note: No automated diagnosis is provided to caregivers.
                            </span>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className={styles.about} id="about">
            <Container>
                <div className={styles.grid}>
                    <div className={styles.textContent}>
                        <h2 className={styles.heading}>{t.aboutPage.heroHeading}</h2>
                        <p className={styles.text}>{t.aboutPage.intro1}</p>
                        <p className={styles.text}>{t.aboutPage.intro2}</p>
                        <div className={styles.domainTags}>
                            <span className={styles.tag}>{t.aboutPage.tagSocial}</span>
                            <span className={styles.tag}>{t.aboutPage.tagEngagement}</span>
                            <span className={styles.tag}>{t.aboutPage.tagCommunication}</span>
                        </div>
                    </div>
                    <div className="research-card-global">
                        <h3>{t.aboutPage.boxTitle}</h3>
                        <ul>
                            <li>{t.aboutPage.boxItem1}</li>
                            <li>{t.aboutPage.boxItem2}</li>
                            <li>{t.aboutPage.boxItem3}</li>
                        </ul>
                        <span className="note">
                            {t.aboutPage.boxNote}
                        </span>
                    </div>
                </div>
            </Container>
        </section>
    );
}
