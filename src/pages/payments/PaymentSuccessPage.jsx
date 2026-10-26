import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import './payments.css';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'payment';
  const reference = searchParams.get('reference') || searchParams.get('trxref') || null;

  const title = type === 'subscription' ? 'Subscription activated' : 'Payment successful';
  const desc = type === 'subscription'
    ? 'Your subscription is now active. We&apos;ll notify you before each delivery.'
    : 'We&apos;ve received your payment. Your order is being prepared.';

  return (
    <div className="egas-pay-shell">
      <div className="egas-pay-card">
        <div className="egas-pay-icon is-success"><CheckCircle2 size={30} /></div>
        <h1 className="egas-pay-title">{title}</h1>
        <p className="egas-pay-desc">{desc}</p>

        {reference && (
          <ul className="egas-pay-details">
            <li><span>Reference</span><span>{reference}</span></li>
          </ul>
        )}

        <div className="egas-pay-actions">
          <Button variant="primary" onClick={() => navigate('/dashboard/overview', { replace: true })}>
            Back to dashboard
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard/orders', { replace: true })}>
            View my orders
          </Button>
        </div>
      </div>
    </div>
  );
}