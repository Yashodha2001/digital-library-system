'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import BookModal from '@/components/BookModal';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { token } = useAuth();
  const [tab, setTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [booksRes, studentsRes] = await Promise.all([
        api.getBooks(token),
        api.getStudents(token),
      ]);
      setBooks(booksRes.books);
      setStudents(studentsRes.students);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveBook = async (data) => {
    try {
      if (editingBook) {
        await api.updateBook(token, editingBook._id, data);
        setMessage('Book updated successfully.');
      } else {
        await api.createBook(token, data);
        setMessage('Book added successfully.');
      }
      setModalOpen(false);
      setEditingBook(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try {
      await api.deleteBook(token, id);
      setMessage('Book deleted.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar title="Admin Dashboard" />
      <main className={`container ${styles.main}`}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === 'books' ? styles.tabActive : styles.tab}
            onClick={() => setTab('books')}
          >
            Books
          </button>
          <button
            type="button"
            className={tab === 'students' ? styles.tabActive : styles.tab}
            onClick={() => setTab('students')}
          >
            Students
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : tab === 'books' ? (
          <section>
            <div className={styles.sectionHeader}>
              <h2>Book catalog</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingBook(null);
                  setModalOpen(true);
                }}
              >
                + Add book
              </button>
            </div>
            <div className="grid-books">
              {books.map((book) => (
                <article key={book._id} className="card">
                  <h3>{book.title}</h3>
                  <p className={styles.meta}>by {book.author}</p>
                  <p className={styles.meta}>ISBN: {book.isbn}</p>
                  <p className={styles.meta}>{book.genre}</p>
                  <p className={styles.desc}>{book.description}</p>
                  <div className={styles.bookFooter}>
                    <span
                      className={
                        book.availableCopies > 0 ? 'badge badge-available' : 'badge badge-unavailable'
                      }
                    >
                      {book.availableCopies} / {book.totalCopies} available
                    </span>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingBook(book);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2>Students & borrowing status</h2>
            <div className="table-wrap card" style={{ marginTop: '1rem', padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Active loans</th>
                    <th>Overdue</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.studentId}</td>
                      <td>{s.email}</td>
                      <td>{s.borrowingSummary.activeCount}</td>
                      <td>{s.borrowingSummary.overdueCount}</td>
                      <td>
                        {s.activeBorrowings.length === 0 ? (
                          <span className={styles.muted}>None</span>
                        ) : (
                          <ul className={styles.loanList}>
                            {s.activeBorrowings.map((b) => (
                              <li key={b._id}>
                                {b.book?.title || 'Unknown'} —{' '}
                                <span className={`badge badge-${b.status}`}>{b.status}</span>
                                <br />
                                <small>Due: {new Date(b.dueDate).toLocaleDateString()}</small>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <BookModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        initial={editingBook}
      />
    </>
  );
}
