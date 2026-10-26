// import React, { useEffect, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { Truck, RefreshCw, ChevronRight, CalendarDays } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import PageHeader from '../../components/ui/PageHeader';
// import EmptyState from '../../components/ui/EmptyState';
// import ErrorState from '../../components/ui/ErrorState';
// import StatusBadge from '../../components/ui/StatusBadge';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import { formatDate, unwrap } from './apiHelpers';

// const TABS = [
//   { key: 'upcoming', label: 'Upcoming' },
//   { key: 'delivered', label: 'Delivered' },
//   { key: 'overdue', label: 'Overdue' },
// ];

// export default function DeliverySchedulePage() {
//   const [tab, setTab] = useState('upcoming');
//   const [state, setState] = useState({ status: 'loading', data: [], counts: {}, pagination: null });

//   const load = useCallback(async (nextTab = tab) => {
//     setState((s) => ({ ...s, status: 'loading' }));
//     try {
//       const res = await ApiService.delivery?.getMyDeliveries?.({ tab: nextTab });
//       const body = res?.data ?? {};
//       const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
//       setState({
//         status: 'success',
//         data,
//         counts: body.counts || {},
//         pagination: body.pagination || null,
//       });
//     } catch (err) {
//       setState({ status: 'error', data: [], counts: {}, pagination: null, error: err });
//     }
//   }, [tab]);

//   useEffect(() => { load(tab); /* eslint-disable-line */ }, [tab]);

//   const grouped = groupByDate(state.data);

//   return (
//     <>
//       <PageHeader
//         title="Delivery Schedule"
//         subtitle="Your upcoming, delivered, and overdue deliveries."
//         actions={
//           <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
//             onClick={() => load(tab)} disabled={state.status === 'loading'}>
//             Refresh
//           </Button>
//         }
//       />

//       <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="Delivery filter">
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
//             {state.counts?.[t.key] != null && (
//               <span className="egas-tab__count">{state.counts[t.key]}</span>
//             )}
//           </button>
//         ))}
//       </div>

//       <div style={{ marginTop: 'var(--sp-5)' }}>
//         {state.status === 'loading' && (
//           <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
//         )}

//         {state.status === 'error' && (
//           <ErrorState
//             title="We couldn't load your schedule"
//             description="Please check your connection and try again."
//             onRetry={() => load(tab)}
//           />
//         )}

//         {state.status === 'success' && state.data.length === 0 && (
//           <EmptyState
//             icon={<CalendarDays size={26} />}
//             title={
//               tab === 'upcoming' ? 'No upcoming deliveries'
//               : tab === 'delivered' ? 'No delivered deliveries yet'
//               : 'Nothing is overdue'
//             }
//             description={
//               tab === 'upcoming'
//                 ? 'Place an order or start a subscription to schedule a delivery.'
//                 : tab === 'delivered'
//                   ? 'Your completed deliveries will show here.'
//                   : 'Great — you have no overdue deliveries.'
//             }
//             actionLabel={tab === 'upcoming' ? 'Order Gas' : undefined}
//             actionHref={tab === 'upcoming' ? '/dashboard/order' : undefined}
//           />
//         )}

//         {state.status === 'success' && state.data.length > 0 && (
//           <div>
//             {grouped.map(({ key, label, items }) => (
//               <section key={key} className="egas-agenda-day">
//                 <div className="egas-agenda-day__label">{label}</div>
//                 {items.map((d) => <DeliveryAgendaItem key={d._id} d={d} />)}
//               </section>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// /* ---------- Subcomponents ---------- */
// function DeliveryAgendaItem({ d }) {
//   const date = d.deliveryDate ? new Date(d.deliveryDate) : null;
//   const day = date ? date.getDate().toString().padStart(2, '0') : '--';
//   const month = date ? date.toLocaleDateString('en-NG', { month: 'short' }) : '—';
//   const planName = d.planDetails?.planName || d.planName || 'Delivery';
//   const size = d.planDetails?.size || d.size;
//   const isDelivered = d.status === 'delivered';
//   const isOverdue = d.status !== 'delivered' && date && date < new Date(new Date().toDateString());

//   const to = isDelivered ? `/dashboard/orders` : `/dashboard/orders/${d._id}/track`;

//   return (
//     <Link to={to} className="egas-agenda-item">
//       <div className="egas-agenda-item__time">
//         <span className="egas-agenda-item__time-day">{day}</span>
//         <span className="egas-agenda-item__time-month">{month}</span>
//       </div>
//       <div className="egas-agenda-item__body">
//         <p className="egas-agenda-item__title">
//           {planName} {size && <span style={{ color: 'var(--egas-text-secondary)', fontWeight: 500 }}>· {size}</span>}
//         </p>
//         <div className="egas-agenda-item__meta">
//           <span>{d.deliveryDate ? formatDate(d.deliveryDate, { withTime: true }) : '—'}</span>
//           {d.address && <span>· {d.address}</span>}
//         </div>
//       </div>
//       <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
//         {isOverdue && d.status !== 'cancelled' && d.status !== 'failed' && (
//           <StatusBadge tone="warning">Overdue</StatusBadge>
//         )}
//         <StatusBadge status={d.status} />
//         <ChevronRight size={16} style={{ color: 'var(--egas-text-muted)' }} />
//       </div>
//     </Link>
//   );
// }

// /* ---------- Helpers ---------- */
// function groupByDate(items) {
//   const map = new Map();
//   items.forEach((d) => {
//     const dt = d.deliveryDate ? new Date(d.deliveryDate) : null;
//     const key = dt ? dt.toISOString().slice(0, 10) : 'unknown';
//     if (!map.has(key)) {
//       map.set(key, {
//         key,
//         label: dt
//           ? dt.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })
//           : 'Unscheduled',
//         items: [],
//       });
//     }
//     map.get(key).items.push(d);
//   });
//   return Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : 1));
// }


























// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//   RefreshCw, ChevronRight, CalendarDays, 
//   MapPin, Package, Clock, User, Phone, 
//   Hash, Loader2
// } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import Button from '../../components/ui/Button';
// import PageHeader from '../../components/ui/PageHeader';
// import EmptyState from '../../components/ui/EmptyState';
// import ErrorState from '../../components/ui/ErrorState';
// import StatusBadge from '../../components/ui/StatusBadge';
// import Modal from '../../components/ui/Modal';
// import OrderTimeline from '../../components/orders/OrderTimeline';
// import { SkeletonCard, SkeletonText } from '../../components/ui/Skeleton';
// import { formatDate, unwrap, deliveryStatusLabel } from './apiHelpers';

// const TABS = [
//   { key: 'upcoming', label: 'Upcoming' },
//   { key: 'delivered', label: 'Delivered' },
//   { key: 'overdue', label: 'Overdue' },
// ];

// export default function DeliverySchedulePage() {
//   const [tab, setTab] = useState('upcoming');
//   const [state, setState] = useState({ status: 'loading', data: [], counts: {}, pagination: null });
  
//   // Modal state
//   const [selectedId, setSelectedId] = useState(null);

//   const load = useCallback(async (nextTab = tab) => {
//     setState((s) => ({ ...s, status: 'loading' }));
//     try {
//       const res = await ApiService.delivery?.getMyDeliveries?.({ tab: nextTab });
//       const body = res?.data ?? {};
//       const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
//       setState({
//         status: 'success',
//         data,
//         counts: body.counts || {},
//         pagination: body.pagination || null,
//       });
//     } catch (err) {
//       setState({ status: 'error', data: [], counts: {}, pagination: null, error: err });
//     }
//   }, [tab]);

//   useEffect(() => { load(tab); /* eslint-disable-line */ }, [tab]);

//   const grouped = groupByDate(state.data);

//   return (
//     <>
//       <PageHeader
//         title="Delivery Schedule"
//         subtitle="Your upcoming, delivered, and overdue deliveries."
//         actions={
//           <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
//             onClick={() => load(tab)} disabled={state.status === 'loading'}>
//             Refresh
//           </Button>
//         }
//       />

//       <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="Delivery filter">
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
//             {state.counts?.[t.key] != null && (
//               <span className="egas-tab__count">{state.counts[t.key]}</span>
//             )}
//           </button>
//         ))}
//       </div>

//       <div style={{ marginTop: 'var(--sp-5)' }}>
//         {state.status === 'loading' && (
//           <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
//         )}

//         {state.status === 'error' && (
//           <ErrorState
//             title="We couldn't load your schedule"
//             description="Please check your connection and try again."
//             onRetry={() => load(tab)}
//           />
//         )}

//         {state.status === 'success' && state.data.length === 0 && (
//           <EmptyState
//             icon={<CalendarDays size={26} />}
//             title={
//               tab === 'upcoming' ? 'No upcoming deliveries'
//               : tab === 'delivered' ? 'No delivered deliveries yet'
//               : 'Nothing is overdue'
//             }
//             description={
//               tab === 'upcoming'
//                 ? 'Place an order or start a subscription to schedule a delivery.'
//                 : tab === 'delivered'
//                   ? 'Your completed deliveries will show here.'
//                   : 'Great — you have no overdue deliveries.'
//             }
//             actionLabel={tab === 'upcoming' ? 'Order Gas' : undefined}
//             actionHref={tab === 'upcoming' ? '/dashboard/order' : undefined}
//           />
//         )}

//         {state.status === 'success' && state.data.length > 0 && (
//           <div>
//             {grouped.map(({ key, label, items }) => (
//               <section key={key} className="egas-agenda-day">
//                 <div className="egas-agenda-day__label">{label}</div>
//                 {items.map((d) => (
//                   <DeliveryAgendaItem 
//                     key={d._id} 
//                     d={d} 
//                     onClick={() => setSelectedId(d._id)} 
//                   />
//                 ))}
//               </section>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Delivery Details Modal */}
//       <DeliveryDetailsModal 
//         deliveryId={selectedId} 
//         onClose={() => setSelectedId(null)} 
//       />
//     </>
//   );
// }

// /* ============================================================
//    AGENDA ITEM COMPONENT
//    ============================================================ */
// function DeliveryAgendaItem({ d, onClick }) {
//   const date = d.deliveryDate ? new Date(d.deliveryDate) : null;
//   const day = date ? date.getDate().toString().padStart(2, '0') : '--';
//   const month = date ? date.toLocaleDateString('en-NG', { month: 'short' }) : '—';
  
//   // The list DTO returns `planName` and `size` directly, not nested under planDetails
//   const planName = d.planName || 'LPG Delivery';
//   const size = d.size;
  
//   const isDelivered = d.status === 'delivered';
//   const isFailed = d.status === 'failed' || d.status === 'cancelled';
//   const isOverdue = !isDelivered && !isFailed && date && date < new Date(new Date().toDateString());

//   return (
//     <button 
//       onClick={onClick} 
//       className="egas-agenda-item" 
//       style={{ width: '100%', textAlign: 'left', border: '1px solid var(--egas-border)' }}
//     >
//       <div className={`egas-agenda-item__time ${isDelivered ? 'is-delivered' : isFailed ? 'is-failed' : isOverdue ? 'is-overdue' : 'is-upcoming'}`}>
//         <span className="egas-agenda-item__time-day">{day}</span>
//         <span className="egas-agenda-item__time-month">{month}</span>
//       </div>
      
//       <div className="egas-agenda-item__body">
//         <p className="egas-agenda-item__title">
//           {planName} {size && <span style={{ color: 'var(--egas-text-secondary)', fontWeight: 500 }}>· {size}</span>}
//         </p>
//         <div className="egas-agenda-item__meta">
//           <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//             <Clock size={12} /> {d.deliveryDate ? formatDate(d.deliveryDate, { withTime: true }) : '—'}
//           </span>
//           {d.address && (
//             <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//               <MapPin size={12} /> {d.address}
//             </span>
//           )}
//         </div>
//       </div>

//       <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', paddingRight: 'var(--sp-2)' }}>
//         {isOverdue && (
//           <StatusBadge tone="warning">Overdue</StatusBadge>
//         )}
//         <StatusBadge status={d.status} />
//         <ChevronRight size={16} style={{ color: 'var(--egas-text-muted)', marginLeft: 'var(--sp-2)' }} />
//       </div>
//     </button>
//   );
// }

// /* ============================================================
//    DELIVERY DETAILS MODAL (Fetches from dedicated endpoint)
//    ============================================================ */
// function DeliveryDetailsModal({ deliveryId, onClose }) {
//   const [state, setState] = useState({ status: 'idle', data: null, error: '' });

//   useEffect(() => {
//     if (!deliveryId) {
//       setState({ status: 'idle', data: null, error: '' });
//       return;
//     }

//     let alive = true;
//     setState({ status: 'loading', data: null, error: '' });

//     (async () => {
//       try {
//         const res = await ApiService.delivery?.getById?.(deliveryId);
//         if (!alive) return;
        
//         const body = res?.data ?? {};
//         if (body.success === false) throw new Error(body.message || 'Failed to load.');
        
//         setState({ status: 'success', data: unwrap(res), error: '' });
//       } catch (err) {
//         if (!alive) return;
//         setState({
//           status: 'error',
//           data: null,
//           error: err?.response?.data?.message || err?.message || 'Could not load details.',
//         });
//       }
//     })();

//     return () => { alive = false; };
//   }, [deliveryId]);

//   if (!deliveryId) return null;

//   const d = state.data;

//   // Map the backend `customerDeliveryTimeline` to our OrderTimeline component shape
//   const timelineSteps = (d?.timeline || []).map((t, i, arr) => {
//     // If it's the last event, mark it active if not failed/delivered, else done
//     const isLast = i === arr.length - 1;
//     const isFailed = t.step === 'failed';
    
//     return {
//       key: t.step,
//       label: t.label,
//       at: t.at,
//       state: isFailed ? 'failed' : isLast && d?.status !== 'delivered' ? 'active' : 'done',
//     };
//   });

//   return (
//     <Modal
//       open={!!deliveryId}
//       onClose={onClose}
//       title="Delivery Details"
//       size="md"
//       footer={
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//       }
//     >
//       {state.status === 'loading' && (
//         <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
//           <SkeletonCard />
//           <SkeletonText lines={4} />
//         </div>
//       )}

//       {state.status === 'error' && (
//         <div className="egas-auth-error" role="alert">
//           {state.error}
//         </div>
//       )}

//       {state.status === 'success' && d && (
//         <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
          
//           {/* Status Banner */}
//           <div style={{ 
//             display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
//             padding: 'var(--sp-4)', 
//             background: 'var(--egas-bg)', 
//             borderRadius: 'var(--radius-md)' 
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
//               <div style={{ 
//                 width: 44, height: 44, borderRadius: '50%', background: '#fff', 
//                 display: 'grid', placeItems: 'center', color: 'var(--egas-primary)',
//                 boxShadow: 'var(--shadow-sm)'
//               }}>
//                 <Package size={22} />
//               </div>
//               <div>
//                 <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
//                   Current Status
//                 </p>
//                 <p style={{ margin: 0, fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--egas-text)' }}>
//                   {deliveryStatusLabel(d.status)}
//                 </p>
//               </div>
//             </div>
//             <StatusBadge status={d.status} />
//           </div>

//           {/* Delivery Info Grid */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
//             <DetailBlock icon={<CalendarDays size={16} />} label="Scheduled Date">
//               {d.deliveryDate ? formatDate(d.deliveryDate, { withTime: true }) : '—'}
//             </DetailBlock>
            
//             <DetailBlock icon={<Hash size={16} />} label="Reference">
//               <span style={{ fontFamily: 'monospace' }}>
//                 {String(d._id || '').slice(-8).toUpperCase() || '—'}
//               </span>
//             </DetailBlock>

//             <DetailBlock icon={<Package size={16} />} label="Product">
//               {d.planDetails?.planName || 'LPG Delivery'} {d.planDetails?.size && `(${d.planDetails.size})`}
//               {d.subscription?.frequency && (
//                 <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', marginTop: 2 }}>
//                   {d.subscription.frequency}
//                 </div>
//               )}
//             </DetailBlock>

//             <DetailBlock icon={<MapPin size={16} />} label="Delivery Address">
//               {d.address || 'No address provided'}
//             </DetailBlock>
//           </div>

//           {/* Agent Details (if available) */}
//           {d.deliveryAgent && (
//             <div style={{ padding: 'var(--sp-4)', border: '1px solid var(--egas-border)', borderRadius: 'var(--radius-md)' }}>
//               <p style={{ margin: '0 0 var(--sp-3) 0', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Delivery Agent</p>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
//                 <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--egas-primary-light)', display: 'grid', placeItems: 'center', color: 'var(--egas-primary)' }}>
//                   <User size={18} />
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--fs-sm)' }}>
//                     {d.deliveryAgent.firstName} {d.deliveryAgent.lastName}
//                   </p>
//                   {d.deliveryAgent.phone && (
//                     <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>
//                       {d.deliveryAgent.phone}
//                     </p>
//                   )}
//                 </div>
//                 {d.deliveryAgent.phone && (
//                   <a href={`tel:${d.deliveryAgent.phone}`} className="egas-btn egas-btn--secondary egas-btn--sm">
//                     <Phone size={14} /> Call
//                   </a>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Timeline (mapped from backend) */}
//           {timelineSteps.length > 0 && (
//             <div>
//               <p style={{ margin: '0 0 var(--sp-3) 0', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Progress Timeline</p>
//               <OrderTimeline steps={timelineSteps} />
//             </div>
//           )}
//         </div>
//       )}
//     </Modal>
//   );
// }

// function DetailBlock({ icon, label, children }) {
//   return (
//     <div>
//       <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
//         {icon} {label}
//       </p>
//       <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--egas-text)', fontWeight: 500, lineHeight: 1.4 }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ---------- Helpers ---------- */
// function groupByDate(items) {
//   const map = new Map();
//   items.forEach((d) => {
//     const dt = d.deliveryDate ? new Date(d.deliveryDate) : null;
//     const key = dt ? dt.toISOString().slice(0, 10) : 'unknown';
//     if (!map.has(key)) {
//       map.set(key, {
//         key,
//         label: dt
//           ? dt.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })
//           : 'Unscheduled',
//         items: [],
//       });
//     }
//     map.get(key).items.push(d);
//   });
//   return Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : 1));
// }
























import React, { useEffect, useState, useCallback } from 'react';
import { 
  RefreshCw, ChevronRight, CalendarDays, ChevronLeft,
  MapPin, Package, Clock, User, Phone, 
  Hash, Truck, CheckCircle2, AlertTriangle
} from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import OrderTimeline from '../../components/orders/OrderTimeline';
import { SkeletonCard, SkeletonText } from '../../components/ui/Skeleton';
import { formatDate, unwrap, deliveryStatusLabel } from './apiHelpers';

// Tab config with semantic colors
const TABS = [
  { key: 'upcoming',  label: 'Upcoming',  color: 'var(--egas-primary)',  icon: Truck },
  { key: 'delivered', label: 'Delivered', color: 'var(--egas-success)',  icon: CheckCircle2 },
  { key: 'overdue',   label: 'Overdue',   color: 'var(--egas-warning)',  icon: AlertTriangle },
];

const PAGE_SIZE = 10;

export default function DeliverySchedulePage() {
  const [tab, setTab] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ status: 'loading', data: [], counts: {}, pagination: null });
  
  // Modal state
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async (nextTab = tab, nextPage = page) => {
    setState((s) => ({ ...s, status: 'loading' }));
    try {
      const res = await ApiService.delivery?.getMyDeliveries?.({ 
        tab: nextTab,
        page: nextPage,
        limit: PAGE_SIZE
      });
      
      const body = res?.data ?? {};
      const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
      
      // Safely parse pagination
      const rawPagination = body.pagination || null;
      const pagination = rawPagination ? {
        ...rawPagination,
        page: Number(rawPagination.page) || nextPage,
        pages: Number(rawPagination.pages) || 1,
        total: Number(rawPagination.total) || data.length,
      } : null;

      setState({
        status: 'success',
        data,
        counts: body.counts || {},
        pagination,
      });
    } catch (err) {
      setState({ status: 'error', data: [], counts: {}, pagination: null, error: err });
    }
  }, [tab, page]);

  // Reload when tab or page changes
  useEffect(() => { load(tab, page); /* eslint-disable-line */ }, [tab, page]);

  const switchTab = (key) => {
    if (key === tab) return;
    setTab(key);
    setPage(1); // Reset to page 1 on tab switch
  };

  const grouped = groupByDate(state.data);

  return (
    <>
      <PageHeader
        title="Delivery Schedule"
        subtitle="Your upcoming, delivered, and overdue deliveries."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={() => load(tab, page)} disabled={state.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      {/* Colorful Tabs */}
      <div className="egas-tabs" role="tablist" aria-label="Delivery filter" style={{ borderBottom: '1px solid var(--egas-border)', paddingBottom: '2px' }}>
        {TABS.map((t) => {
          const isActive = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              className={`egas-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => switchTab(t.key)}
              type="button"
              style={{
                borderBottom: isActive ? `3px solid ${t.color}` : '3px solid transparent',
                color: isActive ? t.color : undefined,
                fontWeight: isActive ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Icon size={14} />
              {t.label}
              {state.counts?.[t.key] != null && (
                <span 
                  className="egas-tab__count" 
                  style={{ 
                    background: isActive ? `${t.color}20` : undefined,
                    color: isActive ? t.color : undefined
                  }}
                >
                  {state.counts[t.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {state.status === 'loading' && (
          <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load your schedule"
            description="Please check your connection and try again."
            onRetry={() => load(tab, page)}
          />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <EmptyState
            icon={<CalendarDays size={26} />}
            title={
              tab === 'upcoming' ? 'No upcoming deliveries'
              : tab === 'delivered' ? 'No delivered deliveries yet'
              : 'Nothing is overdue'
            }
            description={
              tab === 'upcoming'
                ? 'Place an order or start a subscription to schedule a delivery.'
                : tab === 'delivered'
                  ? 'Your completed deliveries will show here.'
                  : 'Great — you have no overdue deliveries.'
            }
            actionLabel={tab === 'upcoming' ? 'Order Gas' : undefined}
            actionHref={tab === 'upcoming' ? '/dashboard/order' : undefined}
          />
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <>
            <div>
              {grouped.map(({ key, label, items }) => (
                <section key={key} className="egas-agenda-day">
                  <div className="egas-agenda-day__label">{label}</div>
                  {items.map((d) => (
                    <DeliveryAgendaItem 
                      key={d._id} 
                      d={d} 
                      onClick={() => setSelectedId(d._id)} 
                    />
                  ))}
                </section>
              ))}
            </div>

            {/* Pagination */}
            {state.pagination && (
              <DeliveryPagination
                page={state.pagination.page}
                pages={state.pagination.pages}
                total={state.pagination.total}
                limit={PAGE_SIZE}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Delivery Details Modal */}
      <DeliveryDetailsModal 
        deliveryId={selectedId} 
        onClose={() => setSelectedId(null)} 
      />
    </>
  );
}

/* ============================================================
   AGENDA ITEM COMPONENT
   ============================================================ */
function DeliveryAgendaItem({ d, onClick }) {
  const date = d.deliveryDate ? new Date(d.deliveryDate) : null;
  const day = date ? date.getDate().toString().padStart(2, '0') : '--';
  const month = date ? date.toLocaleDateString('en-NG', { month: 'short' }) : '—';
  
  const planName = d.planName || 'LPG Delivery';
  const size = d.size;
  
  const isDelivered = d.status === 'delivered';
  const isFailed = d.status === 'failed' || d.status === 'cancelled';
  const isOverdue = !isDelivered && !isFailed && date && date < new Date(new Date().toDateString());

  // Determine time-badge coloring
  let timeBg = 'var(--egas-primary-light)';
  let timeColor = 'var(--egas-primary)';
  if (isDelivered) {
    timeBg = 'var(--egas-success-soft)';
    timeColor = 'var(--egas-success)';
  } else if (isFailed) {
    timeBg = 'var(--egas-error-soft)';
    timeColor = 'var(--egas-error)';
  } else if (isOverdue) {
    timeBg = 'var(--egas-warning-soft)';
    timeColor = 'var(--egas-warning)';
  }

  return (
    <button 
      onClick={onClick} 
      className="egas-agenda-item" 
      style={{ width: '100%', textAlign: 'left', border: '1px solid var(--egas-border)' }}
    >
      <div 
        className="egas-agenda-item__time"
        style={{ background: timeBg, color: timeColor, borderRadius: 'var(--radius-md)', padding: '8px' }}
      >
        <span className="egas-agenda-item__time-day" style={{ color: 'inherit' }}>{day}</span>
        <span className="egas-agenda-item__time-month" style={{ color: 'inherit', opacity: 0.8 }}>{month}</span>
      </div>
      
      <div className="egas-agenda-item__body">
        <p className="egas-agenda-item__title">
          {planName} {size && <span style={{ color: 'var(--egas-text-secondary)', fontWeight: 500 }}>· {size}</span>}
        </p>
        <div className="egas-agenda-item__meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {d.deliveryDate ? formatDate(d.deliveryDate, { withTime: true }) : '—'}
          </span>
          {d.address && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> {d.address}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', paddingRight: 'var(--sp-2)' }}>
        {isOverdue && (
          <span style={{
            background: 'var(--egas-warning-soft)', color: 'var(--egas-warning)',
            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase'
          }}>
            Overdue
          </span>
        )}
        <StatusBadge status={d.status} />
        <ChevronRight size={16} style={{ color: 'var(--egas-text-muted)', marginLeft: 'var(--sp-2)' }} />
      </div>
    </button>
  );
}

/* ============================================================
   DELIVERY DETAILS MODAL
   ============================================================ */
function DeliveryDetailsModal({ deliveryId, onClose }) {
  const [state, setState] = useState({ status: 'idle', data: null, error: '' });

  useEffect(() => {
    if (!deliveryId) {
      setState({ status: 'idle', data: null, error: '' });
      return;
    }

    let alive = true;
    setState({ status: 'loading', data: null, error: '' });

    (async () => {
      try {
        const res = await ApiService.delivery?.getById?.(deliveryId);
        if (!alive) return;
        
        const body = res?.data ?? {};
        if (body.success === false) throw new Error(body.message || 'Failed to load.');
        
        setState({ status: 'success', data: unwrap(res), error: '' });
      } catch (err) {
        if (!alive) return;
        setState({
          status: 'error',
          data: null,
          error: err?.response?.data?.message || err?.message || 'Could not load details.',
        });
      }
    })();

    return () => { alive = false; };
  }, [deliveryId]);

  if (!deliveryId) return null;

  const d = state.data;

  const timelineSteps = (d?.timeline || []).map((t, i, arr) => {
    const isLast = i === arr.length - 1;
    const isFailed = t.step === 'failed';
    return {
      key: t.step,
      label: t.label,
      at: t.at,
      state: isFailed ? 'failed' : isLast && d?.status !== 'delivered' ? 'active' : 'done',
    };
  });

  return (
    <Modal
      open={!!deliveryId}
      onClose={onClose}
      title="Delivery Details"
      size="md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {state.status === 'loading' && (
        <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
          <SkeletonCard />
          <SkeletonText lines={4} />
        </div>
      )}

      {state.status === 'error' && (
        <div className="egas-auth-error" role="alert">
          {state.error}
        </div>
      )}

      {state.status === 'success' && d && (
        <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
          {/* Status Banner */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: 'var(--sp-4)', 
            background: 'var(--egas-bg)', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ 
                width: 44, height: 44, borderRadius: '50%', background: '#fff', 
                display: 'grid', placeItems: 'center', color: 'var(--egas-primary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Package size={22} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Current Status
                </p>
                <p style={{ margin: 0, fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--egas-text)' }}>
                  {deliveryStatusLabel(d.status)}
                </p>
              </div>
            </div>
            <StatusBadge status={d.status} />
          </div>

          {/* Delivery Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <DetailBlock icon={<CalendarDays size={16} />} label="Scheduled Date">
              {d.deliveryDate ? formatDate(d.deliveryDate, { withTime: true }) : '—'}
            </DetailBlock>
            
            <DetailBlock icon={<Hash size={16} />} label="Reference">
              <span style={{ fontFamily: 'monospace' }}>
                {String(d._id || '').slice(-8).toUpperCase() || '—'}
              </span>
            </DetailBlock>

            <DetailBlock icon={<Package size={16} />} label="Product">
              {d.planDetails?.planName || 'LPG Delivery'} {d.planDetails?.size && `(${d.planDetails.size})`}
              {d.subscription?.frequency && (
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)', marginTop: 2 }}>
                  {d.subscription.frequency}
                </div>
              )}
            </DetailBlock>

            <DetailBlock icon={<MapPin size={16} />} label="Delivery Address">
              {d.address || 'No address provided'}
            </DetailBlock>
          </div>

          {d.deliveryAgent && (
            <div style={{ padding: 'var(--sp-4)', border: '1px solid var(--egas-border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 var(--sp-3) 0', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Delivery Agent</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--egas-primary-light)', display: 'grid', placeItems: 'center', color: 'var(--egas-primary)' }}>
                  <User size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--fs-sm)' }}>
                    {d.deliveryAgent.firstName} {d.deliveryAgent.lastName}
                  </p>
                  {d.deliveryAgent.phone && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--egas-text-secondary)' }}>
                      {d.deliveryAgent.phone}
                    </p>
                  )}
                </div>
                {d.deliveryAgent.phone && (
                  <a href={`tel:${d.deliveryAgent.phone}`} className="egas-btn egas-btn--secondary egas-btn--sm">
                    <Phone size={14} /> Call
                  </a>
                )}
              </div>
            </div>
          )}

          {timelineSteps.length > 0 && (
            <div>
              <p style={{ margin: '0 0 var(--sp-3) 0', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Progress Timeline</p>
              <OrderTimeline steps={timelineSteps} />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function DetailBlock({ icon, label, children }) {
  return (
    <div>
      <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-xs)', color: 'var(--egas-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </p>
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--egas-text)', fontWeight: 500, lineHeight: 1.4 }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   PAGINATION COMPONENT
   ============================================================ */
function DeliveryPagination({ page, pages, total, limit, onChange }) {
  const currentPage = Number(page) || 1;
  const totalPages = Math.max(1, Number(pages) || 1);
  const totalRecords = Number(total) || 0;
  
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  const numbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) numbers.push(i);

  return (
    <div style={{ marginTop: 'var(--sp-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)' }}>
      <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--egas-text-secondary)' }}>
        Showing <span style={{ fontWeight: 600, color: 'var(--egas-text)' }}>{startRecord}–{endRecord}</span> of <span style={{ fontWeight: 600, color: 'var(--egas-text)' }}>{totalRecords}</span> deliveries
      </p>

      {totalPages > 1 && (
        <nav className="egas-pagination" aria-label="Pagination">
          <button 
            type="button" 
            className="egas-pagination__btn"
            onClick={() => onChange(currentPage - 1)} 
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} /> <span style={{ marginLeft: 4 }}>Prev</span>
          </button>

          {start > 1 && (
            <>
              <button type="button" className="egas-pagination__btn" onClick={() => onChange(1)}>1</button>
              {start > 2 && <span style={{ color: 'var(--egas-text-muted)', padding: '0 4px' }}>…</span>}
            </>
          )}

          {numbers.map((n) => (
            <button key={n} type="button"
              className={`egas-pagination__btn ${n === currentPage ? 'is-active' : ''}`}
              onClick={() => onChange(n)} 
              aria-current={n === currentPage ? 'page' : undefined}>
              {n}
            </button>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <span style={{ color: 'var(--egas-text-muted)', padding: '0 4px' }}>…</span>}
              <button type="button" className="egas-pagination__btn" onClick={() => onChange(totalPages)}>{totalPages}</button>
            </>
          )}

          <button 
            type="button" 
            className="egas-pagination__btn"
            onClick={() => onChange(currentPage + 1)} 
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <span style={{ marginRight: 4 }}>Next</span> <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */
function groupByDate(items) {
  const map = new Map();
  items.forEach((d) => {
    const dt = d.deliveryDate ? new Date(d.deliveryDate) : null;
    const key = dt ? dt.toISOString().slice(0, 10) : 'unknown';
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: dt
          ? dt.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })
          : 'Unscheduled',
        items: [],
      });
    }
    map.get(key).items.push(d);
  });
  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : 1));
}