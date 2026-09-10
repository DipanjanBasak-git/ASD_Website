'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import styles from './Hero.module.css';

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is muted for reliable autoplay across browsers
        video.muted = true;

        // Respect prefers-reduced-motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionPreference = () => {
            if (mediaQuery.matches) {
                video.pause();
            } else {
                video.play().catch(() => {});
            }
        };

        handleMotionPreference();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleMotionPreference);
            return () => mediaQuery.removeEventListener('change', handleMotionPreference);
        }
    }, []);

    return (
        <section className={styles.hero}>
            <Container className={styles.heroContainer}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Advancing Early Autism Understanding Through Intelligent Support
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
                    <div className={styles.videoWrapper}>
                        <video
                            ref={videoRef}
                            className={styles.heroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            aria-label="Illustration of clinician and child observation"
                            tabIndex={-1}
                        >
                            <source src="/Hero%20section%20video_mvp.mp4" type="video/mp4" />
                            <source src="/Hero section video_mvp.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </Container>
        </section>
    );
}

