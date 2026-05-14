import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Sun Games',
};

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.brand}>Sun Games</h1>
        <p className={styles.tagline}>Daily puzzle games</p>
      </header>
      <div className={styles.games}>
        <Link href="/seeds" className={styles.card}>
          <span className={styles.cardBadge}>Daily</span>
          <h2 className={styles.cardTitle}>Seeds</h2>
          <p className={styles.cardDesc}>a sowing puzzle</p>
        </Link>
        <Link href="/chambers" className={styles.card}>
          <span className={styles.cardBadge}>Daily</span>
          <h2 className={styles.cardTitle}>Mystery Keep</h2>
          <p className={styles.cardDesc}>a deduction quest</p>
        </Link>
      </div>
    </main>
  );
}
