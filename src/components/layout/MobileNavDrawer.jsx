import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Repeat, Truck, Wallet,
  History, Droplet, User as UserIcon, Bell, LifeBuoy, Settings,
  X, LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ITEMS = [
  { to: '/dashboard/overview',       label: 'Overview',          icon: LayoutDashboard },
  { to: '/dashboard/order',          label: 'Order Gas',         icon: ShoppingBag },
  { to: '/dashboard/orders',         label: 'My Orders',         icon: Package },
  { to: '/dashboard/subscriptions',  label: 'Subscriptions',     icon: Repeat },
  { to: '/dashboard/delivery',       label: 'Delivery Schedule', icon: Truck },
  { to: '/dashboard/remnant',        label: 'Gas Remnant',       icon: Droplet },
  { to: '/dashboard/payments',       label: 'Wallet & Payments', icon: Wallet },
  { to: '/dashboard/history',        label: 'History',           icon: History },
  { to: '/dashboard/profile',        label: 'Profile',           icon: UserIcon },
  { to: '/dashboard/notifications',  label: 'Notifications',     icon: Bell },
  { to: '/dashboard/support',        label: 'Help & Support',    icon: LifeBuoy },
  { to: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

export default function MobileNavDrawer({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('egas-scroll-locked', open);
    return () => document.body.classList.remove('egas-scroll-locked');
  }, [open]);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const onLogout = async () => {
    onClose?.();
    try { await logout(); } finally { navigate('/auth', { replace: true }); }
  };

  return (
    <>
      <div
        className={`egas-drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`egas-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/dashboard/overview" className="egas-logo" onClick={onClose}>
            <span className="egas-logo__mark" aria-hidden="true">e</span>
            <span className="egas-logo__word">GAS</span>
          </Link>
          <button
            type="button"
            className="egas-customer-topbar__icon-btn"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="egas-drawer__nav" aria-label="Dashboard">
          {ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard/overview'}
              className={({ isActive }) =>
                `egas-drawer__link ${isActive ? 'is-active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="egas-drawer__foot">
          <button
            type="button"
            className="egas-drawer__link"
            onClick={onLogout}
            style={{ color: 'var(--egas-error)' }}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}