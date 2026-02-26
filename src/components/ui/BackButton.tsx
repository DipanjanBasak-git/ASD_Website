'use client';

import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';

interface BackButtonProps {
    /** Label shown inside the button. Defaults to "← Back" */
    label?: string;
    /** If provided, navigates to this path instead of browser history */
    href?: string;
    className?: string;
}

/**
 * Reusable back navigation button.
 * Uses browser history by default (router.back()), or navigates to
 * a specific href if provided.
 *
 * Usage:
 *   <BackButton />                          → goes back in history
 *   <BackButton href="/patient/dashboard" → goes to dashboard
 *   <BackButton label="← Dashboard" href="/patient/dashboard" />
 */
export default function BackButton({ label = '← Back', href, className = '' }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`${styles.backBtn} ${className}`}
            aria-label="Go back to previous page"
        >
            {label}
        </button>
    );
}
