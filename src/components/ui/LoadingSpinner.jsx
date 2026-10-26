import React from 'react';

export default function LoadingSpinner({ label = 'Loading…', fullPage = false }) {
  const content = (
    <div style={{ display: 'grid', placeItems: 'center', gap: 12, padding: 24 }}>
      <span
        aria-hidden="true"
        style={{
          width: 32, height: 32,
          border: '3px solid var(--egas-primary-light)',
          borderTopColor: 'var(--egas-primary)',
          borderRadius: '50%',
          animation: 'egas-spin .8s linear infinite',
        }}
      />
      <span className="egas-helper">{label}</span>
    </div>
  );
  if (fullPage) {
    return (
      <div role="status" aria-live="polite" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        {content}
      </div>
    );
  }
  return <div role="status" aria-live="polite">{content}</div>;
}