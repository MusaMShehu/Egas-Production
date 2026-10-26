// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Wallet, Plus, ArrowDownLeft, ArrowUpRight, XCircle,
//   RefreshCw, AlertCircle,
// } from 'lucide-react';
// import ApiService from '../../api/apiService';
// import Button from '../../components/ui/Button';
// import Card from '../../components/ui/Card';
// import Modal from '../../components/ui/Modal';
// import Input from '../../components/ui/Input';
// import PageHeader from '../../components/ui/PageHeader';
// import EmptyState from '../../components/ui/EmptyState';
// import ErrorState from '../../components/ui/ErrorState';
// import { SkeletonCard } from '../../components/ui/Skeleton';
// import { naira, formatDate, unwrap } from './apiHelpers';

// const PAGE_SIZE = 10;

// export default function WalletPage() {
//   const [balanceState, setBalanceState] = useState({ status: 'loading', balance: 0 });
//   const [txState, setTxState] = useState({ status: 'loading', data: [], pagination: null });
//   const [page, setPage] = useState(1);
//   const [topupOpen, setTopupOpen] = useState(false);
//   const [topupAmount, setTopupAmount] = useState('');
//   const [topupError, setTopupError] = useState('');
//   const [topupLoading, setTopupLoading] = useState(false);

//   const loadBalance = useCallback(async () => {
//     setBalanceState((s) => ({ ...s, status: 'loading' }));
//     try {
//       const res = await ApiService.payments?.getWalletBalance?.();
//       const balance = res?.data?.balance ?? unwrap(res)?.balance ?? 0;
//       setBalanceState({ status: 'success', balance });
//     } catch (err) {
//       setBalanceState({ status: 'error', balance: 0, error: err });
//     }
//   }, []);

//   const loadHistory = useCallback(async (p = 1) => {
//     setTxState((s) => ({ ...s, status: 'loading' }));
//     try {
//       const res = await ApiService.payments?.getHistory?.({ page: p, limit: PAGE_SIZE });
//       const body = res?.data ?? {};
//       const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
//       setTxState({ status: 'success', data, pagination: body.pagination || null });
//     } catch (err) {
//       setTxState({ status: 'error', data: [], pagination: null, error: err });
//     }
//   }, []);

//   useEffect(() => { loadBalance(); }, [loadBalance]);
//   useEffect(() => { loadHistory(page); }, [loadHistory, page]);

//   const submitTopup = async (e) => {
//     e.preventDefault();
//     setTopupError('');
//     const amount = Number(topupAmount);
//     if (!Number.isFinite(amount) || amount <= 0) {
//       setTopupError('Enter a valid amount greater than zero.');
//       return;
//     }
//     setTopupLoading(true);
//     try {
//       const res = await ApiService.payments?.initiateTopup?.({ amount });
//       const body = res?.data ?? {};
//       const url = body.authorization_url || unwrap(res)?.authorization_url;
//       if (!url) throw new Error('Payment initialization failed.');
//       window.location.assign(url);
//     } catch (err) {
//       setTopupError(
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         'Could not start top-up. Please try again.'
//       );
//       setTopupLoading(false);
//     }
//   };

//   const refreshAll = () => { loadBalance(); loadHistory(page); };

//   return (
//     <>
//       <PageHeader
//         title="Wallet & Payments"
//         subtitle="Top up your wallet and review every transaction."
//         actions={
//           <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
//             onClick={refreshAll} disabled={balanceState.status === 'loading'}>
//             Refresh
//           </Button>
//         }
//       />

//       {/* Balance hero */}
//       <div className="egas-wallet-hero">
//         <div>
//           <div className="egas-wallet-hero__label">Available balance</div>
//           <div className="egas-wallet-hero__amount">
//             {balanceState.status === 'loading' ? '…' : naira(balanceState.balance)}
//           </div>
//           <div className="egas-wallet-hero__hint">
//             Pay faster at checkout with your e-GAS wallet.
//           </div>
//         </div>
//         <div className="egas-wallet-hero__actions">
//           <Button
//             variant="primary"
//             leftIcon={<Plus size={16} />}
//             onClick={() => { setTopupOpen(true); setTopupError(''); setTopupAmount(''); }}
//           >
//             Fund Wallet
//           </Button>
//           <Button href="/dashboard/order" variant="secondary">
//             Order Gas
//           </Button>
//         </div>
//       </div>

//       {/* Transactions */}
//       <section className="egas-dash-section" aria-labelledby="tx-heading">
//         <div className="egas-dash-section__head">
//           <h2 id="tx-heading" className="egas-dash-section__title">Transaction history</h2>
//         </div>

//         {txState.status === 'loading' && <SkeletonCard />}

//         {txState.status === 'error' && (
//           <ErrorState
//             title="We couldn't load your transactions"
//             description="Please check your connection and try again."
//             onRetry={() => loadHistory(page)}
//           />
//         )}

//         {txState.status === 'success' && txState.data.length === 0 && (
//           <EmptyState
//             icon={<Wallet size={26} />}
//             title="No transactions yet"
//             description="Top up your wallet to see your payment history here."
//             actionLabel="Fund Wallet"
//             onAction={() => { setTopupOpen(true); setTopupError(''); setTopupAmount(''); }}
//           />
//         )}

//         {txState.status === 'success' && txState.data.length > 0 && (
//           <>
//             <Card style={{ padding: 'var(--sp-2) var(--sp-5)' }}>
//               {txState.data.map((tx) => <TxRow key={tx._id || tx.reference} tx={tx} />)}
//             </Card>

//             {txState.pagination && txState.pagination.pages > 1 && (
//               <Pagination
//                 page={txState.pagination.current || page}
//                 pages={txState.pagination.pages}
//                 onChange={setPage}
//               />
//             )}
//           </>
//         )}
//       </section>

//       {/* Top-up modal */}
//       <Modal
//         open={topupOpen}
//         onClose={() => !topupLoading && setTopupOpen(false)}
//         title="Fund your wallet"
//         footer={
//           <>
//             <Button variant="secondary" onClick={() => setTopupOpen(false)} disabled={topupLoading}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={submitTopup} loading={topupLoading}>
//               Continue to Paystack
//             </Button>
//           </>
//         }
//       >
//         <form onSubmit={submitTopup} style={{ display: 'grid', gap: 'var(--sp-4)' }}>
//           <Input
//             label="Amount (₦)"
//             type="number"
//             min="100"
//             step="50"
//             value={topupAmount}
//             onChange={(e) => setTopupAmount(e.target.value)}
//             placeholder="5000"
//             required
//             autoFocus
//           />
//           <div className="egas-chip-row">
//             {[2000, 5000, 10000, 20000].map((a) => (
//               <button key={a} type="button"
//                 className={`egas-chip ${Number(topupAmount) === a ? 'is-selected' : ''}`}
//                 onClick={() => setTopupAmount(String(a))}>
//                 {naira(a)}
//               </button>
//             ))}
//           </div>
//           {topupError && (
//             <div className="egas-auth-error" role="alert">
//               <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
//               <span>{topupError}</span>
//             </div>
//           )}
//           <p className="egas-text--sm" style={{ margin: 0 }}>
//             You&apos;ll be redirected to Paystack to complete the payment securely.
//           </p>
//         </form>
//       </Modal>
//     </>
//   );
// }

// /* ---------- Transaction row ---------- */
// function TxRow({ tx }) {
//   const type = String(tx.type || '').toLowerCase();
//   const status = String(tx.status || '').toLowerCase();

//   // Classify
//   const isCredit = type === 'credit' || type === 'topup' || type === 'refund';
//   const isFailed = status === 'failed' || status === 'abandoned' || status === 'reversed';

//   const icon = isFailed ? <XCircle size={18} />
//     : isCredit ? <ArrowDownLeft size={18} />
//     : <ArrowUpRight size={18} />;

//   const cls = isFailed ? 'is-failed' : isCredit ? 'is-credit' : 'is-debit';

//   const amountCls = isCredit && !isFailed ? 'is-credit' : 'is-debit';
//   const sign = isCredit && !isFailed ? '+' : '−';

//   return (
//     <div className="egas-tx-row">
//       <div className={`egas-tx-row__icon ${cls}`}>{icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <p className="egas-tx-row__title">{tx.description || (isCredit ? 'Wallet credit' : 'Wallet debit')}</p>
//         <div className="egas-tx-row__meta">
//           <span>{formatDate(tx.createdAt, { withTime: true })}</span>
//           {tx.reference && <span>· Ref {String(tx.reference).slice(-8).toUpperCase()}</span>}
//           {status && (
//             <span className={`egas-badge ${isFailed ? 'egas-badge--error' : status === 'completed' || status === 'success' ? 'egas-badge--success' : 'egas-badge--warning'}`}>
//               {status}
//             </span>
//           )}
//         </div>
//       </div>
//       <span className={`egas-tx-row__amount ${amountCls}`}>
//         {sign}{naira(tx.amount)}
//       </span>
//     </div>
//   );
// }

// /* ---------- Pagination ---------- */
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
//         onClick={() => onChange(page - 1)} disabled={page <= 1}>
//         Prev
//       </button>
//       {numbers.map((n) => (
//         <button key={n} type="button"
//           className={`egas-pagination__btn ${n === page ? 'is-active' : ''}`}
//           onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}>
//           {n}
//         </button>
//       ))}
//       <button type="button" className="egas-pagination__btn"
//         onClick={() => onChange(page + 1)} disabled={page >= pages}>
//         Next
//       </button>
//     </nav>
//   );
// }























import React, { useEffect, useState, useCallback } from 'react';
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, XCircle,
  RefreshCw, AlertCircle, FileText
} from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrap } from './apiHelpers';

const PAGE_SIZE = 10;

export default function WalletPage() {
  const [balanceState, setBalanceState] = useState({ status: 'loading', balance: 0 });
  const [txState, setTxState] = useState({ status: 'loading', data: [], pagination: null });
  const [page, setPage] = useState(1);
  
  // Top-up states
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupError, setTopupError] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);

  const loadBalance = useCallback(async () => {
    setBalanceState((s) => ({ ...s, status: 'loading' }));
    try {
      const res = await ApiService.payments?.getWalletBalance?.();
      const balance = res?.data?.balance ?? unwrap(res)?.balance ?? 0;
      setBalanceState({ status: 'success', balance });
    } catch (err) {
      setBalanceState({ status: 'error', balance: 0, error: err });
    }
  }, []);

  const loadHistory = useCallback(async (p = 1) => {
    setTxState((s) => ({ ...s, status: 'loading' }));
    try {
      const res = await ApiService.payments?.getHistory?.({ page: p, limit: PAGE_SIZE });
      const body = res?.data ?? {};
      const data = Array.isArray(body.data) ? body.data : Array.isArray(unwrap(res)) ? unwrap(res) : [];
      
      // Safely parse pagination to ensure it's numbers
      const rawPagination = body.pagination || null;
      const pagination = rawPagination ? {
        ...rawPagination,
        current: Number(rawPagination.current) || p,
        pages: Number(rawPagination.pages) || 1,
      } : null;

      setTxState({ status: 'success', data, pagination });
    } catch (err) {
      setTxState({ status: 'error', data: [], pagination: null, error: err });
    }
  }, []);

  useEffect(() => { loadBalance(); }, [loadBalance]);
  
  // Trigger fetch when page changes
  useEffect(() => { loadHistory(page); }, [loadHistory, page]);

  const submitTopup = async (e) => {
    e.preventDefault();
    setTopupError('');
    // const amount = Number(topupAmount);
    // if (!Number.isFinite(amount) || amount <= 0) {
    //   setTopupError('Enter a valid amount greater than zero.');
    //   return;
    // }
    const rawAmount = String(topupAmount).trim();
const amount = Number(rawAmount);

if (
  rawAmount === '' ||
  !Number.isSafeInteger(amount) ||
  amount <= 0
) {
  setTopupError(
    'Enter a valid whole-number amount greater than zero.'
  );
  return;
}
    setTopupLoading(true);
    try {
      const res = await ApiService.payments?.initiateTopup?.(amount);
      const body = res?.data ?? {};
      const url = body.authorization_url || unwrap(res)?.authorization_url;
      if (!url) throw new Error('Payment initialization failed.');
      window.location.assign(url);
    } catch (err) {
      setTopupError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not start top-up. Please try again.'
      );
      setTopupLoading(false);
    }
  };

  const refreshAll = () => { 
    loadBalance(); 
    loadHistory(page); 
  };

  return (
    <>
      <PageHeader
        title="Wallet & Payments"
        subtitle="Top up your wallet and review every transaction."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={refreshAll} disabled={balanceState.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      {/* Balance hero */}
      <div className="egas-wallet-hero">
        <div>
          <div className="egas-wallet-hero__label">Available balance</div>
          <div className="egas-wallet-hero__amount">
            {balanceState.status === 'loading' ? '…' : naira(balanceState.balance)}
          </div>
          <div className="egas-wallet-hero__hint">
            Pay faster at checkout with your e-GAS wallet.
          </div>
        </div>
        <div className="egas-wallet-hero__actions">
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => { setTopupOpen(true); setTopupError(''); setTopupAmount(''); }}
          >
            Fund Wallet
          </Button>
          <Button href="/dashboard/order" variant="secondary">
            Order Gas
          </Button>
        </div>
      </div>

      {/* Transactions */}
      <section className="egas-dash-section" aria-labelledby="tx-heading" style={{ marginTop: 'var(--sp-6)' }}>
        <div className="egas-dash-section__head">
          <h2 id="tx-heading" className="egas-dash-section__title">Transaction history</h2>
        </div>

        {txState.status === 'loading' && <SkeletonCard />}

        {txState.status === 'error' && (
          <ErrorState
            title="We couldn't load your transactions"
            description="Please check your connection and try again."
            onRetry={() => loadHistory(page)}
          />
        )}

        {txState.status === 'success' && txState.data.length === 0 && (
          <EmptyState
            icon={<Wallet size={26} />}
            title="No transactions yet"
            description="Top up your wallet to see your payment history here."
            actionLabel="Fund Wallet"
            onAction={() => { setTopupOpen(true); setTopupError(''); setTopupAmount(''); }}
          />
        )}

        {txState.status === 'success' && txState.data.length > 0 && (
          <>
            <Card style={{ padding: 'var(--sp-2) var(--sp-5)' }}>
              {txState.data.map((tx) => <TxRow key={tx._id || tx.reference} tx={tx} />)}
            </Card>

            {/* Pagination */}
            {txState.pagination && txState.pagination.pages > 1 && (
              <Pagination
                page={txState.pagination.current || page}
                pages={txState.pagination.pages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </section>

      {/* Top-up modal */}
      <Modal
        open={topupOpen}
        onClose={() => !topupLoading && setTopupOpen(false)}
        title="Fund your wallet"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTopupOpen(false)} disabled={topupLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitTopup} loading={topupLoading}>
              Continue to Paystack
            </Button>
          </>
        }
      >
        <form onSubmit={submitTopup} style={{ display: 'grid', gap: 'var(--sp-4)' }}>
          <Input
            label="Amount (₦)"
            type="number"
            min="100"
            step="50"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            placeholder="5000"
            required
            autoFocus
          />
          <div className="egas-chip-row">
            {[2000, 5000, 10000, 20000].map((a) => (
              <button key={a} type="button"
                className={`egas-chip ${Number(topupAmount) === a ? 'is-selected' : ''}`}
                onClick={() => setTopupAmount(String(a))}>
                {naira(a)}
              </button>
            ))}
          </div>
          {topupError && (
            <div className="egas-auth-error" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{topupError}</span>
            </div>
          )}
          <p className="egas-text--sm" style={{ margin: 0 }}>
            You&apos;ll be redirected to Paystack to complete the payment securely.
          </p>
        </form>
      </Modal>
    </>
  );
}

/* ---------- Transaction row ---------- */
function TxRow({ tx }) {
  const type = String(tx.type || '').toLowerCase();
  const status = String(tx.status || '').toLowerCase();

  // Classify
  const isCredit = type === 'credit' || type === 'topup' || type === 'refund';
  const isFailed = status === 'failed' || status === 'abandoned' || status === 'reversed';
  const isPending = status === 'pending';

  const icon = isFailed ? <XCircle size={18} />
    : isCredit ? <ArrowDownLeft size={18} />
    : <ArrowUpRight size={18} />;

  const cls = isFailed ? 'is-failed' : isPending ? 'is-pending' : isCredit ? 'is-credit' : 'is-debit';
  const amountCls = isCredit && !isFailed ? 'is-credit' : 'is-debit';
  const sign = isCredit && !isFailed ? '+' : '−';

  return (
    <div className="egas-tx-row">
      <div className={`egas-tx-row__icon ${cls}`}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p className="egas-tx-row__title" style={{ margin: '0 0 4px 0' }}>
          {tx.description || (isCredit ? 'Wallet credit' : 'Wallet debit')}
        </p>
        <div className="egas-tx-row__meta">
          <span>{formatDate(tx.createdAt, { withTime: true })}</span>
          {tx.reference && (
            <span style={{ fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <FileText size={10} /> {String(tx.reference).slice(-8).toUpperCase()}
            </span>
          )}
          {status && (
            <span className={`egas-badge ${
              isFailed ? 'egas-badge--error' 
              : status === 'completed' || status === 'success' ? 'egas-badge--success' 
              : 'egas-badge--warning'
            }`}>
              {status}
            </span>
          )}
        </div>
      </div>
      <span className={`egas-tx-row__amount ${amountCls}`} style={{ fontWeight: 700 }}>
        {sign}{naira(tx.amount)}
      </span>
    </div>
  );
}

/* ---------- Pagination ---------- */
function Pagination({ page, pages, onChange }) {
  const currentPage = Number(page) || 1;
  const totalPages = Number(pages) || 1;

  if (totalPages <= 1) return null;

  const numbers = [];
  const max = 5;
  let start = Math.max(1, currentPage - Math.floor(max / 2));
  let end = Math.min(totalPages, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  for (let i = start; i <= end; i++) numbers.push(i);

  return (
    <nav className="egas-pagination" aria-label="Pagination" style={{ marginTop: 'var(--sp-6)' }}>
      <button type="button" className="egas-pagination__btn"
        onClick={() => onChange(currentPage - 1)} disabled={currentPage <= 1}>
        Prev
      </button>
      {numbers.map((n) => (
        <button key={n} type="button"
          className={`egas-pagination__btn ${n === currentPage ? 'is-active' : ''}`}
          onClick={() => onChange(n)} aria-current={n === currentPage ? 'page' : undefined}>
          {n}
        </button>
      ))}
      <button type="button" className="egas-pagination__btn"
        onClick={() => onChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Next
      </button>
    </nav>
  );
}