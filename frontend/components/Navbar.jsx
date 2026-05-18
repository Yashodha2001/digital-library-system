'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();

  const home =
    user?.role === 'admin' ? '/admin' : user?.role === 'student' ? '/student' : '/';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={home} className={styles.brand}>
          <span className={styles.logo}>📚</span>
          <span>
            <strong>Readora</strong>
            {title && <small>{title}</small>}
          </span>
        </Link>
        {user && (
          <div className={styles.actions}>
            <span className={styles.user}>
              {user.role === 'admin' ? user.username : user.name}
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
