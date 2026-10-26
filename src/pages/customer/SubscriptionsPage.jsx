// import React, { useEffect, useMemo, useState } from 'react';
// import { RefreshCw, Repeat, Calendar, PauseCircle, PlayCircle, XCircle, RotateCw } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import Button from '../../components/ui/Button';
// import PageHeader from '../../components/ui/PageHeader';
// import Card from '../../components/ui/Card';
// import StatusBadge from '../../components/ui/StatusBadge';
// import Modal from '../../components/ui/Modal';
// import EmptyState from '../../components/ui/EmptyState';
// import ErrorState from '../../components/ui/ErrorState';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import { naira, formatDate, unwrapList } from './apiHelpers';

// const TABS = [
//   { key: 'active',  label: 'Active' },
//   { key: 'paused',  label: 'Paused' },
//   { key: 'expired', label: 'Expired' },
//   { key: 'cancelled', label: 'Cancelled' },
// ];

// export default function SubscriptionsPage() {
//   const [state, setState] = useState({ status: 'loading', subs: [] });
//   const [tab, setTab] = useState('active');
//   const [busyId, setBusyId] = useState(null);
//   const [confirm, setConfirm] = useState(null);
//   const [actionError, setActionError] = useState('');

//   const load = async () => {
//     setState({ status: 'loading', subs: [] });
//     try {
//       const res = await ApiService.subscriptions?.getMySubscriptions?.();
//       let list = unwrapList(res);
//       // Backend 'my-subscriptions' returns active + paused only; that's fine.
//       setState({ status: 'success', subs: list });
//     } catch (err) {
//       setState({ status: 'error', subs: [], error: err });
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = useMemo(() => {
//     return state.subs.filter((s) => (s.status || 'active') === tab);
//   }, [state.subs, tab]);

//   const counts = useMemo(() => {
//     const c = { active: 0, paused: 0, expired: 0, cancelled: 0 };
//     state.subs.forEach((s) => { c[s.status || 'active'] = (c[s.status || 'active'] || 0) + 1; });
//     return c;
//   }, [state.subs]);

//   const doAction = async (action, sub) => {
//     setActionError('');
//     setBusyId(sub._id);
//     try {
//       if (action === 'pause')  await ApiService.subscriptions.pause(sub._id);
//       if (action === 'resume') await ApiService.subscriptions.resume(sub._id);
//       if (action === 'cancel') await ApiService.subscriptions.cancelMy(sub._id);
//       if (action === 'renew')  await ApiService.subscriptions.renew(sub._id);
//       await load();
//     } catch (err) {
//       setActionError(
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         'Action failed. Please try again.'
//       );
//     } finally {
//       setBusyId(null);
//       setConfirm(null);
//     }
//   };

//   return (
//     <>
//       <PageHeader
//         title="My Subscriptions"
//         subtitle="Manage recurring deliveries — pause, resume, renew, or cancel."
//         actions={
//           <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
//             <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
//               onClick={load} disabled={state.status === 'loading'}>
//               Refresh
//             </Button>
//             <Button href="/dashboard/order" variant="primary" size="sm">
//               New subscription
//             </Button>
//           </div>
//         }
//       />

//       <div className="egas-tabs" role="tablist" aria-label="Filter subscriptions">
//         {TABS.map((t) => (
//           <button
//             key={t.key}
//             role="tab"
//             aria-selected={tab === t.key}
//             className={`egas-tab ${tab === t.key ? 'is-active' : ''}`}
//             onClick={() => setTab(t.key)}
//             type="button"
//           >
//             {t.label}
//             <span className="egas-tab__count">{counts[t.key] ?? 0}</span>
//           </button>
//         ))}
//       </div>

//       {actionError && (
//         <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
//           {actionError}
//         </div>
//       )}

//       <div style={{ marginTop: 'var(--sp-5)' }}>
//         {state.status === 'loading' && (
//           <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
//         )}

//         {state.status === 'error' && (
//           <ErrorState
//             title="We couldn't load your subscriptions"
//             description="Please check your connection and try again."
//             onRetry={load}
//           />
//         )}

//         {state.status === 'success' && filtered.length === 0 && (
//           <EmptyState
//             icon={<Repeat size={26} />}
//             title={
//               tab === 'active' ? 'No active subscriptions' :
//               tab === 'paused' ? 'No paused subscriptions' :
//               tab === 'expired' ? 'No expired subscriptions' :
//               'No cancelled subscriptions'
//             }
//             description={
//               tab === 'active'
//                 ? 'Start a subscription and it will appear here.'
//                 : 'Try another tab.'
//             }
//             actionLabel={tab === 'active' ? 'Browse plans' : undefined}
//             actionHref={tab === 'active' ? '/dashboard/plans' : undefined}
//           />
//         )}

//         {state.status === 'success' && filtered.length > 0 && (
//           <div className="egas-list-stack">
//             {filtered.map((s) => (
//               <SubscriptionCard
//                 key={s._id}
//                 sub={s}
//                 busy={busyId === s._id}
//                 onRequest={(action) => setConfirm({ action, sub: s })}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Confirm dialog */}
//       <Modal
//         open={!!confirm}
//         onClose={() => !busyId && setConfirm(null)}
//         title={
//           confirm?.action === 'pause'  ? 'Pause subscription?' :
//           confirm?.action === 'resume' ? 'Resume subscription?' :
//           confirm?.action === 'cancel' ? 'Cancel subscription?' :
//           confirm?.action === 'renew'  ? 'Renew subscription?' :
//           'Confirm action'
//         }
//         footer={
//           <>
//             <Button variant="secondary" onClick={() => setConfirm(null)} disabled={!!busyId}>
//               Never mind
//             </Button>
//             <Button
//               variant={confirm?.action === 'cancel' ? 'danger' : 'primary'}
//               loading={busyId === confirm?.sub?._id}
//               onClick={() => doAction(confirm.action, confirm.sub)}
//             >
//               {confirm?.action === 'pause' ? 'Pause' :
//                confirm?.action === 'resume' ? 'Resume' :
//                confirm?.action === 'cancel' ? 'Cancel subscription' :
//                confirm?.action === 'renew' ? 'Renew' : 'Confirm'}
//             </Button>
//           </>
//         }
//       >
//         {confirm?.action === 'pause' && (
//           <p className="egas-text">
//             Deliveries will stop while the subscription is paused. Your remaining time is preserved.
//           </p>
//         )}
//         {confirm?.action === 'resume' && (
//           <p className="egas-text">
//             Deliveries will restart according to your original schedule.
//           </p>
//         )}
//         {confirm?.action === 'cancel' && (
//           <p className="egas-text">
//             Cancelling stops all future deliveries. This action cannot be undone from the app.
//           </p>
//         )}
//         {confirm?.action === 'renew' && (
//           <p className="egas-text">
//             You&apos;ll be asked to confirm payment terms to renew this subscription.
//           </p>
//         )}
//       </Modal>
//     </>
//   );
// }

// /* ---------- Subcomponent ---------- */
// function SubscriptionCard({ sub, busy, onRequest }) {
//   const nextDate =
//     sub.nextDeliveryDate || sub.startDate;

//   return (
//     <div className="egas-sub-card">
//       <div className="egas-sub-card__top">
//         <div style={{ minWidth: 0 }}>
//           <h3 className="egas-sub-card__title">{sub.planName || 'Subscription'}</h3>
//           <p className="egas-sub-card__meta">
//             <span>{sub.size || '—'}</span>
//             <span>· {sub.frequency || '—'}</span>
//             {sub.subscriptionPeriod && <span>· {sub.subscriptionPeriod} mo</span>}
//           </p>
//         </div>
//         <StatusBadge status={sub.status} />
//       </div>

//       <div className="egas-sub-card__grid">
//         <Field label="Price" value={naira(sub.price)} />
//         <Field label="Started" value={formatDate(sub.startDate)} />
//         <Field label="Next delivery" value={nextDate ? formatDate(nextDate) : '—'} />
//       </div>

//       <div className="egas-sub-card__actions">
//         {sub.status === 'active' && (
//           <>
//             <Button variant="secondary" size="sm"
//               leftIcon={<PauseCircle size={14} />}
//               onClick={() => onRequest('pause')} disabled={busy}>
//               Pause
//             </Button>
//             <Button variant="ghost" size="sm"
//               leftIcon={<XCircle size={14} />}
//               onClick={() => onRequest('cancel')} disabled={busy}>
//               Cancel
//             </Button>
//           </>
//         )}
//         {sub.status === 'paused' && (
//           <>
//             <Button variant="primary" size="sm"
//               leftIcon={<PlayCircle size={14} />}
//               onClick={() => onRequest('resume')} disabled={busy}>
//               Resume
//             </Button>
//             <Button variant="ghost" size="sm"
//               leftIcon={<XCircle size={14} />}
//               onClick={() => onRequest('cancel')} disabled={busy}>
//               Cancel
//             </Button>
//           </>
//         )}
//         {(sub.status === 'expired' || sub.status === 'cancelled') && (
//           <Button variant="primary" size="sm"
//             leftIcon={<RotateCw size={14} />}
//             onClick={() => onRequest('renew')} disabled={busy}>
//             Renew
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// function Field({ label, value }) {
//   return (
//     <div className="egas-order-card__field">
//       <span className="egas-order-card__field-label">{label}</span>
//       <span className="egas-order-card__field-value">{value}</span>
//     </div>
//   );
// }























import React, { useEffect, useMemo, useState } from 'react';
import { 
  RefreshCw, Repeat, Calendar, PauseCircle, PlayCircle, 
  XCircle, RotateCw, Info, Clock, ShieldCheck 
} from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrapList } from './apiHelpers';

const TABS = [
  { key: 'active',    label: 'Active',    color: 'var(--egas-success)' },
  { key: 'paused',    label: 'Paused',    color: 'var(--egas-warning)' },
  { key: 'expired',   label: 'Expired',   color: 'var(--egas-text-muted)' },
  { key: 'cancelled', label: 'Cancelled', color: 'var(--egas-error)' },
];

export default function SubscriptionsPage() {
  const [state, setState] = useState({ status: 'loading', subs: [] });
  const [tab, setTab] = useState('active');
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [actionError, setActionError] = useState('');
  
  // Modal state
  const [selectedSub, setSelectedSub] = useState(null);

  const load = async () => {
    setState({ status: 'loading', subs: [] });
    try {
      // We use the generic getSubscriptions which can return all statuses.
      // (Assuming the backend allows a customer to fetch their own via this route,
      // or you can swap this to a dedicated endpoint that returns all history).
      const res = await ApiService.subscriptions?.getAll?.() || await ApiService.subscriptions?.getMySubscriptions?.();
      
      let list = unwrapList(res);
      
      // If the endpoint only returns active/paused, we still show them accurately.
      // To show history properly, the backend should return all statuses for the user.
      setState({ status: 'success', subs: list });
    } catch (err) {
      setState({ status: 'error', subs: [], error: err });
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return state.subs.filter((s) => (s.status || 'active') === tab);
  }, [state.subs, tab]);

  const counts = useMemo(() => {
    const c = { active: 0, paused: 0, expired: 0, cancelled: 0 };
    state.subs.forEach((s) => { c[s.status || 'active'] = (c[s.status || 'active'] || 0) + 1; });
    return c;
  }, [state.subs]);

  const doAction = async (action, sub) => {
    setActionError('');
    setBusyId(sub._id);
    try {
      if (action === 'pause')  await ApiService.subscriptions.pause(sub._id);
      if (action === 'resume') await ApiService.subscriptions.resume(sub._id);
      if (action === 'cancel') await ApiService.subscriptions.cancelMy(sub._id);
      if (action === 'renew')  await ApiService.subscriptions.renew(sub._id);
      await load();
      setSelectedSub(null); // Close modal on success
    } catch (err) {
      setActionError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Action failed. Please try again.'
      );
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  return (
    <>
      <PageHeader
        title="My Subscriptions"
        subtitle="Manage recurring deliveries — pause, resume, renew, or cancel."
        actions={
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
              onClick={load} disabled={state.status === 'loading'}>
              Refresh
            </Button>
            <Button href="/dashboard/order" variant="primary" size="sm">
              New subscription
            </Button>
          </div>
        }
      />

      {/* Colorful Tabs */}
      <div className="egas-tabs" role="tablist" aria-label="Filter subscriptions" style={{ borderBottom: '1px solid var(--egas-border)', paddingBottom: '2px' }}>
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              className={`egas-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setTab(t.key)}
              type="button"
              style={{
                borderBottom: isActive ? `3px solid ${t.color}` : '3px solid transparent',
                color: isActive ? t.color : undefined,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {t.label}
              <span 
                className="egas-tab__count" 
                style={{ 
                  background: isActive ? `${t.color}20` : undefined,
                  color: isActive ? t.color : undefined
                }}
              >
                {counts[t.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {actionError && (
        <div className="egas-auth-error" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
          {actionError}
        </div>
      )}

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {state.status === 'loading' && (
          <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load your subscriptions"
            description="Please check your connection and try again."
            onRetry={load}
          />
        )}

        {state.status === 'success' && filtered.length === 0 && (
          <EmptyState
            icon={<Repeat size={26} />}
            title={`No ${tab} subscriptions`}
            description={
              tab === 'active'
                ? 'Start a subscription and it will appear here.'
                : `You have no ${tab} subscriptions at the moment.`
            }
            actionLabel={tab === 'active' ? 'Browse plans' : undefined}
            actionHref={tab === 'active' ? '/dashboard/order' : undefined}
          />
        )}

        {state.status === 'success' && filtered.length > 0 && (
          <div className="egas-list-stack">
            {filtered.map((s) => (
              <SubscriptionCard
                key={s._id}
                sub={s}
                busy={busyId === s._id}
                onRequest={(action) => setConfirm({ action, sub: s })}
                onViewDetails={() => setSelectedSub(s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <SubscriptionDetailsModal 
        sub={selectedSub} 
        onClose={() => setSelectedSub(null)} 
      />

      {/* Confirm dialog */}
      <Modal
        open={!!confirm}
        onClose={() => !busyId && setConfirm(null)}
        title={
          confirm?.action === 'pause'  ? 'Pause subscription?' :
          confirm?.action === 'resume' ? 'Resume subscription?' :
          confirm?.action === 'cancel' ? 'Cancel subscription?' :
          confirm?.action === 'renew'  ? 'Renew subscription?' :
          'Confirm action'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)} disabled={!!busyId}>
              Never mind
            </Button>
            <Button
              variant={confirm?.action === 'cancel' ? 'danger' : confirm?.action === 'pause' ? 'warning' : 'primary'}
              loading={busyId === confirm?.sub?._id}
              onClick={() => doAction(confirm.action, confirm.sub)}
            >
              {confirm?.action === 'pause' ? 'Pause' :
               confirm?.action === 'resume' ? 'Resume' :
               confirm?.action === 'cancel' ? 'Cancel subscription' :
               confirm?.action === 'renew' ? 'Renew' : 'Confirm'}
            </Button>
          </>
        }
      >
        {confirm?.action === 'pause' && (
          <p className="egas-text">
            Deliveries will stop while the subscription is paused. Your remaining time is preserved.
          </p>
        )}
        {confirm?.action === 'resume' && (
          <p className="egas-text">
            Deliveries will restart according to your original schedule.
          </p>
        )}
        {confirm?.action === 'cancel' && (
          <p className="egas-text">
            Cancelling stops all future deliveries. This action cannot be undone from the app.
          </p>
        )}
        {confirm?.action === 'renew' && (
          <p className="egas-text">
            You&apos;ll be asked to confirm payment terms to renew this subscription.
          </p>
        )}
      </Modal>
    </>
  );
}

/* ============================================================
   SUBSCRIPTION CARD COMPONENT
   ============================================================ */
function SubscriptionCard({ sub, busy, onRequest, onViewDetails }) {
  const nextDate = sub.nextDeliveryDate || sub.startDate;
  const endDate = sub.endDate;
  
  // Calculate Progress
  let progressPercent = 0;
  let daysLeft = 0;
  if (sub.startDate && sub.endDate) {
    const start = new Date(sub.startDate).getTime();
    const end = new Date(sub.endDate).getTime();
    const now = Date.now();
    if (end > start) {
      progressPercent = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
      daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
    }
  }

  const isActive = sub.status === 'active';
  const isPaused = sub.status === 'paused';
  const isExpired = sub.status === 'expired';
  const isCancelled = sub.status === 'cancelled';

  return (
    <div className="egas-sub-card" style={{ padding: 'var(--sp-5)' }}>
      <div className="egas-sub-card__top" style={{ alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 className="egas-sub-card__title">{sub.planName || 'Subscription'}</h3>
            <StatusBadge status={sub.status} />
          </div>
          <p className="egas-sub-card__meta" style={{ marginTop: 6 }}>
            <span style={{ fontWeight: 600, color: 'var(--egas-text)' }}>{sub.size || '—'}</span>
            <span>· {sub.frequency || '—'}</span>
            {sub.subscriptionPeriod && <span>· {sub.subscriptionPeriod} mo</span>}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onViewDetails}>
          View details
        </Button>
      </div>

      <div className="egas-sub-card__grid" style={{ marginTop: 'var(--sp-4)' }}>
        <Field label="Price" value={naira(sub.price)} />
        <Field label="Start Date" value={formatDate(sub.startDate)} />
        <Field label="End Date" value={endDate ? formatDate(endDate) : '—'} />
      </div>

      {isActive && (
        <div style={{ marginTop: 'var(--sp-2)', display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>
            <span>{daysLeft} days remaining</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--egas-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--egas-success)' }} />
          </div>
        </div>
      )}

      <div className="egas-sub-card__actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 'var(--sp-2)' }}>
        {isActive && (
          <>
            <Button variant="warning" size="sm" leftIcon={<PauseCircle size={14} />} onClick={() => onRequest('pause')} disabled={busy}>
              Pause
            </Button>
            <Button variant="danger" size="sm" leftIcon={<XCircle size={14} />} onClick={() => onRequest('cancel')} disabled={busy}>
              Cancel
            </Button>
          </>
        )}
        {isPaused && (
          <>
            <Button variant="primary" size="sm" leftIcon={<PlayCircle size={14} />} onClick={() => onRequest('resume')} disabled={busy}>
              Resume
            </Button>
            <Button variant="danger" size="sm" leftIcon={<XCircle size={14} />} onClick={() => onRequest('cancel')} disabled={busy}>
              Cancel
            </Button>
          </>
        )}
        {(isExpired || isCancelled) && (
          <Button variant="primary" size="sm" leftIcon={<RotateCw size={14} />} onClick={() => onRequest('renew')} disabled={busy}>
            Renew Subscription
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SUBSCRIPTION DETAILS MODAL
   ============================================================ */
function SubscriptionDetailsModal({ sub, onClose }) {
  if (!sub) return null;

  const start = new Date(sub.startDate);
  const end = new Date(sub.endDate);
  const now = new Date();
  
  const totalDays = Math.ceil((end - start) / 86400000);
  const elapsedDays = Math.max(0, Math.ceil((now - start) / 86400000));
  const remainingDays = Math.max(0, Math.ceil((end - now) / 86400000));

  return (
    <Modal
      open={!!sub}
      onClose={onClose}
      title="Subscription Details"
      size="md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
        
        {/* Header Card */}
        <div style={{ 
          padding: 'var(--sp-5)', 
          background: 'linear-gradient(135deg, var(--egas-primary-light), var(--egas-surface))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--egas-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-xl)', fontWeight: 700, color: 'var(--egas-text)' }}>
                {sub.planName || 'Subscription'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 'var(--fs-sm)', color: 'var(--egas-text-secondary)' }}>
                {sub.size} · {sub.frequency}
              </p>
            </div>
            <StatusBadge status={sub.status} />
          </div>
          <div style={{ marginTop: 'var(--sp-4)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--egas-primary)', letterSpacing: '-0.02em' }}>
              {naira(sub.price)}
            </span>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--egas-text-secondary)' }}>
              total paid
            </span>
          </div>
        </div>

        {/* Timeline / Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Start Date</p>
            <p style={{ margin: 0, fontSize: 'var(--fs-base)', fontWeight: 500 }}>{formatDate(sub.startDate)}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>End Date</p>
            <p style={{ margin: 0, fontSize: 'var(--fs-base)', fontWeight: 500 }}>{formatDate(sub.endDate)}</p>
          </div>
        </div>

        {/* Duration Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 'var(--sp-2)', 
          background: 'var(--egas-bg)', 
          padding: 'var(--sp-4)', 
          borderRadius: 'var(--radius-md)' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{totalDays}</p>
            <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>Total Days</p>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--egas-border)', borderRight: '1px solid var(--egas-border)' }}>
            <p style={{ margin: 0, fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{elapsedDays}</p>
            <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>Elapsed</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'var(--fs-lg)', fontWeight: 700, color: remainingDays > 0 ? 'var(--egas-success)' : 'var(--egas-text-muted)' }}>
              {remainingDays}
            </p>
            <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>Remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', marginBottom: 4 }}>
            <span>Progress</span>
            <span>{Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)))}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--egas-border)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--egas-primary), var(--egas-accent))',
              borderRadius: 999
            }} />
          </div>
        </div>

        {/* Plan details */}
        <div style={{ padding: 'var(--sp-4)', border: '1px solid var(--egas-border)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: '0 0 var(--sp-3) 0', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Plan Information</p>
          <div style={{ display: 'grid', gap: 'var(--sp-2)' }}>
            <DetailRow label="Cylinder Size" value={sub.size || '—'} />
            <DetailRow label="Delivery Frequency" value={sub.frequency || '—'} />
            <DetailRow label="Subscription Period" value={`${sub.subscriptionPeriod} Month(s)`} />
            {sub.paymentMethod && <DetailRow label="Payment Method" value={sub.paymentMethod.toUpperCase()} />}
            {sub.reference && <DetailRow label="Reference" value={<span style={{ fontFamily: 'monospace', fontSize: 'var(--fs-xs)' }}>{sub.reference}</span>} />}
          </div>
        </div>

      </div>
    </Modal>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
      <span style={{ color: 'var(--egas-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right' }}>{value}</span>
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