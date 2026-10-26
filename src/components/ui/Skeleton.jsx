import React from 'react';

export function Skeleton({ w = '100%', h = 16, radius, style, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`egas-skeleton ${className}`}
      style={{ display: 'block', width: w, height: h, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} w={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="egas-card" style={{ display: 'grid', gap: 12 }}>
      <Skeleton w="40%" h={20} />
      <SkeletonText lines={2} />
    </div>
  );
}