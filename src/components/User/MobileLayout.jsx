import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileBottomTabs from "./MobileBottomTabs";
import MobileHeader from "./MobileHeader";
import "./MobileLayout.css";

const MobileLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide tabs on certain pages
  const hideTabs = [
    '/user/orders/new',
    '/user/subscriptions/new',
    '/user/wallet/topup'
  ].some(path => location.pathname.includes(path));

  return (
    <div className="mobile-layout">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="mobile-main">
        <Outlet />
      </main>
      
      {/* Bottom Navigation - Hidden on certain pages */}
      {!hideTabs && <MobileBottomTabs />}
      
      {/* Floating Action Button for Quick Order */}
      {!hideTabs && location.pathname === '/user/dashboard' && (
        <button 
          className="fab"
          onClick={() => navigate('/user/orders/new')}
        >
          <span className="fab-icon">🔥</span>
          <span className="fab-text">Order Gas</span>
        </button>
      )}
    </div>
  );
};

export default MobileLayout;