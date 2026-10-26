import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PublicFooter — links and contact info only.
 * No invented phone numbers/addresses. Only well-known public channels.
 */
export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="egas-public-footer">
      <div className="egas-container">
        <div className="egas-public-footer__grid">
          <div>
            <Link to="/" className="egas-logo egas-logo--inverse" aria-label="e-GAS home">
              <span className="egas-logo__mark" aria-hidden="true">e</span>
              <span className="egas-logo__word">GAS</span>
            </Link>
            <p style={{ marginTop: 'var(--sp-4)', maxWidth: 320 }}>
              Digital LPG cooking gas ordering, scheduled subscription, and doorstep
              delivery. e-GAS coordinates refills through a network of partner
              LPG plants across Nigeria.
            </p>
          </div>

          <nav aria-label="Product">
            <h4>Product</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/subscription-plan">Subscription Plans</Link></li>
              <li><Link to="/auth?mode=register">Create Account</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </nav>

          <nav aria-label="Account">
            <h4>Account</h4>
            <ul>
              <li><Link to="/auth">Sign In</Link></li>
              <li><Link to="/dashboard/orders">My Orders</Link></li>
              <li><Link to="/dashboard/subscriptions">Subscriptions</Link></li>
              <li><Link to="/dashboard/support">Support</Link></li>
            </ul>
          </nav>
        </div>

        <div className="egas-public-footer__bottom">
          <span>© {year} E-GAS ONLINE LIMITED. All rights reserved.</span>
          <span>Lagos, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}