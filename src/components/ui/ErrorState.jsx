import React from 'react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div
      className="egas-card"
      role="alert"
      style={{
        display: 'grid', placeItems: 'center',
        textAlign: 'center', padding: 'var(--sp-9) var(--sp-5)',
        gap: 'var(--sp-3)',
        borderColor: 'var(--egas-error-soft)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--egas-error-soft)',
          color: 'var(--egas-error)',
          display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700,
        }}
      >
        !
      </div>
      <h3 className="egas-h3">{title}</h3>
      {description && <p className="egas-text" style={{ maxWidth: 440 }}>{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} style={{ marginTop: 'var(--sp-2)' }}>
          Try again
        </Button>
      )}
    </div>
  );
}