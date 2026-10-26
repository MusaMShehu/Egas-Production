import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import CustomerTopbar from './CustomerTopbar';
import MobileNavDrawer from './MobileNavDrawer';
import MobileBottomNav from './MobileBottomNav';
import { useOptionalFirebaseNotifications } from '../../pages/customer/useOptionalFirebaseNotifications';


/**
 * CustomerLayout — the single responsive shell for every /dashboard/* page.
 *
 *  - Desktop (>=1024px): collapsible left sidebar + topbar + content.
 *  - Tablet / mobile: hidden sidebar, topbar with burger + slide-in drawer,
 *    plus a 5-tab bottom nav.
 *
 * Nothing here touches auth, API, or routing logic. ProtectedRoute still
 * gates the entire tree; this layout only renders the chrome.
 */
const SIDEBAR_KEY = 'egas.sidebar.collapsed';

export default function CustomerLayout({ title }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === '1'; } catch { return false; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const notifications = useOptionalFirebaseNotifications();

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Persist sidebar collapsed state
  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  const toggleCollapse = useCallback(() => setCollapsed((v) => !v), []);
  const openDrawer     = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer    = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className={`egas-customer-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <CustomerSidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      <div className="egas-customer-shell__main">
        {/* <CustomerTopbar
          onOpenDrawer={openDrawer}
          unreadCount={0}
          title={title}
        /> */}

        <CustomerTopbar
          onOpenDrawer={openDrawer}
          unreadCount={notifications?.unreadCount || 0}
          title={title}
        />

        <main className="egas-customer-shell__content" id="main-content">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>

      <MobileNavDrawer open={drawerOpen} onClose={closeDrawer} />
    </div>
  );
}