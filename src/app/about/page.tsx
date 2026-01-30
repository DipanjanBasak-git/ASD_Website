import Container from '@/components/ui/Container';
import AboutModule from '@/components/landing/About';

export default function AboutPage() {
    return (
        <section className="min-h-screen pt-10">
            <Container>
                <h1 className="text-3xl font-semibold mb-8 text-[var(--heading)]">About the Platform</h1>
                <AboutModule />
            </Container>
        </section>
    );
}
