'use client';

export default function Error({ error, reset }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#fff9d2',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: '2rem',
          background: '#fff',
          border: '2px solid #bfddf0',
          borderRadius: 12,
        }}
      >
        <h1 style={{ marginBottom: '0.75rem' }}>Something went wrong</h1>
        <p style={{ color: '#5a6c7d', marginBottom: '1rem' }}>
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.65rem 1.25rem',
            background: '#8cc0eb',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
