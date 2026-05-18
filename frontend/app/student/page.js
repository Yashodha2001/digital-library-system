'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import styles from './student.module.css';

export default function StudentDashboard() {
  return (
    <ProtectedRoute role="student">
      <StudentContent />
    </ProtectedRoute>
  );
}

function StudentContent() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [booksRes, borrowRes] = await Promise.all([
        api.getBooks(token),
        api.getMyBorrowings(token),
      ]);
      setBooks(booksRes.books);
      setBorrowings(borrowRes.borrowedBooks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isBorrowed = (bookId) =>
    borrowings.some(
      (b) =>
        (b.book?._id === bookId || b.book === bookId) &&
        (b.status === 'borrowed' || b.status === 'overdue')
    );

  const handleBorrow = async (bookId) => {
    setActionId(bookId);
    setMessage('');
    setError('');
    try {
      const res = await api.borrowBook(token, bookId);
      setMessage(res.message);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleReturn = async (bookId) => {
    setActionId(bookId);
    setMessage('');
    setError('');
    try {
      const res = await api.returnBook(token, bookId);
      setMessage(res.message);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const activeLoans = borrowings.filter(
    (b) => b.status === 'borrowed' || b.status === 'overdue'
  );

  return (
    <>
      <Navbar title="Student Portal" />
      <main className={`container ${styles.main}`}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <section className={styles.section}>
          <h2>My active borrowings</h2>
          {loading ? (
            <p className={styles.muted}>Loading...</p>
          ) : activeLoans.length === 0 ? (
            <p className={`card ${styles.empty}`}>You have no active borrowings.</p>
          ) : (
            <div className={styles.loanGrid}>
              {activeLoans.map((b) => {
                const bookId = b.book?._id || b.book;
                return (
                  <article key={b._id} className="card">
                    <h3>{b.book?.title || 'Book'}</h3>
                    <p className={styles.meta}>by {b.book?.author}</p>
                    <p className={styles.meta}>
                      Due: {new Date(b.dueDate).toLocaleDateString()}
                    </p>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '0.75rem' }}
                      disabled={actionId === bookId}
                      onClick={() => handleReturn(bookId)}
                    >
                      {actionId === bookId ? 'Returning...' : 'Return book'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Browse library</h2>
          {loading ? (
            <p className={styles.muted}>Loading...</p>
          ) : (
            <div className="grid-books">
              {books.map((book) => {
                const borrowed = isBorrowed(book._id);
                const canBorrow = book.availableCopies > 0 && !borrowed;
                return (
                  <article key={book._id} className="card">
                    <h3>{book.title}</h3>
                    <p className={styles.meta}>by {book.author}</p>
                    <p className={styles.meta}>{book.genre}</p>
                    <p className={styles.desc}>{book.description}</p>
                    <div className={styles.footer}>
                      <span
                        className={
                          book.availableCopies > 0
                            ? 'badge badge-available'
                            : 'badge badge-unavailable'
                        }
                      >
                        {book.availableCopies} available
                      </span>
                      {borrowed ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={actionId === book._id}
                          onClick={() => handleReturn(book._id)}
                        >
                          {actionId === book._id ? 'Returning...' : 'Return'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={!canBorrow || actionId === book._id}
                          onClick={() => handleBorrow(book._id)}
                        >
                          {actionId === book._id ? 'Borrowing...' : 'Borrow'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
