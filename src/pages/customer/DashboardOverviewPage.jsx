import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Repeat, Wallet, Truck, Droplet, Package,
  ChevronRight, Sparkles, ArrowRight, RefreshCw,
} from 'lucide-react';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard, SkeletonText } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrap } from './apiHelpers';

const QUICK_ACTIONS = [
  { to: '/dashboard/order',          label: 'Order Gas',           icon: ShoppingBag },
  { to: '/dashboard/orders',         label: 'Track Order',         icon: Truck },
  { to: '/dashboard/subscriptions',  label: 'Subscriptions',       icon: Repeat },
  { to: '/dashboard/payments',       label: 'Wallet & Payments',   icon: Wallet },
  { to: '/dashboard/support',        label: 'Contact Support',     icon: Sparkles },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [state, setState] = useState({ status: 'loading', overview: null, next: null });

  const load = async () => {
    setState((s) => ({ ...s, status: 'loading' }));

    const [overviewRes, nextRes] = await Promise.allSettled([
      ApiService.dashboard?.getOverview?.() ?? Promise.resolve(null),
      ApiService.dashboard?.getNextDelivery?.() ?? Promise.resolve(null),
    ]);

    const overview =
      overviewRes.status === 'fulfilled' ? unwrap(overviewRes.value) : null;
    const nextRaw =
      nextRes.status === 'fulfilled' ? unwrap(nextRes.value) : null;

    // Overview call failing hard = error state; next-delivery failing = no next
    if (overviewRes.status === 'rejected' && nextRes.status === 'rejected') {
      setState({
        status: 'error',
        overview: null,
        next: null,
        error: overviewRes.reason,
      });
      return;
    }

    setState({ status: 'success', overview, next: nextRaw || null });
  };

  useEffect(() => { load(); }, []);

  const firstName = user?.firstName || 'there';
  const overview  = state.overview;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's a snapshot of your e-GAS account."
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={load}
            disabled={state.status === 'loading'}
          >
            Refresh
          </Button>
        }
      />

      {/* Welcome band */}
      <div className="egas-welcome">
        <div>
          <h2>Need more gas?</h2>
          <p>Place an order in under a minute — we&apos;ll take it from there.</p>
        </div>
        <div className="egas-welcome__actions">
          <Button href="/dashboard/order" variant="primary" rightIcon={<ArrowRight size={16} />}>
            Order Gas
          </Button>
          <Button href="/dashboard/subscriptions" variant="secondary">
            Manage Subscription
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {state.status === 'loading' && (
        <>
          <div className="egas-grid-cards" style={{ marginTop: 'var(--sp-6)' }}>
            {[0,1,2,3].map((i) => <SkeletonCard key={i} />)}
          </div>
          <div className="egas-dash-section"><SkeletonCard /></div>
        </>
      )}

      {/* Error state */}
      {state.status === 'error' && (
        <div style={{ marginTop: 'var(--sp-6)' }}>
          <ErrorState
            title="We couldn't load your dashboard"
            description="Please check your connection and try again."
            onRetry={load}
          />
        </div>
      )}

      {/* Success */}
      {state.status === 'success' && overview && (
        <>
          {/* Summary cards */}
          <div className="egas-grid-cards" style={{ marginTop: 'var(--sp-6)' }}>
            <StatCard
              icon={<Package size={18} />}
              label="Total orders"
              value={overview.orderCount ?? 0}
              hint={overview.activeOrderCount ? `${overview.activeOrderCount} active` : 'All-time'}
            />
            <StatCard
              icon={<Repeat size={18} />}
              label="Active subscriptions"
              value={(overview.activeSubscriptions || []).length || overview.subscriptionCount || 0}
              hint={overview.subscriptionCount ? `${overview.subscriptionCount} total` : 'Manage anytime'}
            />
            <StatCard
              icon={<Wallet size={18} />}
              label="Wallet balance"
              value={naira(overview.walletBalance ?? 0)}
              hint="Pay faster at checkout"
            />
            <StatCard
              icon={<Truck size={18} />}
              label="This month"
              value={naira(overview.thisMonthSpent ?? 0)}
              hint={`Total spend ${naira(overview.totalSpent ?? 0)}`}
            />
          </div>

          {/* Next delivery */}
          <section className="egas-dash-section" aria-labelledby="next-delivery-heading">
            <div className="egas-dash-section__head">
              <h2 id="next-delivery-heading" className="egas-dash-section__title">Next delivery</h2>
            </div>

            {state.next ? (
              <NextDeliveryCard delivery={state.next} />
            ) : (
              <div className="egas-card" style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                <div className="egas-stat-card__icon" style={{ margin: 0 }}><Truck size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--fw-semibold)' }}>No upcoming deliveries</div>
                  <div className="egas-text egas-text--sm">Place an order or start a subscription to schedule one.</div>
                </div>
                <Button href="/dashboard/order" variant="secondary" size="sm">Order Gas</Button>
              </div>
            )}
          </section>

          {/* Quick actions */}
          <section className="egas-dash-section" aria-labelledby="quick-actions-heading">
            <div className="egas-dash-section__head">
              <h2 id="quick-actions-heading" className="egas-dash-section__title">Quick actions</h2>
            </div>
            <div className="egas-quick-actions">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="egas-quick-action">
                  <span className="egas-quick-action__icon"><Icon size={18} /></span>
                  <span className="egas-quick-action__label">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent orders */}
          <section className="egas-dash-section" aria-labelledby="recent-orders-heading">
            <div className="egas-dash-section__head">
              <h2 id="recent-orders-heading" className="egas-dash-section__title">Recent orders</h2>
              <Link to="/dashboard/orders" className="egas-text--sm" style={{ fontWeight: 'var(--fw-semibold)' }}>
                View all <ChevronRight size={14} style={{ verticalAlign: -2 }} />
              </Link>
            </div>

            {(overview.recentOrders || []).length === 0 ? (
              <EmptyState
                title="No orders yet"
                description="Your placed orders will appear here. Start with your first order."
                actionLabel="Order Gas"
                actionHref="/dashboard/order"
              />
            ) : (
              <div className="egas-list-stack">
                {overview.recentOrders.map((o) => (
                  <Link key={o._id} to={`/dashboard/orders/${o._id}`} className="egas-order-card">
                    <div className="egas-order-card__top">
                      <div style={{ minWidth: 0 }}>
                        <h3 className="egas-order-card__ref">
                          {(o.products?.[0]?.productName || o.products?.[0]?.product?.name || 'Order')}
                        </h3>
                        <p className="egas-order-card__date">
                          #{String(o.orderId || o._id).slice(-8).toUpperCase()} · {formatDate(o.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={o.orderStatus || o.paymentStatus} />
                    </div>
                    <div className="egas-order-card__grid">
                      <Field label="Total" value={naira(o.totalAmount)} />
                      <Field label="Payment" value={o.paymentStatus || '—'} />
                      <Field label="Items" value={`${(o.products || []).length} item(s)`} />
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
          </section>

          {/* Active subscriptions preview */}
          {(overview.activeSubscriptions || []).length > 0 && (
            <section className="egas-dash-section" aria-labelledby="active-subs-heading">
              <div className="egas-dash-section__head">
                <h2 id="active-subs-heading" className="egas-dash-section__title">Active subscriptions</h2>
                <Link to="/dashboard/subscriptions" className="egas-text--sm" style={{ fontWeight: 'var(--fw-semibold)' }}>
                  Manage <ChevronRight size={14} style={{ verticalAlign: -2 }} />
                </Link>
              </div>
              <div className="egas-list-stack">
                {overview.activeSubscriptions.slice(0, 3).map((s, i) => (
                  <div key={i} className="egas-card" style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="egas-stat-card__icon" style={{ margin: 0 }}><Repeat size={18} /></div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{s.name || 'Subscription'}</div>
                      <div className="egas-text egas-text--sm">
                        {s.deliveryFrequency || 'monthly'} delivery
                        {s.nextDeliveryDate ? ` · next ${formatDate(s.nextDeliveryDate)}` : ''}
                      </div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Overview returned but user has no data at all — show a soft empty */}
      {state.status === 'success' && overview && (overview.orderCount || 0) === 0 && (overview.subscriptionCount || 0) === 0 && (overview.walletBalance || 0) === 0 && (
        <section className="egas-dash-section">
          <div className="egas-card" style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="egas-stat-card__icon" style={{ margin: 0, background: 'var(--egas-accent-soft)', color: 'var(--egas-accent)' }}>
              <Droplet size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 'var(--fw-semibold)' }}>Welcome to e-GAS</div>
              <div className="egas-text egas-text--sm">
                Set up your first delivery in a couple of clicks.
              </div>
            </div>
            <Button href="/dashboard/order" variant="primary">Order your first cylinder</Button>
          </div>
        </section>
      )}
    </>
  );
}

/* ---------- Subcomponents ---------- */
function StatCard({ icon, label, value, hint }) {
  return (
    <div className="egas-stat-card">
      <div className="egas-stat-card__icon">{icon}</div>
      <div className="egas-stat-card__label">{label}</div>
      <div className="egas-stat-card__value">{value}</div>
      {hint && <div className="egas-stat-card__hint">{hint}</div>}
    </div>
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

function NextDeliveryCard({ delivery }) {
  const d = delivery || {};
  return (
    <div className="egas-next-delivery">
      <div className="egas-next-delivery__icon"><Truck size={26} /></div>
      <div>
        <div className="egas-next-delivery__label">Upcoming</div>
        <h3 className="egas-next-delivery__date">{formatDate(d.deliveryDate)}</h3>
        <p className="egas-next-delivery__meta">
          {d.subscription?.name && <span>{d.subscription.name}</span>}
          {d.subscription?.size && <span>· {d.subscription.size}</span>}
          {d.subscription?.frequency && <span>· {d.subscription.frequency}</span>}
          {d.status && <StatusBadge status={d.status} />}
        </p>
      </div>
      <div>
        <Button href={`/dashboard/orders/${d.deliveryId}`} variant="secondary" size="sm">
          View details
        </Button>
      </div>
    </div>
  );
}