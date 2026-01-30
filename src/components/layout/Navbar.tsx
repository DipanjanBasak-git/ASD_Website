import Link from 'next/link';
import Container from '@/components/ui/Container';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Container className={styles.navContainer}>
                <div className={styles.logo}>
                    <Link href="/">ASD Research Platform</Link>
                </div>
                <ul className={styles.navLinks}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/research">Research</Link></li>
                    <li><Link href="/login" className={styles.authLink}>Login (Institutional)</Link></li>
                </ul>
            </Container>
        </nav>
    );
}
