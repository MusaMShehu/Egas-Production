import React from 'react';
import { Check, X } from 'lucide-react';
import './orders.css';

/**
 * OrderTimeline — vertical step timeline.
 *
 * Props:
 *   steps — array of { key, label, at, state: 'done' | 'active' | 'pending' | 'failed', note? }
 *
 * Consumers build `steps` from order/delivery data. This component is purely visual.
 */
export default function OrderTimeline({ steps = [], className = '' }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <ol className={`egas-otimeline ${className}`} aria-label="Progress timeline">
      {steps.map((step) => {
        const cls =
          step.state === 'done'   ? 'is-done'
          : step.state === 'active' ? 'is-active'
          : step.state === 'failed' ? 'is-failed'
          : '';
        return (
          <li key={step.key} className={`egas-otimeline__item ${cls}`}>
            <span className="egas-otimeline__dot" aria-hidden="true">
              {step.state === 'done' && <Check size={11} strokeWidth={3} />}
              {step.state === 'failed' && <X size={11} strokeWidth={3} />}
            </span>
            <p className="egas-otimeline__title">{step.label}</p>
            {step.at && (
              <p className="egas-otimeline__meta">{format(step.at)}</p>
            )}
            {step.note && <p className="egas-otimeline__note">{step.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function format(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ---------- Skeleton ---------- */
export function OrderTimelineSkeleton({ lines = 4 }) {
  return (
    <ol className="egas-otimeline" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <li key={i} className="egas-otimeline__item">
          <span className="egas-otimeline__dot" />
          <span
            className="egas-skeleton"
            style={{ display: 'block', width: '55%', height: 16 }}
          />
          <span
            className="egas-skeleton"
            style={{ display: 'block', width: '35%', height: 12, marginTop: 6 }}
          />
        </li>
      ))}
    </ol>
  );
}