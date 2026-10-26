import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import ApiService from '../../api/apiService';
import Button from '../../components/ui/Button';
import { naira, unwrap } from '../customer/apiHelpers';
import './payments.css';

export default function PaymentCallbackPage() {
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
        const res = await ApiService.payments?.verifyTopup?.(reference);
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
            'We could not verify this transaction.',
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
            <h1 className="egas-pay-title">Verifying your payment…</h1>
            <p className="egas-pay-desc">
              Please don&apos;t close this page. This usually takes a few seconds.
            </p>
          </>
        )}

        {state.status === 'success' && (
          <>
            <div className="egas-pay-icon is-success"><CheckCircle2 size={30} /></div>
            <h1 className="egas-pay-title">Wallet top-up successful</h1>
            <p className="egas-pay-desc">
              Your wallet has been credited. You can now use it at checkout.
            </p>

            {state.data && (
              <ul className="egas-pay-details">
                {state.data.amount != null && (
                  <li><span>Amount</span><span>{naira(state.data.amount)}</span></li>
                )}
                {state.data.walletBalance != null && (
                  <li><span>New balance</span><span>{naira(state.data.walletBalance)}</span></li>
                )}
                {state.data.reference && (
                  <li><span>Reference</span><span>{state.data.reference}</span></li>
                )}
              </ul>
            )}

            <div className="egas-pay-actions">
              <Button variant="primary" onClick={() => navigate('/dashboard/payments', { replace: true })}>
                Go to wallet
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
            <h1 className="egas-pay-title">We couldn&apos;t verify this payment</h1>
            <p className="egas-pay-desc">
              {state.error || 'The transaction may not have completed. You can try again or contact support.'}
            </p>
            <div className="egas-pay-actions">
              <Button variant="primary" onClick={() => navigate('/dashboard/payments', { replace: true })}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard/support', { replace: true })}>
                Contact support
              </Button>
            </div>
            <p className="egas-pay-foot">
              Reference: <code>{reference || '—'}</code>
            </p>
          </>
        )}
      </div>
    </div>
  );
}