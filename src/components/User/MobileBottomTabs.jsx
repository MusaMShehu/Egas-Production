import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaShoppingCart, 
  FaCalendarAlt,
  FaHistory,
  FaUser,
  FaFire,
  FaGasPump,
  FaReceipt,
  FaCog
} from 'react-icons/fa';
import './MobileBottomTabs.css';

const MobileBottomTabs = () => {
  const location = useLocation();
  
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <FaHome />,
      path: '/',
      activeIcon: <FaHome style={{ color: '#FF6B35' }} />
    },
    {
      id: 'order',
      label: 'Order',
      icon: <FaGasPump />,
      path: '/dashboard/orders',
      activeIcon: <FaFire style={{ color: '#FF6B35' }} />
    },
    {
      id: 'subscriptions',
      label: 'Dashboard',
      icon: <FaCalendarAlt />,
      path: '/dashboard/overview',
      activeIcon: <FaCalendarAlt style={{ color: '#FF6B35' }} />
    },
    {
      id: 'history',
      label: 'Subs',
      icon: <FaHistory />,
      path: '/dashboard/subscriptions',
      activeIcon: <FaReceipt style={{ color: '#FF6B35' }} />
    },
    {
      id: 'profile',
      label: 'Wallet',
      icon: <FaUser />,
      path: '/dashboard/payments',
      activeIcon: <FaCog style={{ color: '#FF6B35' }} />
    }
  ];

  return (
    <div className="mobile-bottom-tabs">
      <div className="tabs-container">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`tab-item ${isActive ? 'active' : ''}`}
            >
              <div className="tab-icon">
                {isActive ? tab.activeIcon : tab.icon}
              </div>
              <span className="tab-label">{tab.label}</span>
              {isActive && <div className="active-indicator"></div>}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomTabs;