import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import './errors.css';

export default function NotFoundPage() {
  return (
    <div className="egas-error-shell">
      <div className="egas-error-card">
        <div className="egas-error-code egas-error-code--warn">404</div>
        <h1 className="egas-error-title">We couldn&apos;t find that page</h1>
        <p className="egas-error-desc">
          The page you&apos;re looking for may have moved, or the link might be out of date.
        </p>
        <div className="egas-error-actions">
          <Button href="/" variant="primary">Go home</Button>
          <Button href="/dashboard/overview" variant="secondary">Go to dashboard</Button>
        </div>
        <p className="egas-error-foot">
          Need help? <Link to="/contact">Contact support</Link>
        </p>
      </div>
    </div>
  );
}