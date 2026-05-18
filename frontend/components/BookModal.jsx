'use client';

import { useEffect, useState } from 'react';

const emptyBook = {
  title: '',
  author: '',
  isbn: '',
  genre: 'General',
  description: '',
  totalCopies: 1,
  publishedYear: '',
};

export default function BookModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(emptyBook);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        author: initial.author || '',
        isbn: initial.isbn || '',
        genre: initial.genre || 'General',
        description: initial.description || '',
        totalCopies: initial.totalCopies ?? 1,
        publishedYear: initial.publishedYear || '',
      });
    } else {
      setForm(emptyBook);
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      totalCopies: Number(form.totalCopies),
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ISBN</label>
              <input
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total copies</label>
              <input
                type="number"
                min={1}
                value={form.totalCopies}
                onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Published year</label>
              <input
                type="number"
                value={form.publishedYear}
                onChange={(e) => setForm({ ...form, publishedYear: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initial ? 'Update' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
