import React from 'react';

/**
 * Button — the single button primitive for the whole customer app.
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 * Renders <button> or <a> depending on `href`.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  href,
  className = '',
  ...rest
}) {
  const classes = [
    'egas-btn',
    `egas-btn--${variant}`,
    size !== 'md' && `egas-btn--${size}`,
    block && 'egas-btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="egas-spin"
          style={{
            width: 16, height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'egas-spin .7s linear infinite',
          }}
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={rest.type || 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {content}
    </button>
  );
}

// tiny global keyframe (idempotent)
if (typeof document !== 'undefined' && !document.getElementById('egas-spin-kf')) {
  const style = document.createElement('style');
  style.id = 'egas-spin-kf';
  style.textContent = '@keyframes egas-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}