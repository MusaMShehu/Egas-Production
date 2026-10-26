import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import { unwrap } from '../customer/apiHelpers';
import './payments.css';

export default function SubscriptionVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [state, setState] = useState({ status: 'pending', data: null, error: '' });

  useEffect(() => {
    if (!reference) {
      setState({ status: 'failed', data: null, error: 'Missing transaction reference.' });
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await ApiService.subscriptions?.verify?.(reference);
        if (!alive) return;
        const body = res?.data ?? {};
        if (body.success === false) {
          setState({ status: 'failed', data: null, error: body.message || 'Verification failed.' });
          return;
        }
        setState({ status: 'success', data: unwrap(res) || body, error: '' });
      } catch (err) {
        if (!alive) return;
        setState({
          status: 'failed',
          data: null,
          error:
            err?.response?.data?.message ||
            err?.message ||
            'We could not verify this subscription payment.',
        });
      }
    })();
    return () => { alive = false; };
  }, [reference]);

  return (
    <div className="egas-pay-shell">
      <div className="egas-pay-card">
        {state.status === 'pending' && (
          <>
            <div className="egas-pay-icon is-pending">
              <span className="egas-pay-spinner" />
            </div>
            <h1 className="egas-pay-title">Activating your subscription…</h1>
            <p className="egas-pay-desc">
              This usually takes a few seconds. Please don&apos;t close the page.
            </p>
          </>
        )}

        {state.status === 'success' && (
          <>
            <div className="egas-pay-icon is-success"><CheckCircle2 size={30} /></div>
            <h1 className="egas-pay-title">Subscription active</h1>
            <p className="egas-pay-desc">
              Your plan is now active. We&apos;ll notify you before each scheduled delivery.
            </p>

            <div className="egas-pay-actions">
              <Button variant="primary" onClick={() => navigate('/dashboard/subscriptions', { replace: true })}>
                Manage subscription
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard/overview', { replace: true })}>
                Dashboard
              </Button>
            </div>
          </>
        )}

        {state.status === 'failed' && (
          <>
            <div className="egas-pay-icon is-failed"><XCircle size={30} /></div>
            <h1 className="egas-pay-title">We couldn&apos;t verify this subscription</h1>
            <p className="egas-pay-desc">
              {state.error || 'The payment may not have completed. You can try again or contact support.'}
            </p>
            <div className="egas-pay-actions">
              <Button variant="primary" onClick={() => navigate('/dashboard/order', { replace: true })}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard/support', { replace: true })}>
                Contact support
              </Button>
            </div>
            <p className="egas-pay-foot">Reference: <code>{reference || '—'}</code></p>
          </>
        )}
      </div>
    </div>
  );
}