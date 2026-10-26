import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { naira } from '../customer/apiHelpers';
import './payments.css';

export default function WalletSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = Number(searchParams.get('amount')) || null;
  const reference = searchParams.get('reference') || searchParams.get('trxref') || null;

  return (
    <div className="egas-pay-shell">
      <div className="egas-pay-card">
        <div className="egas-pay-icon is-success"><CheckCircle2 size={30} /></div>
        <h1 className="egas-pay-title">Wallet updated</h1>
        <p className="egas-pay-desc">
          Your wallet is ready. Head back to your dashboard to continue.
        </p>

        {(amount || reference) && (
          <ul className="egas-pay-details">
            {amount != null && <li><span>Amount</span><span>{naira(amount)}</span></li>}
            {reference && <li><span>Reference</span><span>{reference}</span></li>}
          </ul>
        )}

        <div className="egas-pay-actions">
          <Button variant="primary" onClick={() => navigate('/dashboard/payments', { replace: true })}>
            View wallet
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard/order', { replace: true })}>
            Order gas
          </Button>
        </div>
      </div>
    </div>
  );
}