import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import './errors.css';

export default function UnauthorizedPage() {
  return (
    <div className="egas-error-shell">
      <div className="egas-error-card">
        <div className="egas-error-code egas-error-code--danger">401</div>
        <h1 className="egas-error-title">You&apos;re not authorized to view this page</h1>
        <p className="egas-error-desc">
          Your session may have expired, or this page requires a different account.
          Try signing in again, or head back to your dashboard.
        </p>
        <div className="egas-error-actions">
          <Button href="/auth" variant="primary">Sign in</Button>
          <Button href="/dashboard/overview" variant="secondary">Go to dashboard</Button>
        </div>
        <p className="egas-error-foot">
          If you believe this is a mistake, <Link to="/dashboard/support">contact support</Link>.
        </p>
      </div>
    </div>
  );
}