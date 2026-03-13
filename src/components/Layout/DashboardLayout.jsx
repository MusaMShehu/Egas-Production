import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ErrorBoundary from '../components/common/ErrorBoundary';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <ErrorBoundary>
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          isMobile={isMobile}
          onToggle={toggleSidebar}
        />
        
        <div className="dashboard-main">
          <DashboardHeader 
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
          />
          
          <main className="dashboard-content">
            <div className="content-wrapper">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardLayout;