/**
 * /screening — Patient-only ASD Image Screening Page
 *
 * Protected by middleware (session required).
 * Renders the ScreeningModule client component.
 * No layout changes. No auth system modifications.
 */

import ScreeningModule from '@/components/patient/ScreeningModule';
import Container from '@/components/ui/Container';

export const metadata = {
    title: 'ASD Image Screening | Patient Portal',
    description:
        'AI-assisted ASD image screening tool for patients in the Verify ASD research platform.',
};

export default function ScreeningPage() {
    return (
        <Container>
            <ScreeningModule />
        </Container>
    );
}
