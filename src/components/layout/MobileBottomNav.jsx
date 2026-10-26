import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Truck, Wallet, User as UserIcon } from 'lucide-react';

const TABS = [
  { to: '/dashboard/overview', label: 'Home',   icon: Home },
  { to: '/dashboard/order',    label: 'Order',  icon: ShoppingBag },
  { to: '/dashboard/delivery', label: 'Deliver',icon: Truck },
  { to: '/dashboard/payments', label: 'Wallet', icon: Wallet },
  { to: '/dashboard/profile',  label: 'Me',     icon: UserIcon },
];

/**
 * Mobile / tablet bottom tab bar. Hidden >= 1024px by CSS.
 */
export default function MobileBottomNav() {
  return (
    <nav className="egas-bottom-nav" aria-label="Primary mobile">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard/overview'}
          className={({ isActive }) =>
            `egas-bottom-nav__item ${isActive ? 'is-active' : ''}`
          }
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}