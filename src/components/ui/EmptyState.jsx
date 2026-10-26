import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon = null,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div
      className="egas-card"
      style={{
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: 'var(--sp-9) var(--sp-5)',
        gap: 'var(--sp-3)',
      }}
    >
      {icon && (
        <div
          aria-hidden="true"
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--egas-primary-light)',
            color: 'var(--egas-primary)',
            display: 'grid', placeItems: 'center',
          }}
        >
          {icon}
        </div>
      )}
      <h3 className="egas-h3">{title}</h3>
      {description && (
        <p className="egas-text" style={{ maxWidth: 440 }}>
          {description}
        </p>
      )}
      {(actionLabel && (actionHref || onAction)) && (
        <Button
          variant="primary"
          href={actionHref}
          onClick={onAction}
          style={{ marginTop: 'var(--sp-2)' }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}