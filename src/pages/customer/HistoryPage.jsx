// import React, { useEffect, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { Package, Repeat, CreditCard, RefreshCw, Search, ChevronRight } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import Input from '../../components/ui/Input';
// import PageHeader from '../../components/ui/PageHeader';
// import EmptyState from '../../components/ui/EmptyState';
// import ErrorState from '../../components/ui/ErrorState';
// import StatusBadge from '../../components/ui/StatusBadge';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import { naira, formatDate, unwrap } from './apiHelpers';

// const TABS = [
//   { key: 'orders',        label: 'Orders',        icon: Package },
//   { key: 'subscriptions', label: 'Subscriptions', icon: Repeat },
//   { key: 'payments',      label: 'Payments',      icon: CreditCard },
// ];

// const PAGE_SIZE = 10;

// export default function HistoryPage() {
//   const [tab, setTab] = useState('orders');
//   const [page, setPage] = useState(1);
//   const [q, setQ] = useState('');
//   const [state, setState] = useState({ status: 'loading', data: [], meta: null });

//   const load = useCallback(async (nextTab = tab, nextPage = page, nextQ = q) => {
//     setState({ status: 'loading', data: [], meta: null });
//     try {
//       const fn =
//         nextTab === 'orders' ? ApiService.history?.getOrders
//         : nextTab === 'subscriptions' ? ApiService.history?.getSubscriptions
//         : ApiService.history?.getPayments;

//       if (!fn) throw new Error('History API not available.');

//       const params = { page: nextPage, limit: PAGE_SIZE };
//       if (nextQ.trim()) params.q = nextQ.trim();

//       const res = await fn(params);
//       const body = res?.data ?? {};
//       const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
//       setState({
//         status: 'success',
//         data,
//         meta: {
//           total: body.total ?? data.length,
//           page: body.page ?? nextPage,
//           pages: body.pages ?? 1,
//         },
//       });
//     } catch (err) {
//       setState({ status: 'error', data: [], meta: null, error: err });
//     }
//   }, [tab, page, q]);

//   // Reload when tab or page changes
//   useEffect(() => { load(tab, page, q); /* eslint-disable-line */ }, [tab, page]);
//   // Debounced search
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setPage(1);
//       load(tab, 1, q);
//     }, 350);
//     return () => clearTimeout(t);
//     /* eslint-disable-line */
//   }, [q]);

//   const switchTab = (k) => {
//     if (k === tab) return;
//     setTab(k);
//     setPage(1);
//   };

//   return (
//     <>
//       <PageHeader
//         title="History"
//         subtitle="Every order, subscription, and payment on your account."
//         actions={
//           <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
//             onClick={() => load(tab, page, q)} disabled={state.status === 'loading'}>
//             Refresh
//           </Button>
//         }
//       />

//       <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="History type">
//         {TABS.map(({ key, label, icon: Icon }) => (
//           <button
//             key={key}
//             role="tab"
//             aria-selected={tab === key}
//             className={`egas-tab ${tab === key ? 'is-active' : ''}`}
//             onClick={() => switchTab(key)}
//             type="button"
//           >
//             <Icon size={14} /> {label}
//           </button>
//         ))}
//       </div>

//       <div style={{ marginTop: 'var(--sp-4)' }}>
//         <Input
//           label="Search"
//           placeholder="Search by reference, plan, or amount…"
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           leftIcon={<Search size={14} />}
//         />
//       </div>

//       <div style={{ marginTop: 'var(--sp-5)' }}>
//         {state.status === 'loading' && (
//           <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
//         )}

//         {state.status === 'error' && (
//           <ErrorState
//             title="We couldn't load history"
//             description="Please check your connection and try again."
//             onRetry={() => load(tab, page, q)}
//           />
//         )}

//         {state.status === 'success' && state.data.length === 0 && (
//           <EmptyState
//             title={q ? 'No matches' : `No ${tab} yet`}
//             description={q ? 'Try a different search term.' : 'Once you place activity, it will show here.'}
//           />
//         )}

//         {state.status === 'success' && state.data.length > 0 && (
//           <>
//             <div className="egas-list-stack">
//               {tab === 'orders' && state.data.map((o) => <OrderHistoryCard key={o._id} o={o} />)}
//               {tab === 'subscriptions' && state.data.map((s) => <SubHistoryCard key={s._id} s={s} />)}
//               {tab === 'payments' && state.data.map((p) => <PaymentHistoryCard key={p._id || p.reference} p={p} />)}
//             </div>

//             {state.meta && state.meta.pages > 1 && (
//               <Pagination page={state.meta.page} pages={state.meta.pages} onChange={setPage} />
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// /* ---------- Cards ---------- */
// function OrderHistoryCard({ o }) {
//   return (
//     <Link to={`/dashboard/orders/${o._id}`} className="egas-order-card">
//       <div className="egas-order-card__top">
//         <div style={{ minWidth: 0 }}>
//           <h3 className="egas-order-card__ref">
//             {(o.products || []).map((p) => p.product?.name || p.productName).filter(Boolean).join(', ') || 'Order'}
//           </h3>
//           <p className="egas-order-card__date">
//             #{String(o.orderId || o._id).slice(-8).toUpperCase()} · {formatDate(o.createdAt, { withTime: true })}
//           </p>
//         </div>
//         <StatusBadge status={o.orderStatus || o.paymentStatus} />
//       </div>
//       <div className="egas-order-card__grid">
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Total</span>
//           <span className="egas-order-card__field-value">{naira(o.totalAmount)}</span>
//         </div>
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Payment</span>
//           <span className="egas-order-card__field-value">{o.paymentStatus || '—'}</span>
//         </div>
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Delivery</span>
//           <span className="egas-order-card__field-value">{o.deliveryAddress || '—'}</span>
//         </div>
//       </div>
//       <div className="egas-order-card__cta">
//         <span className="egas-btn egas-btn--ghost egas-btn--sm">
//           View details <ChevronRight size={14} />
//         </span>
//       </div>
//     </Link>
//   );
// }

// function SubHistoryCard({ s }) {
//   return (
//     <div className="egas-sub-card">
//       <div className="egas-sub-card__top">
//         <div style={{ minWidth: 0 }}>
//           <h3 className="egas-sub-card__title">{s.planName || 'Subscription'}</h3>
//           <p className="egas-sub-card__meta">
//             <span>{s.size || '—'}</span>
//             {s.frequency && <span>· {s.frequency}</span>}
//             {s.subscriptionPeriod && <span>· {s.subscriptionPeriod} mo</span>}
//           </p>
//         </div>
//         <StatusBadge status={s.status} />
//       </div>
//       <div className="egas-sub-card__grid">
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Price</span>
//           <span className="egas-order-card__field-value">{naira(s.price)}</span>
//         </div>
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Started</span>
//           <span className="egas-order-card__field-value">{formatDate(s.startDate)}</span>
//         </div>
//         <div className="egas-order-card__field">
//           <span className="egas-order-card__field-label">Ended</span>
//           <span className="egas-order-card__field-value">{s.endDate ? formatDate(s.endDate) : '—'}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PaymentHistoryCard({ p }) {
//   const type = String(p.type || '').toLowerCase();
//   const status = String(p.status || '').toLowerCase();
//   const isCredit = type === 'credit' || type === 'topup' || type === 'refund';
//   const isFailed = ['failed', 'abandoned', 'reversed'].includes(status);

//   return (
//     <Card>
//       <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-3)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontWeight: 'var(--fw-semibold)' }}>{p.description || (isCredit ? 'Wallet credit' : 'Wallet debit')}</div>
//           <div className="egas-text egas-text--sm" style={{ marginTop: 2 }}>
//             {formatDate(p.createdAt, { withTime: true })}
//             {p.reference && ` · Ref ${String(p.reference).slice(-8).toUpperCase()}`}
//           </div>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <div style={{
//             fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)',
//             color: isFailed ? 'var(--egas-error)' : isCredit ? 'var(--egas-success)' : 'var(--egas-text)',
//           }}>
//             {isCredit ? '+' : '−'}{naira(p.amount)}
//           </div>
//           <span className={`egas-badge ${isFailed ? 'egas-badge--error' : status === 'completed' || status === 'success' ? 'egas-badge--success' : 'egas-badge--warning'}`}>
//             {status || 'pending'}
//           </span>
//         </div>
//       </div>
//     </Card>
//   );
// }

// function Pagination({ page, pages, onChange }) {
//   const numbers = [];
//   const max = 5;
//   let start = Math.max(1, page - Math.floor(max / 2));
//   let end = Math.min(pages, start + max - 1);
//   if (end - start + 1 < max) start = Math.max(1, end - max + 1);
//   for (let i = start; i <= end; i++) numbers.push(i);

//   return (
//     <nav className="egas-pagination" aria-label="Pagination">
//       <button type="button" className="egas-pagination__btn"
//         onClick={() => onChange(page - 1)} disabled={page <= 1}>Prev</button>
//       {numbers.map((n) => (
//         <button key={n} type="button"
//           className={`egas-pagination__btn ${n === page ? 'is-active' : ''}`}
//           onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}>
//           {n}
//         </button>
//       ))}
//       <button type="button" className="egas-pagination__btn"
//         onClick={() => onChange(page + 1)} disabled={page >= pages}>Next</button>
//     </nav>
//   );
// }
























import React, { useEffect, useState, useCallback } from 'react';
import { 
  Package, Zap, Repeat, CreditCard, RefreshCw, Search, 
  FileText, ArrowDownLeft, ArrowUpRight, XCircle, ShoppingBag, ChevronLeft, ChevronRight
} from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import StatusBadge from '../../components/ui/StatusBadge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrap } from './apiHelpers';

const TABS = [
  { key: 'purchases',     label: 'Purchases',     icon: ShoppingBag },
  { key: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { key: 'payments',      label: 'Payments',      icon: CreditCard },
];

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [tab, setTab] = useState('purchases');
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [state, setState] = useState({ status: 'loading', data: [], meta: null });

  const load = useCallback(async (nextTab = tab, nextPage = page, nextQ = q) => {
    setState({ status: 'loading', data: [], meta: null });
    try {
      const fn =
        nextTab === 'purchases' ? ApiService.history?.getPurchases
        : nextTab === 'subscriptions' ? ApiService.history?.getSubscriptions
        : ApiService.history?.getPayments;

      if (!fn) throw new Error('History API not available.');

      const params = { page: nextPage, limit: PAGE_SIZE };
      if (nextQ.trim()) params.q = nextQ.trim();

      const res = await fn(params);
      const body = res?.data ?? {};
      const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
      
      // Safe numeric parsing
      setState({
        status: 'success',
        data,
        meta: {
          total: Number(body.total) || data.length,
          page: Number(body.page) || nextPage,
          pages: Number(body.pages) || 1,
        },
      });
    } catch (err) {
      setState({ status: 'error', data: [], meta: null, error: err });
    }
  }, [tab, page, q]);

  // Reload when tab or page changes
  useEffect(() => { load(tab, page, q); /* eslint-disable-line */ }, [tab, page]);
  
  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(tab, 1, q);
    }, 350);
    return () => clearTimeout(t);
    /* eslint-disable-line */
  }, [q]);

  const switchTab = (k) => {
    if (k === tab) return;
    setTab(k);
    setPage(1); // Reset to first page when switching tabs
  };

  return (
    <>
      <PageHeader
        title="History"
        subtitle="Review your past purchases, subscriptions, and wallet payments."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={() => load(tab, page, q)} disabled={state.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      {/* Tabs */}
      <div className="egas-tabs egas-tab-scroll" role="tablist" aria-label="History type">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`egas-tab ${tab === key ? 'is-active' : ''}`}
            onClick={() => switchTab(key)}
            type="button"
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginTop: 'var(--sp-4)', maxWidth: 480 }}>
        <Input
          placeholder={`Search ${tab}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search history"
        />
      </div>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        {state.status === 'loading' && (
          <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="We couldn't load history"
            description="Please check your connection and try again."
            onRetry={() => load(tab, page, q)}
          />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <EmptyState
            title={q ? 'No matches' : `No ${tab} yet`}
            description={
              q 
                ? 'Try a different search term.' 
                : tab === 'purchases' 
                  ? 'Your one-time and emergency orders will appear here.'
                  : tab === 'subscriptions'
                    ? 'Your recurring subscriptions will appear here.'
                    : 'Your wallet transactions will appear here.'
            }
          />
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <>
            <div className="egas-list-stack">
              {tab === 'purchases' && state.data.map((o) => <PurchaseCard key={o._id} order={o} />)}
              {tab === 'subscriptions' && state.data.map((s) => <SubHistoryCard key={s._id} s={s} />)}
              {tab === 'payments' && state.data.map((p) => <PaymentHistoryCard key={p._id || p.reference} p={p} />)}
            </div>

            {/* Pagination - Added to ALL tabs */}
            {state.meta && state.meta.pages > 1 && (
              <HistoryPagination 
                page={state.meta.page} 
                pages={state.meta.pages} 
                total={state.meta.total}
                limit={PAGE_SIZE}
                onChange={setPage} 
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

/* ============================================================
   COMPONENT: PurchaseCard (One-Time / Emergency)
   ============================================================ */
function PurchaseCard({ order }) {
  const isEmergency = order.planType === 'emergency';
  
  const tagColor = isEmergency ? 'var(--egas-warning)' : 'var(--egas-primary)';
  const tagText = isEmergency ? 'Emergency' : 'One-Time';
  const TagIcon = isEmergency ? Zap : Package;

  return (
    <div className="egas-sub-card" style={{ display: 'grid', gap: 'var(--sp-3)' }}>
      <div className="egas-sub-card__top">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 className="egas-sub-card__title">{order.planName || 'LPG Refill'}</h3>
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 4, 
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', 
              color: tagColor, background: `${tagColor}18`, padding: '2px 8px', borderRadius: 4 
            }}>
              <TagIcon size={10} /> {tagText}
            </span>
          </div>
          <p className="egas-sub-card__meta" style={{ marginTop: 4 }}>
            <span>{order.size || '—'}</span>
            {order.frequency && <span>· {order.frequency}</span>}
            {order.subscriptionPeriod && <span>· {order.subscriptionPeriod} mo</span>}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="egas-sub-card__grid">
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Amount</span>
          <span className="egas-order-card__field-value">{naira(order.price)}</span>
        </div>
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Date</span>
          <span className="egas-order-card__field-value">{formatDate(order.createdAt, { withTime: true })}</span>
        </div>
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Reference</span>
          <span className="egas-order-card__field-value" style={{ fontFamily: 'monospace', fontSize: 11 }}>
            {order.reference ? String(order.reference).slice(-8).toUpperCase() : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENT: SubHistoryCard (Recurring Plans)
   ============================================================ */
function SubHistoryCard({ s }) {
  return (
    <div className="egas-sub-card" style={{ display: 'grid', gap: 'var(--sp-3)' }}>
      <div className="egas-sub-card__top">
        <div style={{ minWidth: 0 }}>
          <h3 className="egas-sub-card__title">{s.planName || 'Subscription'}</h3>
          <p className="egas-sub-card__meta">
            <span>{s.size || '—'}</span>
            {s.frequency && <span>· {s.frequency}</span>}
            {s.subscriptionPeriod && <span>· {s.subscriptionPeriod} mo</span>}
          </p>
        </div>
        <StatusBadge status={s.status} />
      </div>
      <div className="egas-sub-card__grid">
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Price</span>
          <span className="egas-order-card__field-value">{naira(s.price)}</span>
        </div>
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Started</span>
          <span className="egas-order-card__field-value">{formatDate(s.startDate)}</span>
        </div>
        <div className="egas-order-card__field">
          <span className="egas-order-card__field-label">Ended</span>
          <span className="egas-order-card__field-value">{s.endDate ? formatDate(s.endDate) : '—'}</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENT: PaymentHistoryCard
   ============================================================ */
function PaymentHistoryCard({ p }) {
  const type = String(p.type || '').toLowerCase();
  const status = String(p.status || '').toLowerCase();
  
  const isCredit = type === 'credit' || type === 'topup' || type === 'refund';
  const isFailed = ['failed', 'abandoned', 'reversed'].includes(status);

  const Icon = isFailed ? XCircle : isCredit ? ArrowDownLeft : ArrowUpRight;
  const color = isFailed ? 'var(--egas-error)' : isCredit ? 'var(--egas-success)' : 'var(--egas-text)';
  const bg = isFailed ? 'var(--egas-error-soft)' : isCredit ? 'var(--egas-success-soft)' : 'var(--egas-bg)';

  return (
    <Card style={{ padding: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, color: color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-base)' }}>
            {p.description || (isCredit ? 'Wallet credit' : 'Wallet debit')}
          </div>
          <div className="egas-text egas-text--sm" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>{formatDate(p.createdAt, { withTime: true })}</span>
            {p.reference && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontFamily: 'monospace' }}>
                <FileText size={10} /> {String(p.reference).slice(-8).toUpperCase()}
              </span>
            )}
            <span className={`egas-badge ${
              isFailed ? 'egas-badge--error' 
              : status === 'completed' || status === 'success' ? 'egas-badge--success' 
              : 'egas-badge--warning'
            }`}>
              {status || 'pending'}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--fs-lg)', color }}>
          {isCredit && !isFailed ? '+' : '−'}{naira(p.amount)}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   COMPONENT: HistoryPagination (Enhanced, Responsive)
   ============================================================ */
function HistoryPagination({ page, pages, total, limit, onChange }) {
  const currentPage = Number(page) || 1;
  const totalPages = Number(pages) || 1;
  const totalRecords = Number(total) || 0;
  
  if (totalPages <= 1) return null;

  // Calculate the range of records being shown (e.g. "Showing 1-10 of 45")
  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  // Responsive window of page numbers
  const numbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) numbers.push(i);

  return (
    <div style={{ marginTop: 'var(--sp-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)' }}>
      {/* Record Count */}
      <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--egas-text-secondary)' }}>
        Showing <span style={{ fontWeight: 600, color: 'var(--egas-text)' }}>{startRecord}–{endRecord}</span> of <span style={{ fontWeight: 600, color: 'var(--egas-text)' }}>{totalRecords}</span> records
      </p>

      {/* Pagination Buttons */}
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
    </div>
  );
}