import React from 'react';

const TONES = {
  neutral: 'egas-badge--neutral',
  success: 'egas-badge--success',
  warning: 'egas-badge--warning',
  error:   'egas-badge--error',
  info:    'egas-badge--info',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`egas-badge ${TONES[tone] || TONES.neutral} ${className}`}>
      {children}
    </span>
  );
}