import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog — accessible confirmation modal built on top of Modal.
 *
 * Props:
 *   open          — boolean
 *   onClose       — () => void, called on cancel / backdrop / ESC
 *   onConfirm     — () => void, called on confirm
 *   title         — dialog title
 *   description   — optional supporting copy
 *   confirmLabel  — default "Confirm"
 *   cancelLabel   — default "Cancel"
 *   tone          — 'primary' | 'danger' | 'warning' (affects icon + confirm button)
 *   loading       — shows spinner on confirm button
 *   children      — optional extra content between description and buttons
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading = false,
  children,
}) {
  const tones = {
    primary: {
      icon: null,
      iconBg: 'var(--egas-primary-light)',
      iconColor: 'var(--egas-primary)',
      confirmVariant: 'primary',
    },
    warning: {
      icon: <AlertTriangle size={24} />,
      iconBg: 'var(--egas-warning-soft)',
      iconColor: 'var(--egas-warning)',
      confirmVariant: 'primary',
    },
    danger: {
      icon: <AlertTriangle size={24} />,
      iconBg: 'var(--egas-error-soft)',
      iconColor: 'var(--egas-error)',
      confirmVariant: 'danger',
    },
  };
  const cfg = tones[tone] || tones.primary;

  return (
    <Modal
      open={open}
      onClose={() => !loading && onClose?.()}
      title={undefined}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={cfg.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 'var(--sp-3)', textAlign: 'center' }}>
        {cfg.icon && (
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: cfg.iconBg,
              color: cfg.iconColor,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto',
            }}
          >
            {cfg.icon}
          </div>
        )}
        <h2
          className="egas-h3"
          style={{ margin: 0, fontSize: 'var(--fs-xl)', fontWeight: 700 }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="egas-text"
            style={{ margin: 0, maxWidth: 360, marginInline: 'auto' }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </Modal>
  );
}