import React from 'react';

export default function Card({
  children,
  interactive = false,
  className = '',
  as: As = 'div',
  ...rest
}) {
  return (
    <As
      className={`egas-card ${interactive ? 'egas-card--interactive' : ''} ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}