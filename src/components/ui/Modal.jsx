import React, { useEffect, useRef } from 'react';

/**
 * Modal — accessible dialog with focus trap, ESC to close, backdrop click to close.
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    // Focus first focusable
    const focusables = dialogRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    (focusables?.[0] || dialogRef.current)?.focus?.();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if (e.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW =
    size === 'sm' ? 420 : size === 'lg' ? 720 : size === 'xl' ? 960 : 560;

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(16,33,61,0.45)',
        display: 'grid', placeItems: 'center',
        padding: 16,
        animation: 'egas-fade .15s ease-out',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'egas-modal-title' : undefined}
        tabIndex={-1}
        className="egas-card"
        style={{
          width: '100%',
          maxWidth: maxW,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          padding: 'var(--sp-6)',
          outline: 'none',
        }}
      >
        {title && (
          <h2 id="egas-modal-title" className="egas-h3" style={{ marginBottom: 'var(--sp-4)' }}>
            {title}
          </h2>
        )}
        <div>{children}</div>
        {footer && (
          <div
            style={{
              display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end',
              marginTop: 'var(--sp-6)', flexWrap: 'wrap',
            }}
          >
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes egas-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}