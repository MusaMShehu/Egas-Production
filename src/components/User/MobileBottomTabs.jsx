import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaShoppingCart, 
  FaCalendarAlt,
  FaHistory,
  FaWallet,
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
      id: 'refill',
      label: 'Refill',
      icon: <FaGasPump />,
      path: '/subscription-plan',
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
      id: 'wallet',
      label: 'Wallet',
      icon: <FaWallet />,
      path: '/dashboard/payments',
      activeIcon: <FaWallet style={{ color: '#FF6B35' }} />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <FaUser />,
      path: '/dashboard/profile',
      activeIcon: <FaUser style={{ color: '#FF6B35' }} />
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