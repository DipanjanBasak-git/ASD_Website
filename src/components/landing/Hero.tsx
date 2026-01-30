import Link from 'next/link';
import Container from '@/components/ui/Container';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <Container className={styles.heroContainer}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Supporting Early Understanding Through Play, Observation, and Responsible AI
                    </h1>
                    <p className={styles.subtitle}>
                        A research-driven platform designed to assist structured behavioral observation in young children.
                    </p>
                    <div className={styles.actions}>
                        <button className={styles.primaryButton} disabled aria-disabled="true">
                            Begin Guided Observation
                            <span className={styles.comingSoon}>Coming Soon</span>
                        </button>
                        <Link href="/about" className={styles.secondaryButton}>
                            Understand How It Works
                        </Link>
                    </div>
                </div>
                <div className={styles.illustrationPlaceholder}>
                    {/* Placeholder for "Calm, editorial illustration" - using a soft abstract shape */}
                    <div className={styles.softShape}></div>
                </div>
            </Container>
        </section>
    );
}
