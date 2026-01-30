import Container from '@/components/ui/Container';
import styles from './page.module.css';

export default function ResearchPage() {
    return (
        <section className={styles.researchPage}>
            <Container>

                {/* Intro Section */}
                <div className={styles.introSection}>
                    <h1 className={styles.heading}>
                        Research & Methodology
                    </h1>
                    <p className={styles.introText}>
                        This platform relies on a structured, multi-modal observation framework
                        designed to capture natural behavioral indicators in early childhood.
                        Our methodology prioritizes non-intrusive data collection and
                        clinician-led interpretation.
                    </p>
                </div>

                <div className={styles.gridContainer}>
                    {/* Placeholder Grid */}
                    <div className={styles.cardsGrid}>
                        <div className={styles.card}>
                            <div className={`${styles.cardIcon} ${styles.iconOne}`}>1</div>
                            <h3 className={styles.cardTitle}>Methodology Overview</h3>
                            <p className={styles.cardText}>
                                Structured protocols for recording social attention and joint engagement.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={`${styles.cardIcon} ${styles.iconTwo}`}>2</div>
                            <h3 className={styles.cardTitle}>Observation Framework</h3>
                            <p className={styles.cardText}>
                                Key behavioral markers aligned with clinical diagnostic criteria.
                            </p>
                        </div>
                    </div>

                    {/* Dark Contextual Panel & Side Content */}
                    <div className={styles.sidePanel}>
                        <div className="research-card-global">
                            <h3>Ethics & Data Handling</h3>
                            <ul>
                                <li><strong>Local-First Processing:</strong> Data remains on the device whenever possible.</li>
                                <li><strong>Anonymized Metrics:</strong> No PII is stored with behavioral metadata.</li>
                                <li><strong>Clinician Access Only:</strong> Raw data is restricted to authorized personnel.</li>
                            </ul>
                            <span className="note">
                                This platform adheres to strict distinct ethical guidelines for pediatric behavioral observation.
                            </span>
                        </div>

                        <div className={styles.citationCard}>
                            <h3>Detailed Publication Data</h3>
                            <p>
                                Full citations and peer-reviewed sources for the framework will be listed here upen release.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
