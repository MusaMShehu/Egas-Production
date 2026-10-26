import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { naira, formatDate } from '../../pages/customer/apiHelpers';
import './orders.css';

/**
 * OrderCard — responsive order summary card.
 *
 * Used by:
 *   - MyOrdersPage
 *   - HistoryPage (orders tab)
 *   - DashboardOverviewPage (recent orders)
 *
 * Props:
 *   order        — order object from GET /orders or GET /orders/:id
 *   href         — optional link target (default: /dashboard/orders/:id)
 *   compact      — tighter layout (used on dashboard)
 *   showCta      — render the "View details" footer link
 */
export default function OrderCard({
  order,
  href,
  compact = false,
  showCta = true,
}) {
  if (!order) return null;

  const productNames = (order.products || [])
    .map((p) => p.product?.name || p.productName)
    .filter(Boolean)
    .join(', ');

  const orderRef = String(order.orderId || order._id || '')
    .slice(-8)
    .toUpperCase();

  const link = href || `/dashboard/orders/${order._id}`;
  const status = order.orderStatus || order.paymentStatus;
  const payment = order.paymentStatus;

  const content = (
    <>
      <div className="egas-order-card__top">
        <div className="egas-order-card__heading">
          <h3 className="egas-order-card__ref" title={productNames}>
            {productNames || 'Order'}
          </h3>
          <p className="egas-order-card__date">
            #{orderRef} · {formatDate(order.createdAt, { withTime: true })}
          </p>
        </div>
        <div className="egas-order-card__badges">
          {status && <StatusBadge status={status} />}
          {payment && payment !== status && <StatusBadge status={payment} />}
        </div>
      </div>

      <div className="egas-order-card__grid">
        <Field label="Total" value={naira(order.totalAmount)} />
        <Field
          label="Items"
          value={`${(order.products || []).length} item${
            (order.products || []).length === 1 ? '' : 's'
          }`}
        />
        {!compact && (
          <Field label="Delivery" value={order.deliveryAddress || '—'} />
        )}
        {compact && (
          <Field label="Payment" value={order.paymentStatus || '—'} />
        )}
      </div>

      {showCta && (
        <div className="egas-order-card__cta">
          <span className="egas-order-card__cta-link">
            View details <ChevronRight size={14} />
          </span>
        </div>
      )}
    </>
  );

  const className = `egas-order-card egas-order-card--interactive ${
    compact ? 'egas-order-card--compact' : ''
  }`;

  return (
    <Link to={link} className={className} aria-label={`Order ${orderRef}`}>
      {content}
    </Link>
  );
}

function Field({ label, value }) {
  return (
    <div className="egas-order-card__field">
      <span className="egas-order-card__field-label">{label}</span>
      <span className="egas-order-card__field-value">{value}</span>
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function OrderCardSkeleton({ compact = false }) {
  return (
    <div
      className={`egas-order-card ${compact ? 'egas-order-card--compact' : ''}`}
      aria-hidden="true"
    >
      <div className="egas-order-card__top">
        <div className="egas-order-card__heading">
          <span className="egas-skeleton" style={{ display: 'block', width: '60%', height: 18 }} />
          <span className="egas-skeleton" style={{ display: 'block', width: '40%', height: 14, marginTop: 6 }} />
        </div>
        <span className="egas-skeleton" style={{ width: 80, height: 22, borderRadius: 999 }} />
      </div>
      <div className="egas-order-card__grid">
        <span className="egas-skeleton" style={{ height: 36 }} />
        <span className="egas-skeleton" style={{ height: 36 }} />
        <span className="egas-skeleton" style={{ height: 36 }} />
      </div>
    </div>
  );
}

/* ---------- Empty state (only when list is truly empty) ---------- */
export function OrderCardEmpty({ onAction, actionHref }) {
  return (
    <div
      className="egas-order-card"
      style={{
        textAlign: 'center',
        padding: 'var(--sp-9) var(--sp-5)',
        placeItems: 'center',
        display: 'grid',
        gap: 'var(--sp-3)',
      }}
    >
      <div
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--egas-primary-light)',
          color: 'var(--egas-primary)',
          display: 'grid', placeItems: 'center', margin: '0 auto',
        }}
      >
        <Package size={28} />
      </div>
      <h3 className="egas-h3" style={{ margin: 0 }}>No orders yet</h3>
      <p className="egas-text" style={{ margin: 0 }}>
        Your placed orders will appear here once you place your first one.
      </p>
      {actionHref && (
        <a href={actionHref} className="egas-btn egas-btn--primary" style={{ marginTop: 8 }}>
          Order Gas
        </a>
      )}
    </div>
  );
}