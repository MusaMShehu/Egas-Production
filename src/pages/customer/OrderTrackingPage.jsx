import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Truck, CheckCircle2, Clock } from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { formatDate, unwrap, deliveryStatusLabel } from './apiHelpers';

const POLL_MS = 30000; // 30s gentle poll — pauses when tab is hidden

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', order: null, delivery: null });
  const timerRef = useRef(null);

  const load = async () => {
    try {
      const res = await ApiService.orders?.getById?.(id) ?? null;
      const order = unwrap(res);
      let delivery = null;
      try {
        const myDeliveries = await ApiService.delivery?.getMyDeliveries?.({});
        const list = unwrap(myDeliveries)?.data || unwrap(myDeliveries);
        delivery = Array.isArray(list)
          ? list.find((d) => d.orderId === order?._id || d.order === order?._id) || null
          : null;
      } catch {/* ignore */}
      setState({ status: 'success', order, delivery });
    } catch (err) {
      setState((s) => (s.order ? { ...s } : { status: 'error', order: null, delivery: null, error: err }));
    }
  };

  useEffect(() => { load(); }, [id]);

  // Gentle polling, respects tab visibility
  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(async () => {
        if (!document.hidden) await load();
        schedule();
      }, POLL_MS);
    };
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [id]);

  const order = state.order;
  const delivery = state.delivery;
  const status = delivery?.status || order?.orderStatus || 'processing';

  return (
    <>
      <PageHeader
        title="Track your order"
        subtitle={order ? `#${String(order.orderId || order._id).slice(-8).toUpperCase()}` : ''}
        actions={
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />}
              onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
              onClick={load} disabled={state.status === 'loading'}>
              Refresh
            </Button>
          </div>
        }
      />

      {state.status === 'loading' && !order && (
        <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
      )}

      {state.status === 'error' && (
        <ErrorState
          title="We couldn't load this delivery"
          description="Please try again in a moment."
          onRetry={load}
        />
      )}

      {order && (
        <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
          <Card>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="egas-next-delivery__icon" style={{ margin: 0 }}>
                <Truck size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)' }}>Current status</div>
                <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', letterSpacing: '-.01em', marginTop: 2 }}>
                  {deliveryStatusLabel(status)}
                </div>
                {delivery?.deliveryDate && (
                  <div className="egas-text egas-text--sm" style={{ marginTop: 2 }}>
                    <Clock size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                    Scheduled {formatDate(delivery.deliveryDate, { withTime: true })}
                  </div>
                )}
              </div>
              <StatusBadge status={status} />
            </div>
          </Card>

          <Card>
            <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-4)' }}>Progress</h2>
            <ol className="egas-timeline">
              {[
                { key: 'placed',    label: 'Order placed',      at: order.createdAt,   done: true },
                { key: 'paid',      label: 'Payment confirmed', at: order.paidAt,       done: order.paymentStatus === 'completed' },
                { key: 'assigned',  label: 'Assigned to agent', at: delivery?.assignedAt, done: !!delivery?.assignedAt },
                { key: 'accepted',  label: 'Agent accepted',    at: delivery?.acceptedAt, done: !!delivery?.acceptedAt },
                { key: 'out',       label: 'Out for delivery',  at: status === 'out_for_delivery' ? delivery?.updatedAt : null, done: ['out_for_delivery','delivered'].includes(status) },
                { key: 'delivered', label: 'Delivered',         at: order.deliveredAt || delivery?.deliveredAt, done: status === 'delivered' || !!order.deliveredAt },
              ].map((s, i, arr) => {
                const isLast = i === arr.length - 1;
                const isActive = !s.done && arr.slice(0, i).every((p) => p.done) && !arr.slice(i).some((n) => n.done);
                return (
                  <li key={s.key}
                    className={`egas-timeline__item ${s.done ? 'is-done' : isActive ? 'is-active' : ''}`}>
                    <span className="egas-timeline__dot" aria-hidden="true">
                      {s.done && <CheckCircle2 size={12} />}
                    </span>
                    <p className="egas-timeline__title">{s.label}</p>
                    {s.at && <p className="egas-timeline__meta">{formatDate(s.at, { withTime: true })}</p>}
                    {isLast && !s.done && <p className="egas-timeline__meta">Waiting…</p>}
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card>
            <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-3)' }}>Delivery address</h2>
            <p className="egas-text">{order.deliveryAddress || '—'}</p>
          </Card>

          <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <Button href={`/dashboard/orders/${order._id}`} variant="secondary">View order details</Button>
            <Button href="/dashboard/support" variant="ghost">Contact support</Button>
          </div>
        </div>
      )}
    </>
  );
}