import React, { useMemo } from 'react';
import {
  PauseCircle, PlayCircle, XCircle, RotateCw, Calendar, Package, CreditCard,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { naira, formatDate } from '../../pages/customer/apiHelpers';
import './subscriptions.css';

/**
 * SubscriptionCard — active/paused/expired/cancelled subscription.
 *
 * Props:
 *   sub       — subscription object from GET /subscriptions/my-subscriptions
 *   busy      — disable actions while an API call is in flight
 *   onRequest — (action) => void, where action is 'pause' | 'resume' | 'cancel' | 'renew'
 */
export default function SubscriptionCard({ sub, busy = false, onRequest }) {
  if (!sub) return null;

  const status = String(sub.status || 'active').toLowerCase();

  const nextDate = sub.nextDeliveryDate || sub.startDate;
  const progress = useMemo(() => computeProgress(sub), [sub]);

  return (
    <div className="egas-sub-card">
      <div className="egas-sub-card__top">
        <div className="egas-sub-card__heading">
          <h3 className="egas-sub-card__title">{sub.planName || 'Subscription'}</h3>
          <p className="egas-sub-card__meta">
            {sub.size && (
              <span>
                <Package size={12} /> {sub.size}
              </span>
            )}
            {sub.frequency && (
              <span>
                <Calendar size={12} /> {sub.frequency}
              </span>
            )}
            {sub.subscriptionPeriod && (
              <span>
                · {sub.subscriptionPeriod} month{sub.subscriptionPeriod > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      <div className="egas-sub-card__grid">
        <Field label="Price" value={naira(sub.price)} />
        <Field label="Started" value={formatDate(sub.startDate)} />
        <Field
          label={status === 'expired' ? 'Ended' : 'Next delivery'}
          value={formatDate(nextDate)}
        />
      </div>

      {progress && (status === 'active' || status === 'paused') && (
        <div className="egas-sub-card__progress">
          <div
            className="egas-sub-card__progress-track"
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Subscription progress"
          >
            <div
              className="egas-sub-card__progress-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="egas-sub-card__progress-labels">
            <span>{progress.label}</span>
            <span>{progress.percent}%</span>
          </div>
        </div>
      )}

      <div className="egas-sub-card__actions">
        {status === 'active' && (
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<PauseCircle size={14} />}
              onClick={() => onRequest?.('pause')}
              disabled={busy}
            >
              Pause
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<XCircle size={14} />}
              onClick={() => onRequest?.('cancel')}
              disabled={busy}
            >
              Cancel
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlayCircle size={14} />}
              onClick={() => onRequest?.('resume')}
              disabled={busy}
            >
              Resume
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<XCircle size={14} />}
              onClick={() => onRequest?.('cancel')}
              disabled={busy}
            >
              Cancel
            </Button>
          </>
        )}

        {(status === 'expired' || status === 'cancelled') && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RotateCw size={14} />}
            onClick={() => onRequest?.('renew')}
            disabled={busy}
          >
            Renew
          </Button>
        )}
      </div>
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

function computeProgress(sub) {
  if (!sub?.startDate || !sub?.endDate) return null;

  const start = new Date(sub.startDate).getTime();
  const end = new Date(sub.endDate).getTime();
  const now = Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;

  const percent = Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));

  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
  const label =
    daysLeft === 0
      ? 'Ends today'
      : daysLeft === 1
      ? '1 day remaining'
      : `${daysLeft} days remaining`;

  return { percent, label };
}

/* ---------- Skeleton ---------- */
export function SubscriptionCardSkeleton() {
  return (
    <div className="egas-sub-card" aria-hidden="true">
      <div className="egas-sub-card__top">
        <div className="egas-sub-card__heading">
          <span className="egas-skeleton" style={{ display: 'block', width: '55%', height: 18 }} />
          <span className="egas-skeleton" style={{ display: 'block', width: '35%', height: 14, marginTop: 6 }} />
        </div>
        <span className="egas-skeleton" style={{ width: 76, height: 22, borderRadius: 999 }} />
      </div>
      <div className="egas-sub-card__grid">
        <span className="egas-skeleton" style={{ height: 36 }} />
        <span className="egas-skeleton" style={{ height: 36 }} />
        <span className="egas-skeleton" style={{ height: 36 }} />
      </div>
      <span className="egas-skeleton" style={{ height: 8, borderRadius: 999 }} />
      <div className="egas-sub-card__actions">
        <span className="egas-skeleton" style={{ width: 92, height: 32, borderRadius: 10 }} />
        <span className="egas-skeleton" style={{ width: 92, height: 32, borderRadius: 10 }} />
      </div>
    </div>
  );
}