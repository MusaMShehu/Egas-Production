import React, { useEffect, useState, useCallback } from 'react';
import {
  Droplet, RefreshCw, Info, CheckCircle2, AlertTriangle, Cylinder as CylinderIcon,
} from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { naira, formatDate, unwrap, unwrapList } from './apiHelpers';

export default function RemnantPage() {
  const [source, setSource] = useState(null); // 'new' | 'legacy' | null
  const [state, setState] = useState({
    status: 'loading',
    summary: null,
    ledger: [],
    cylinders: [],
    legacy: null,
  });
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestKg, setRequestKg] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading' }));

    // Try the new ledger stack first
    const [summaryRes, ledgerRes, cylRes] = await Promise.allSettled([
      ApiService.remnant?.getSummary?.() ?? Promise.resolve(null),
      ApiService.remnant?.getLedger?.({ page: 1, limit: 20 }) ?? Promise.resolve(null),
      ApiService.customerCylinders?.getMine?.() ?? Promise.resolve(null),
    ]);

    const summaryRaw = summaryRes.status === 'fulfilled' ? unwrap(summaryRes.value) : null;
    const ledgerRaw  = ledgerRes.status === 'fulfilled' ? unwrapList(ledgerRes.value) : [];
    const cylsRaw    = cylRes.status === 'fulfilled' ? unwrapList(cylRes.value) : [];

    if (summaryRaw) {
      setSource('new');
      setState({
        status: 'success',
        summary: summaryRaw,
        ledger: ledgerRaw,
        cylinders: cylsRaw,
        legacy: null,
      });
      return;
    }

    // Fall back to the legacy endpoint
    try {
      const legacyRes = await ApiService.delivery?.getMyRemnant?.();
      const legacy = unwrap(legacyRes);
      setSource('legacy');
      setState({
        status: 'success',
        summary: null,
        ledger: [],
        cylinders: [],
        legacy,
      });
    } catch (err) {
      setState({ status: 'error', summary: null, ledger: [], cylinders: [], legacy: null, error: err });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submitRemnantRequest = async (e) => {
    e.preventDefault();
    setRequestError('');
    const kg = Number(requestKg);
    if (!Number.isFinite(kg) || kg <= 0) {
      setRequestError('Enter a valid quantity.');
      return;
    }
    setRequestLoading(true);
    try {
      await ApiService.delivery?.requestRemnantDelivery?.({
        requestedKg: kg,
        deliveryDate: requestDate || undefined,
      });
      setRequestOpen(false);
      setRequestKg('');
      setRequestDate('');
      await load();
    } catch (err) {
      setRequestError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not request this delivery.'
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Gas Remnant"
        subtitle="Gas credited back to your account when a delivery is smaller than expected."
        actions={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}
            onClick={load} disabled={state.status === 'loading'}>
            Refresh
          </Button>
        }
      />

      {state.status === 'loading' && (
        <div className="egas-list-stack"><SkeletonCard /><SkeletonCard /></div>
      )}

      {state.status === 'error' && (
        <ErrorState
          title="We couldn't load your remnant"
          description="Please check your connection and try again."
          onRetry={load}
        />
      )}

      {state.status === 'success' && source === 'new' && (
        <NewRemnantView
          summary={state.summary}
          ledger={state.ledger}
          cylinders={state.cylinders}
          onRequestDelivery={() => { setRequestOpen(true); setRequestError(''); }}
        />
      )}

      {state.status === 'success' && source === 'legacy' && (
        <LegacyRemnantView
          legacy={state.legacy}
          onRequestDelivery={() => { setRequestOpen(true); setRequestError(''); }}
        />
      )}

      {state.status === 'success' &&
        source === 'new' &&
        !state.summary &&
        !state.legacy && (
          <EmptyState
            icon={<Droplet size={26} />}
            title="No remnant yet"
            description="When a delivery is smaller than expected, the difference is credited here."
          />
        )}

      {/* Request remnant delivery modal */}
      <Modal
        open={requestOpen}
        onClose={() => !requestLoading && setRequestOpen(false)}
        title="Request remnant delivery"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRequestOpen(false)} disabled={requestLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitRemnantRequest} loading={requestLoading}>
              Request delivery
            </Button>
          </>
        }
      >
        <form onSubmit={submitRemnantRequest} style={{ display: 'grid', gap: 'var(--sp-4)' }}>
          <Input
            label="Quantity (kg)"
            type="number"
            min="6"
            step="0.5"
            value={requestKg}
            onChange={(e) => setRequestKg(e.target.value)}
            helper="Minimum 6kg is required by the current policy."
            required
          />
          <Input
            label="Preferred delivery date (optional)"
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
          />
          {requestError && (
            <div className="egas-auth-error" role="alert">
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{requestError}</span>
            </div>
          )}
          <p className="egas-text--sm" style={{ margin: 0 }}>
            Once approved, the requested amount is deducted from your remnant balance and a
            delivery is scheduled.
          </p>
        </form>
      </Modal>
    </>
  );
}

/* ---------- New remnant view (CylinderRemnantLedger) ---------- */
function NewRemnantView({ summary, ledger, cylinders, onRequestDelivery }) {
  const balance = summary?.balance ?? 0;
  const min = summary?.minimumRequired ?? 6;
  const eligible = summary?.eligible ?? balance >= min;
  const shortfall = summary?.shortfall ?? Math.max(0, min - balance);
  const progress = min > 0 ? Math.min(100, Math.round((balance / min) * 100)) : 0;

  const eligibilityCls = eligible
    ? 'egas-remnant-eligibility'
    : balance === 0
      ? 'egas-remnant-eligibility is-none'
      : 'egas-remnant-eligibility is-blocked';

  const eligibilityCopy = eligible
    ? 'You have enough remnant to request a delivery.'
    : balance === 0
      ? 'You have no remnant yet.'
      : `You need ${shortfall.toFixed(2)}kg more to be eligible.`;

  return (
    <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
      <div className="egas-remnant-hero">
        <div>
          <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)', fontWeight: 'var(--fw-semibold)' }}>
            Current remnant balance
          </div>
          <div className="egas-remnant-hero__amount">
            {balance.toFixed(2)}<small>kg</small>
          </div>
          <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)' }}>
            Minimum for a remnant delivery: <strong>{min}kg</strong>
          </div>
        </div>
        <div>
          <div className="egas-remnant-progress" role="progressbar"
            aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
            aria-label="Remnant eligibility progress">
            <div className="egas-remnant-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className={eligibilityCls} style={{ marginTop: 'var(--sp-4)' }}>
            {eligible ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <span>{eligibilityCopy}</span>
          </div>
          {eligible && (
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <Button variant="primary" onClick={onRequestDelivery}>
                Request remnant delivery
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cylinders */}
      {cylinders.length > 0 && (
        <section className="egas-dash-section">
          <div className="egas-dash-section__head">
            <h2 className="egas-dash-section__title">Your cylinders</h2>
          </div>
          <div style={{ display: 'grid', gap: 'var(--sp-3)' }}>
            {cylinders.map((c) => (
              <div key={c._id} className="egas-cylinder-chip">
                <span className="egas-cylinder-chip__tag">
                  <CylinderIcon size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
                  {c.tagCode || c.tag || '—'}
                </span>
                <p className="egas-cylinder-chip__meta">
                  {c.size || '—'} · last measured {c.lastMeasuredWeight != null ? `${c.lastMeasuredWeight}kg` : '—'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ledger */}
      <section className="egas-dash-section">
        <div className="egas-dash-section__head">
          <h2 className="egas-dash-section__title">Ledger</h2>
        </div>
        {ledger.length === 0 ? (
          <Card>
            <p className="egas-text" style={{ margin: 0 }}>
              No entries yet — once a remnant is credited or consumed, it will appear here.
            </p>
          </Card>
        ) : (
          <Card style={{ padding: 'var(--sp-2) var(--sp-5)' }}>
            {ledger.map((e) => (
              <div key={e._id} className="egas-tx-row">
                <div className={`egas-tx-row__icon ${e.delta >= 0 ? 'is-credit' : 'is-debit'}`}>
                  <Droplet size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="egas-tx-row__title">
                    {humanEvent(e.event)}
                  </p>
                  <div className="egas-tx-row__meta">
                    <span>{formatDate(e.createdAt, { withTime: true })}</span>
                    {e.cylinderTag && <span>· {e.cylinderTag}</span>}
                  </div>
                </div>
                <span className={`egas-tx-row__amount ${e.delta >= 0 ? 'is-credit' : 'is-debit'}`}>
                  {e.delta >= 0 ? '+' : '−'}{Math.abs(e.delta).toFixed(2)}kg
                </span>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}

/* ---------- Legacy remnant view ---------- */
function LegacyRemnantView({ legacy, onRequestDelivery }) {
  const accumulated = legacy?.totalAccumulated ?? legacy?.current?.accumulatedKg ?? 0;
  const canRequest = !!legacy?.canRequestDelivery;
  const pending = Array.isArray(legacy?.pendingConfirmations) ? legacy.pendingConfirmations : [];
  const history = Array.isArray(legacy?.history) ? legacy.history : [];

  const eligibilityCls = canRequest
    ? 'egas-remnant-eligibility'
    : accumulated === 0
      ? 'egas-remnant-eligibility is-none'
      : 'egas-remnant-eligibility is-blocked';

  return (
    <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
      <div className="egas-remnant-hero">
        <div>
          <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)', fontWeight: 'var(--fw-semibold)' }}>
            Accumulated remnant
          </div>
          <div className="egas-remnant-hero__amount">
            {Number(accumulated).toFixed(2)}<small>kg</small>
          </div>
          <div className="egas-text--sm" style={{ color: 'var(--egas-text-secondary)' }}>
            Minimum for a remnant delivery: <strong>6kg</strong>
          </div>
        </div>
        <div>
          <div className={eligibilityCls}>
            {canRequest ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <span>
              {canRequest
                ? 'You can request a remnant delivery.'
                : accumulated === 0
                  ? 'No remnant accumulated yet.'
                  : 'Not yet eligible — keep accumulating or confirm pending entries.'}
            </span>
          </div>
          {canRequest && (
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <Button variant="primary" onClick={onRequestDelivery}>
                Request remnant delivery
              </Button>
            </div>
          )}
        </div>
      </div>

      {pending.length > 0 && (
        <Card>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
            <AlertTriangle size={18} style={{ color: 'var(--egas-warning)', marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'var(--fw-semibold)' }}>Pending confirmations</div>
              <p className="egas-text egas-text--sm" style={{ marginTop: 4 }}>
                You have {pending.length} partial delivery{pending.length > 1 ? 'ies' : ''} awaiting confirmation.
                Confirm them from the delivery page to make them available.
              </p>
              <Button href="/dashboard/delivery" variant="secondary" size="sm">
                Go to deliveries
              </Button>
            </div>
          </div>
        </Card>
      )}

      <section className="egas-dash-section">
        <div className="egas-dash-section__head">
          <h2 className="egas-dash-section__title">Past remnant deliveries</h2>
        </div>
        {history.length === 0 ? (
          <Card><p className="egas-text" style={{ margin: 0 }}>No remnant deliveries recorded yet.</p></Card>
        ) : (
          <Card style={{ padding: 'var(--sp-2) var(--sp-5)' }}>
            {history.map((h, i) => (
              <div key={h._id || i} className="egas-tx-row">
                <div className="egas-tx-row__icon is-credit"><Droplet size={18} /></div>
                <div style={{ minWidth: 0 }}>
                  <p className="egas-tx-row__title">{h.planDetails?.planName || 'Remnant delivery'}</p>
                  <div className="egas-tx-row__meta">
                    <span>{formatDate(h.deliveredAt || h.deliveryDate, { withTime: true })}</span>
                    {h.requestedKg != null && <span>· {h.requestedKg}kg</span>}
                  </div>
                </div>
                <span className="egas-tx-row__amount is-credit">
                  {h.requestedKg ? `+${h.requestedKg}kg` : '—'}
                </span>
              </div>
            ))}
          </Card>
        )}
      </section>

      <p className="egas-text--sm" style={{ color: 'var(--egas-text-muted)' }}>
        {naira(0) /* keep naira imported for consistency; not used here */}
      </p>
    </div>
  );
}

/* ---------- Helpers ---------- */
function humanEvent(e) {
  const map = {
    measurement_added: 'Remnant measured & credited',
    remnant_consumed:  'Remnant used for delivery',
    remnant_credited:  'Manual credit',
    remnant_debited:   'Manual debit',
    remnant_expired:   'Expired',
    adjustment:        'Adjustment',
  };
  return map[e] || (e ? e.replace(/_/g, ' ') : 'Ledger entry');
}