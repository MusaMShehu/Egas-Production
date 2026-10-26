import React from 'react';
import { Check, Calendar, Package } from 'lucide-react';
import Button from '../ui/Button';
import { naira } from '../../pages/customer/apiHelpers';
import './subscriptions.css';

/**
 * PlanCard — subscription plan display.
 *
 * Props:
 *   plan            — plan object from GET /subscription-plans
 *   ctaHref         — where the CTA links to
 *   ctaLabel        — custom CTA text (default: "Choose plan")
 *   selected        — highlight as selected (used inside the wizard)
 *   onSelect        — optional click handler (used inside the wizard)
 *   isAuthenticated — controls CTA target if ctaHref not passed
 */
export default function PlanCard({
  plan,
  ctaHref,
  ctaLabel,
  selected = false,
  onSelect,
  isAuthenticated = false,
}) {
  if (!plan) return null;

  const features = normalizeFeatures(plan.features);
  const priceValue = plan.pricePerKg ?? plan.basePrice ?? null;
  const priceSuffix = plan.pricePerKg != null ? '/kg' : plan.basePrice != null ? ' from' : '';

  const finalHref =
    ctaHref ||
    (isAuthenticated
      ? `/dashboard/order?plan=${plan._id}`
      : `/auth?mode=register&plan=${plan._id}`);

  const isClickable = typeof onSelect === 'function';
  const Wrapper = isClickable ? 'button' : 'div';

  return (
    <Wrapper
      type={isClickable ? 'button' : undefined}
      onClick={isClickable ? () => onSelect(plan) : undefined}
      className={`egas-plan-card ${plan.isPopular ? 'is-popular' : ''} ${
        selected ? 'is-selected' : ''
      }`}
      style={isClickable ? { cursor: 'pointer', textAlign: 'left' } : undefined}
      aria-pressed={isClickable ? selected : undefined}
    >
      {plan.isPopular && (
        <span className="egas-plan-card__ribbon">Most Popular</span>
      )}

      <div className="egas-plan-card__head">
        <h3 className="egas-plan-card__title">{plan.name}</h3>
        {(plan.shortDescription || plan.description) && (
          <p className="egas-plan-card__desc">
            {plan.shortDescription || plan.description}
          </p>
        )}
      </div>

      <div className="egas-plan-card__price">
        {priceValue != null ? (
          <>
            {naira(priceValue)}
            {priceSuffix && <small>{priceSuffix}</small>}
          </>
        ) : (
          <span style={{ fontSize: 'var(--fs-md)' }}>See plan</span>
        )}
      </div>

      <div className="egas-plan-card__meta">
        {plan.baseSize && (
          <span>
            <Package size={12} /> {plan.baseSize}
          </span>
        )}
        {Array.isArray(plan.deliveryFrequency) && plan.deliveryFrequency.length > 0 && (
          <span>
            <Calendar size={12} /> {plan.deliveryFrequency.join(', ')}
          </span>
        )}
      </div>

      {features.length > 0 && (
        <ul className="egas-plan-card__features">
          {features.slice(0, 6).map((f, i) => (
            <li key={i}>
              <Check size={14} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {!isClickable && (
        <Button href={finalHref} variant={plan.isPopular ? 'primary' : 'secondary'} block>
          {ctaLabel || (isAuthenticated ? 'Subscribe to this plan' : 'Get started')}
        </Button>
      )}
    </Wrapper>
  );
}

function normalizeFeatures(features) {
  if (!Array.isArray(features)) return [];
  return features
    .map((f) => (typeof f === 'string' ? f : f?.title || f?.description))
    .filter(Boolean);
}