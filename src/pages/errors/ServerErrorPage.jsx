import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import './errors.css';

export default function ServerErrorPage() {
  const onReload = () => window.location.reload();
  return (
    <div className="egas-error-shell">
      <div className="egas-error-card">
        <div className="egas-error-code egas-error-code--danger">500</div>
        <h1 className="egas-error-title">Something went wrong on our end</h1>
        <p className="egas-error-desc">
          We&apos;re sorry — the server ran into an unexpected issue. Please try again in a moment.
        </p>
        <div className="egas-error-actions">
          <Button variant="primary" onClick={onReload}>Try again</Button>
          <Button href="/" variant="secondary">Go home</Button>
        </div>
        <p className="egas-error-foot">
          Still stuck? <Link to="/contact">Contact support</Link>.
        </p>
      </div>
    </div>
  );
}