'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isWrongRole = Boolean(role && user && user.role !== role);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(role === 'admin' ? '/login/admin' : '/login/student');
      return;
    }

    if (role && user.role !== role) {
      router.replace(user.role === 'admin' ? '/admin' : '/student');
    }
  }, [user, loading, role, router]);

  if (loading || !user || isWrongRole) {
    return (
      <main style={{ padding: '3rem', textAlign: 'center', color: '#5a6c7d' }}>
        Loading...
      </main>
    );
  }

  return children;
}
