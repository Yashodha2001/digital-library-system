'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.role === 'admin') router.replace('/admin');
    else if (user?.role === 'student') router.replace('/student');
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className={styles.main}>
        <p className={styles.loading}>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.heroBanner} aria-label="Library">
        <img
          src="/images/hero.jpg"
          alt="Warmly lit wooden bookshelves with classic leather-bound books"
          className={styles.heroImage}
          decoding="async"
          fetchPriority="high"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Readora</h1>
          <p className={styles.heroTagline}>
            Your campus library — browse books, borrow titles, and manage everything in one place.
          </p>
        </div>
      </section>

      <div className={styles.bottom}>
        <div className={styles.cards}>
          <Link href="/login/admin" className={styles.card}>
            <h2>Admin</h2>
            <p>Manage books and students</p>
          </Link>
          <Link href="/login/student" className={styles.card}>
            <h2>Student</h2>
            <p>Browse and borrow books</p>
          </Link>
          <Link href="/register" className={`${styles.card} ${styles.cardAlt}`}>
            <h2>Register</h2>
            <p>Create a new student account</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
