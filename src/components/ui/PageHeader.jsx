import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="egas-page-header">
      <div>
        <h1 className="egas-page-header__title">{title}</h1>
        {subtitle && <p className="egas-page-header__sub">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>{actions}</div>}
    </header>
  );
}