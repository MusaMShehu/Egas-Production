import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, Check, Info, RefreshCw, Package, Repeat, CreditCard,
  MessageSquare, Sparkles, AlertTriangle, ShieldCheck,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useOptionalFirebaseNotifications } from './useOptionalFirebaseNotifications';

const ICONS = {
  order:        Package,
  subscription: Repeat,
  wallet:       CreditCard,
  support:      MessageSquare,
  promotional:  Sparkles,
  system:       Info,
  account:      ShieldCheck,
  delivery:     AlertTriangle,
};

const TABS = [
  { key: 'all',          label: 'All' },
  { key: 'unread',       label: 'Unread' },
  { key: 'order',        label: 'Orders' },
  { key: 'delivery',     label: 'Delivery' },
  { key: 'subscription', label: 'Subscriptions' },
  { key: 'wallet',       label: 'Wallet' },
  { key: 'support',      label: 'Support' },
];

export default function NotificationsPage() {
  const ctx = useOptionalFirebaseNotifications();

  const [tab, setTab] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const list = ctx?.notifications || [];
  const unreadCount = ctx?.unreadCount ?? 0;

  const filtered = useMemo(() => {
    if (!list.length) return [];
    if (tab === 'all') return list;
    if (tab === 'unread') return list.filter((n) => !n.read);
    return list.filter((n) => n.type === tab);
  }, [list, tab]);

  const counts = useMemo(() => {
    const c = { all: list.length, unread: list.filter((n) => !n.read).length };
    list.forEach((n) => { c[n.type] = (c[n.type] || 0) + 1; });
    return c;
  }, [list]);

  const markAsRead = async (id) => {
    if (!ctx?.markAsRead) return;
    setBusyId(id);
    try { await ctx.markAsRead(id); }
    finally { setBusyId(null); }
  };
  const markAllAsRead = async () => {
    if (!ctx?.markAllAsRead) return;
    try { await ctx.markAllAsRead(); } catch {/* surface via toast */}
  };

  // -------- No context mounted --------
  if (!ctx) {
    return (
      <>
        <PageHeader title="Notifications" subtitle="Account updates, deliveries, and payments." />
        <EmptyState
          icon={<Bell size={26} />}
          title="Notifications aren't enabled on this device"
          description="Enable push notifications to receive order, delivery, and payment updates. You can also manage your preferences in Settings."
          actionLabel="Open Settings"
          actionHref="/dashboard/settings"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up.'}
        actions={
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {ctx?.refresh && (
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={ctx.refresh}>
                Refresh
              </Button>
            )}
            {unreadCount > 0 && ctx?.markAllAsRead && (
              <Button variant="secondary" size="sm" leftIcon={<Check size={14} />} onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        }
      />

      <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="Filter notifications">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`egas-tab ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {counts[t.key] != null && counts[t.key] > 0 && (
              <span className="egas-tab__count">{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {ctx.loading && list.length === 0 && (
          <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
        )}

        {!ctx.loading && filtered.length === 0 && (
          <EmptyState
            icon={<Bell size={26} />}
            title={tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            description={
              tab === 'unread'
                ? 'You are all caught up.'
                : 'Updates about your orders, deliveries, and payments will appear here.'
            }
          />
        )}

        {filtered.length > 0 && (
          <div className="egas-notif-list">
            {filtered.map((n) => (
              <NotificationCard
                key={n._id || n.id}
                n={n}
                busy={busyId === (n._id || n.id)}
                onMarkRead={markAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NotificationCard({ n, busy, onMarkRead }) {
  const Icon = ICONS[n.type] || Bell;
  const id = n._id || n.id;
  const unread = !n.read;

  return (
    <article className={`egas-notif ${unread ? 'is-unread' : ''}`}>
      <span className="egas-notif__icon" aria-hidden="true"><Icon size={18} /></span>
      <div style={{ minWidth: 0 }}>
        <p className="egas-notif__title">{n.title || 'Notification'}</p>
        {n.message && <p className="egas-notif__message">{n.message}</p>}
        <p className="egas-notif__meta">
          {n.createdAt ? new Date(n.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
        </p>
      </div>
      {unread && (
        <button
          type="button"
          className="egas-btn egas-btn--ghost egas-btn--sm"
          aria-label="Mark as read"
          onClick={() => onMarkRead?.(id)}
          disabled={busy}
        >
          <Check size={14} />
        </button>
      )}
    </article>
  );
}