import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

/**
 * PublicLayout — used by all unauthenticated marketing pages.
 */
export default function PublicLayout() {
  return (
    <div className="egas-public-shell">
      <PublicHeader />
      <main id="main-content" className="egas-public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}