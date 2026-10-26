import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Repeat, Truck, Wallet,
  History, Droplet, User as UserIcon, Bell, LifeBuoy, Settings,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Desktop-only sidebar (>= 1024px).
 * Collapsible via `collapsed` prop controlled by the parent layout.
 */
const PRIMARY = [
  { to: '/dashboard/overview',      label: 'Overview',         icon: LayoutDashboard },
  { to: '/dashboard/order',         label: 'Order Gas',        icon: ShoppingBag },
  // { to: '/dashboard/orders',        label: 'My Orders',        icon: Package },
  { to: '/dashboard/subscriptions', label: 'Subscriptions',    icon: Repeat },
  { to: '/dashboard/delivery',      label: 'Delivery Schedule',icon: Truck },
  { to: '/dashboard/remnant',       label: 'Gas Remnant',      icon: Droplet },
];

const SECONDARY = [
  { to: '/dashboard/payments',  label: 'Wallet & Payments', icon: Wallet },
  { to: '/dashboard/history',   label: 'History',           icon: History },
  // { to: '/dashboard/profile',   label: 'Profile',           icon: UserIcon },
  // { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  // { to: '/dashboard/support',   label: 'Help & Support',    icon: LifeBuoy },
  // { to: '/dashboard/settings',  label: 'Settings',          icon: Settings },
];

function initialsOf(user) {
  if (!user) return '?';
  const f = (user.firstName || '').trim();
  const l = (user.lastName || '').trim();
  if (!f && !l) return (user.email || '?').slice(0, 1).toUpperCase();
  return `${f.slice(0, 1)}${l.slice(0, 1)}`.toUpperCase() || f.slice(0, 1).toUpperCase();
}

export default function CustomerSidebar({ collapsed = false, onToggleCollapse }) {
  const { user } = useAuth();

  const renderLink = ({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/dashboard/overview'}
      className={({ isActive }) =>
        `egas-customer-sidebar__link ${isActive ? 'is-active' : ''}`
      }
      title={collapsed ? label : undefined}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={`egas-customer-sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-label="Dashboard navigation">
      <div className="egas-customer-sidebar__logo">
        <span className="egas-logo__mark" aria-hidden="true">e</span>
        <span className="egas-logo__word">GAS</span>
      </div>

      <nav className="egas-customer-sidebar__nav" aria-label="Primary">
        {PRIMARY.map(renderLink)}
      </nav>

      <div className="egas-customer-sidebar__label">Account</div>
      <nav className="egas-customer-sidebar__nav" aria-label="Account">
        {SECONDARY.map(renderLink)}
      </nav>

      <div className="egas-customer-sidebar__foot">
        <div className="egas-sidebar-user">
          <div className="egas-sidebar-user__avatar">
            {user?.profileImage?.secure_url
              ? <img src={user.profileImage.secure_url} alt="" />
              : initialsOf(user)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="egas-sidebar-user__name">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer' : 'Customer'}
            </div>
            <div className="egas-sidebar-user__role">{user?.email || ''}</div>
          </div>
        </div>

        <button
          type="button"
          className="egas-sidebar-collapse"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}