import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ChevronRight, RefreshCw } from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import StatusBadge from '../../components/ui/StatusBadge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrapList } from './apiHelpers';

const TABS = [
  { key: 'all',        label: 'All' },
  { key: 'processing', label: 'Processing' },
  { key: 'in-transit', label: 'In Transit' },
  { key: 'delivered',  label: 'Delivered' },
  { key: 'cancelled',  label: 'Cancelled' },
];

export default function MyOrdersPage() {
  const [state, setState] = useState({ status: 'loading', orders: [] });
  const [tab, setTab] = useState('all');

  const load = async () => {
    setState({ status: 'loading', orders: [] });
    try {
      const res = await ApiService.orders?.getAll?.();
      const orders = unwrapList(res);
      setState({ status: 'success', orders });
    } catch (err) {
      setState({ status: 'error', orders: [], error: err });
    }
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => {
    const c = { all: state.orders.length };
    state.orders.forEach((o) => {
      const k = o.orderStatus || 'processing';
      c[k] = (c[k] || 0) + 1;
    });
    return c;
  }, [state.orders]);

  const filtered = useMemo(() => {
    if (tab === 'all') return state.orders;
    return state.orders.filter((o) => (o.orderStatus || 'processing') === tab);
  }, [state.orders, tab]);

  return (
    <>
      <PageHeader
        title="My Orders"
        subtitle="Track every e-GAS order from placement to delivery."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={load} disabled={state.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      <div className="egas-tabs" role="tablist" aria-label="Filter orders">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`egas-tab ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="egas-tab__count">{counts[t.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {state.status === 'loading' && (
          <div className="egas-list-stack">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load your orders"
            description="Please check your connection and try again."
            onRetry={load}
          />
        )}

        {state.status === 'success' && filtered.length === 0 && (
          <EmptyState
            icon={<PackageOpen size={26} />}
            title={state.orders.length === 0 ? 'No orders yet' : 'Nothing in this tab'}
            description={
              state.orders.length === 0
                ? 'Place your first order and it will appear here.'
                : 'Try a different filter, or place a new order.'
            }
            actionLabel={state.orders.length === 0 ? 'Order Gas' : undefined}
            actionHref={state.orders.length === 0 ? '/dashboard/order' : undefined}
          />
        )}

        {state.status === 'success' && filtered.length > 0 && (
          <div className="egas-list-stack">
            {filtered.map((o) => (
              <Link key={o._id} to={`/dashboard/orders/${o._id}`} className="egas-order-card">
                <div className="egas-order-card__top">
                  <div style={{ minWidth: 0 }}>
                    <h3 className="egas-order-card__ref">
                      {(o.products || []).map((p) => p.product?.name || p.productName).filter(Boolean).join(', ') || 'Order'}
                    </h3>
                    <p className="egas-order-card__date">
                      #{String(o.orderId || o._id).slice(-8).toUpperCase()} · {formatDate(o.createdAt, { withTime: true })}
                    </p>
                  </div>
                  <StatusBadge status={o.orderStatus || o.paymentStatus} />
                </div>
                <div className="egas-order-card__grid">
                  <div className="egas-order-card__field">
                    <span className="egas-order-card__field-label">Total</span>
                    <span className="egas-order-card__field-value">{naira(o.totalAmount)}</span>
                  </div>
                  <div className="egas-order-card__field">
                    <span className="egas-order-card__field-label">Payment</span>
                    <span className="egas-order-card__field-value">{o.paymentStatus || '—'}</span>
                  </div>
                  <div className="egas-order-card__field">
                    <span className="egas-order-card__field-label">Delivery</span>
                    <span className="egas-order-card__field-value">{o.deliveryAddress || '—'}</span>
                  </div>
                </div>
                <div className="egas-order-card__cta">
                  <span className="egas-btn egas-btn--ghost egas-btn--sm">
                    View details <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}