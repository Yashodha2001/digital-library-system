const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const { token, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new Error(
      'Cannot reach the API server. Start the backend with: cd backend && npm run dev'
    );
  }

  let data = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  adminLogin: (body) =>
    request('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) }),

  studentRegister: (body) =>
    request('/auth/student/register', { method: 'POST', body: JSON.stringify(body) }),

  studentLogin: (body) =>
    request('/auth/student/login', { method: 'POST', body: JSON.stringify(body) }),

  getProfile: (token) => request('/auth/profile', { token }),

  getBooks: (token) => request('/books', { token }),

  createBook: (token, body) =>
    request('/books', { method: 'POST', token, body: JSON.stringify(body) }),

  updateBook: (token, id, body) =>
    request(`/books/${id}`, { method: 'PUT', token, body: JSON.stringify(body) }),

  deleteBook: (token, id) => request(`/books/${id}`, { method: 'DELETE', token }),

  getStudents: (token) => request('/students', { token }),

  getMyBorrowings: (token) => request('/students/borrowings/me', { token }),

  borrowBook: (token, bookId) =>
    request(`/students/borrow/${bookId}`, { method: 'POST', token }),

  returnBook: (token, bookId) =>
    request(`/students/return/${bookId}`, { method: 'POST', token }),
};
