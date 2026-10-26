import React from 'react';
import Card from '../ui/Card';
import { naira } from '../../pages/customer/apiHelpers';

/**
 * PaymentSummary — reusable totals block for orders, plans, and wallet.
 *
 * Props:
 *   items     — array of { label, value (number|string) }
 *   subtotal  — optional number (rendered via naira)
 *   deliveryFee — optional number
 *   tax       — optional number
 *   total     — number (required)
 *   totalLabel — default "Total"
 *   note      — optional helper text under the total
 *   loading   — shows skeleton state
 */
export default function PaymentSummary({
  items = [],
  subtotal,
  deliveryFee,
  tax,
  total,
  totalLabel = 'Total',
  note,
  loading = false,
}) {
  return (
    <Card style={{ padding: 'var(--sp-5)' }}>
      <h3 className="egas-h4" style={{ marginTop: 0, marginBottom: 'var(--sp-4)' }}>
        Payment summary
      </h3>

      {loading ? (
        <div style={{ display: 'grid', gap: 10 }} aria-hidden="true">
          <span className="egas-skeleton" style={{ height: 18 }} />
          <span className="egas-skeleton" style={{ height: 18 }} />
          <span className="egas-skeleton" style={{ height: 22, marginTop: 6 }} />
        </div>
      ) : (
        <ul className="egas-summary-list">
          {items.map((it, i) => (
            <li key={i}>
              <span>{it.label}</span>
              <span>
                {typeof it.value === 'number' ? naira(it.value) : it.value || '—'}
              </span>
            </li>
          ))}

          {subtotal != null && (
            <li>
              <span>Subtotal</span>
              <span>{naira(subtotal)}</span>
            </li>
          )}
          {deliveryFee != null && (
            <li>
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? 'Free' : naira(deliveryFee)}</span>
            </li>
          )}
          {tax != null && (
            <li>
              <span>Tax</span>
              <span>{naira(tax)}</span>
            </li>
          )}

          <li className="is-total">
            <span>{totalLabel}</span>
            <span>{naira(total)}</span>
          </li>
        </ul>
      )}

      {note && (
        <p
          className="egas-text--sm"
          style={{
            marginTop: 'var(--sp-3)',
            marginBottom: 0,
            color: 'var(--egas-text-muted)',
          }}
        >
          {note}
        </p>
      )}
    </Card>
  );
}