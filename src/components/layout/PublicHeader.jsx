import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const NAV = [
  { to: '/',        label: 'Home' },
  { to: '/services',label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq',     label: 'FAQ' },
];

export default function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      <header className="egas-public-header">
        <div className="egas-container egas-public-header__inner">
          <Link to="/" className="egas-logo" aria-label="e-GAS home">
            <span className="egas-logo__mark" aria-hidden="true">e</span>
            <span className="egas-logo__word">GAS</span>
          </Link>

          <nav className="egas-public-nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="egas-public-cta">
            {!isLoading && isAuthenticated ? (
              <Button href="/dashboard/overview" variant="primary" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button href="/auth" variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button href="/auth?mode=register" variant="primary" size="sm">
                  Create Account
                </Button>
              </>
            )}

            <button
              type="button"
              className="egas-customer-topbar__icon-btn egas-public-header__burger"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="public-mobile-drawer"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`egas-drawer-backdrop ${drawerOpen ? 'is-open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <aside
        id="public-mobile-drawer"
        className={`egas-drawer ${drawerOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="egas-logo" aria-label="e-GAS home">
            <span className="egas-logo__mark" aria-hidden="true">e</span>
            <span className="egas-logo__word">GAS</span>
          </Link>
          <button
            type="button"
            className="egas-customer-topbar__icon-btn"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="egas-drawer__nav" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `egas-drawer__link ${isActive ? 'is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'grid', gap: 'var(--sp-3)' }}>
          {!isLoading && isAuthenticated ? (
            <Button href="/dashboard/overview" variant="primary" block>
              <UserIcon size={16} /> Go to Dashboard
            </Button>
          ) : (
            <>
              <Button href="/auth" variant="secondary" block>Sign In</Button>
              <Button href="/auth?mode=register" variant="primary" block>
                Create Account
              </Button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}