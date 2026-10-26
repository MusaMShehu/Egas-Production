import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, LogOut, User as UserIcon, Settings, LifeBuoy, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function initialsOf(user) {
  if (!user) return '?';
  const f = (user.firstName || '').trim();
  const l = (user.lastName || '').trim();
  if (!f && !l) return (user.email || '?').slice(0, 1).toUpperCase();
  return `${f.slice(0, 1)}${l.slice(0, 1)}`.toUpperCase() || f.slice(0, 1).toUpperCase();
}

export default function CustomerTopbar({
  onOpenDrawer,
  unreadCount = 0,
  title,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close profile menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  const onLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
    } finally {
      navigate('/', { replace: true });
    }
  };

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer'
    : 'Customer';

  return (
    <header className="egas-customer-topbar">
      {/* Burger — visible < 1024px */}
      <button
        type="button"
        className="egas-customer-topbar__icon-btn"
        aria-label="Open navigation"
        onClick={onOpenDrawer}
        style={{ display: 'inline-flex' }}
      >
        <Menu size={22} />
      </button>

      {/* Brand on small/medium */}
      <Link to="/dashboard/overview" className="egas-topbar-brand" aria-label="e-GAS dashboard">
        <span className="egas-logo__mark" aria-hidden="true">e</span>
        <span className="egas-logo__word">GAS</span>
      </Link>

      {/* Page title (medium+) */}
      {title && <span className="egas-topbar-title">{title}</span>}

      <div className="egas-customer-topbar__spacer" />

      {/* Notifications */}
      <Link
        to="/dashboard/notifications"
        className="egas-customer-topbar__icon-btn"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="egas-notif-count" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <div className="egas-menu-wrap" ref={menuRef}>
        <button
          type="button"
          className="egas-profile-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="egas-profile-btn__avatar" aria-hidden="true">
            {user?.profileImage?.secure_url
              ? <img src={user.profileImage.secure_url} alt="" />
              : initialsOf(user)}
          </span>
          <span className="egas-profile-btn__name">{fullName}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className="egas-menu" role="menu">
            <div className="egas-menu__header">
              <div className="egas-menu__name">{fullName}</div>
              {user?.email && <div className="egas-menu__email">{user.email}</div>}
            </div>

            <Link to="/dashboard/profile" className="egas-menu__item" role="menuitem"
              onClick={() => setMenuOpen(false)}>
              <UserIcon size={16} /> Profile
            </Link>
            <Link to="/dashboard/settings" className="egas-menu__item" role="menuitem"
              onClick={() => setMenuOpen(false)}>
              <Settings size={16} /> Settings
            </Link>
            <Link to="/dashboard/support" className="egas-menu__item" role="menuitem"
              onClick={() => setMenuOpen(false)}>
              <LifeBuoy size={16} /> Help &amp; Support
            </Link>

            <div className="egas-menu__divider" />

            <button
              type="button"
              className="egas-menu__item egas-menu__item--danger"
              role="menuitem"
              onClick={onLogout}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}