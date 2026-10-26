import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, RefreshCw, LifeBuoy } from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard, SkeletonText } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrap } from './apiHelpers';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', order: null });
  const [delivery, setDelivery] = useState(null);

  const load = async () => {
    setState({ status: 'loading', order: null });
    setDelivery(null);

    try {
      // Prefer getById; fall back to getOne if that's how apiService names it.
      const fn =
        ApiService.orders?.getById ||
        ApiService.orders?.getOne ||
        ApiService.orders?.getById?.bind(ApiService.orders);
      if (!fn) throw new Error('Orders API not available.');

      const res = await fn(id);
      const order = unwrap(res);
      if (!order) throw new Error('Order not found.');

      setState({ status: 'success', order });

      // Best-effort: try to find a matching delivery for the timeline.
      try {
        const myDeliveries = await ApiService.delivery?.getMyDeliveries?.({});
        const list = unwrap(myDeliveries)?.data || unwrap(myDeliveries);
        const match = Array.isArray(list)
          ? list.find((d) => d.orderId === order._id || d.order === order._id)
          : null;
        if (match) setDelivery(match);
      } catch {
        // Ignore — timeline will fall back to order fields only.
      }
    } catch (err) {
      setState({ status: 'error', order: null, error: err });
    }
  };

  useEffect(() => { load(); }, [id]);

  const order = state.order;

  const timeline = buildTimeline(order, delivery);

  return (
    <>
      <PageHeader
        title={order ? `Order #${String(order.orderId || order._id).slice(-8).toUpperCase()}` : 'Order'}
        subtitle={order ? formatDate(order.createdAt, { withTime: true }) : ''}
        actions={
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft size={14} />}
              onClick={() => navigate('/dashboard/orders')}>
              Back
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
              onClick={load} disabled={state.status === 'loading'}>
              Refresh
            </Button>
          </div>
        }
      />

      {state.status === 'loading' && (
        <div className="egas-list-stack">
          <SkeletonCard />
          <Card><SkeletonText lines={4} /></Card>
        </div>
      )}

      {state.status === 'error' && (
        <ErrorState
          title="We couldn't load this order"
          description="The order may not exist, or you may not have access to it."
          onRetry={load}
        />
      )}

      {state.status === 'success' && order && (
        <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
          {/* Top card: status + payment */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
              <div>
                <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)' }}>Status</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={order.orderStatus || 'processing'} />
                  {order.paymentStatus && <StatusBadge status={order.paymentStatus} />}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)' }}>Total</div>
                <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', letterSpacing: '-.02em' }}>
                  {naira(order.totalAmount)}
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          {timeline.length > 0 && (
            <Card>
              <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-4)' }}>Timeline</h2>
              <ol className="egas-timeline">
                {timeline.map((step) => (
                  <li key={step.key}
                    className={`egas-timeline__item ${step.state === 'done' ? 'is-done' : step.state === 'active' ? 'is-active' : ''}`}>
                    <span className="egas-timeline__dot" aria-hidden="true" />
                    <p className="egas-timeline__title">{step.label}</p>
                    {step.at && <p className="egas-timeline__meta">{formatDate(step.at, { withTime: true })}</p>}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {/* Items */}
          <Card>
            <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-3)' }}>Items</h2>
            {(order.products || []).length === 0 ? (
              <p className="egas-text">No items recorded.</p>
            ) : (
              <div>
                {order.products.map((it, i) => (
                  <div key={i} className="egas-item-row">
                    <div style={{ minWidth: 0 }}>
                      <p className="egas-item-row__name">
                        {it.product?.name || it.productName || 'Product'}
                      </p>
                      <p className="egas-item-row__meta">
                        Quantity: {it.quantity ?? 1}
                        {it.price != null ? ` · ${naira(it.price)} each` : ''}
                      </p>
                    </div>
                    <span className="egas-item-row__price">
                      {naira((it.price || 0) * (it.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Delivery + Payment summary */}
          <div style={{ display: 'grid', gap: 'var(--sp-5)', gridTemplateColumns: '1fr' }}>
            <Card>
              <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-3)' }}>Delivery</h2>
              <ul className="egas-summary-list">
                <li><span>Address</span><span>{order.deliveryAddress || '—'}</span></li>
                <li><span>Option</span><span>{order.deliveryOption || 'standard'}</span></li>
                {order.deliveryFee != null && (
                  <li><span>Delivery fee</span><span>{naira(order.deliveryFee)}</span></li>
                )}
              </ul>
            </Card>

            <Card>
              <h2 className="egas-dash-section__title" style={{ marginBottom: 'var(--sp-3)' }}>Payment summary</h2>
              <ul className="egas-summary-list">
                <li><span>Payment method</span><span>{order.paymentMethod || '—'}</span></li>
                <li><span>Payment status</span><span>{order.paymentStatus || '—'}</span></li>
                {order.paidAt && <li><span>Paid on</span><span>{formatDate(order.paidAt, { withTime: true })}</span></li>}
                {order.reference && <li><span>Reference</span><span style={{ wordBreak: 'break-all' }}>{order.reference}</span></li>}
                <li className="is-total"><span>Total</span><span>{naira(order.totalAmount)}</span></li>
              </ul>
            </Card>
          </div>

          {/* Support */}
          <Card>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <LifeBuoy size={20} style={{ color: 'var(--egas-primary)' }} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 'var(--fw-semibold)' }}>Something wrong with this order?</div>
                <div className="egas-text egas-text--sm">Reach our support team and we&apos;ll help sort it out.</div>
              </div>
              <Button href="/dashboard/support" variant="secondary" size="sm">Contact support</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

/* ---------- Timeline derivation ---------- */
function buildTimeline(order, delivery) {
  if (!order) return [];
  const steps = [
    { key: 'placed',    label: 'Order placed',     at: order.createdAt },
    { key: 'paid',      label: 'Payment confirmed', at: order.paidAt },
    { key: 'assigned',  label: 'Assigned to agent', at: delivery?.assignedAt },
    { key: 'accepted',  label: 'Agent accepted',    at: delivery?.acceptedAt },
    { key: 'out',       label: 'Out for delivery',  at: delivery?.status === 'out_for_delivery' ? delivery?.updatedAt : null },
    { key: 'delivered', label: 'Delivered',         at: order.deliveredAt || delivery?.deliveredAt },
  ];

  // Determine current position from order/delivery status
  const statusNow = (delivery?.status || order.orderStatus || '').toLowerCase();
  let activeIdx = 0;
  if (statusNow === 'cancelled') {
    return [
      { key: 'placed', label: 'Order placed', at: order.createdAt, state: 'done' },
      { key: 'cancelled', label: 'Order cancelled', at: order.updatedAt, state: 'active' },
    ];
  }
  if (statusNow === 'delivered' || order.deliveredAt) activeIdx = steps.length - 1;
  else if (statusNow === 'out_for_delivery') activeIdx = 4;
  else if (statusNow === 'accepted')         activeIdx = 3;
  else if (statusNow === 'assigned')         activeIdx = 2;
  else if (order.paymentStatus === 'completed') activeIdx = 1;
  else activeIdx = 0;

  return steps
    .map((s, i) => {
      if (i < activeIdx) return { ...s, state: 'done' };
      if (i === activeIdx) return { ...s, state: s.at ? 'done' : 'active' };
      return { ...s, state: 'pending' };
    })
    .filter((s) => s.at || s.state !== 'pending');
}