'use client';

import Container from '@/components/ui/Container';
import AboutModule from '@/components/landing/About';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <section className="min-h-screen pt-10">
            <Container>
                <h1 className="text-3xl font-semibold mb-8 text-[var(--heading)]">{t.aboutPage.pageTitle}</h1>
                <AboutModule forceEnglish={false} />
            </Container>
        </section>
    );
}
