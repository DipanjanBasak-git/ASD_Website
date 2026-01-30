import Container from '@/components/ui/Container';
import styles from './About.module.css';

export default function About() {
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
