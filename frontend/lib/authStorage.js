const STORAGE_KEY = 'library_auth';

export function getStoredAuth() {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const { user, token } = JSON.parse(raw);
    if (!user || !token) return { user: null, token: null };
    return { user, token };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
}

export function setStoredAuth(user, token) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
