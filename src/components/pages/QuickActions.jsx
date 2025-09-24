// components/dashboard/QuickActions.js
import React from 'react';
import '../../styles/QuickActions.css'

const QuickActions = () => {
  const actions = [
    { id: 'quick-order-gas', icon: 'fas fa-gas-pump', label: 'Order Gas', color: 'bg-blue-600' },
    { id: 'quick-manage-subscription', icon: 'fas fa-calendar-plus', label: 'Manage Subscription', color: 'bg-green-600' },
    { id: 'quick-top-up', icon: 'fas fa-wallet', label: 'Top Up Wallet', color: 'bg-purple-600' },
    { id: 'quick-support', icon: 'fas fa-headset', label: 'Contact Support', color: 'bg-yellow-600' }
  ];

  return (
    <div className="quick-actions">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="actions-container">
        {actions.map(action => (
          <button 
            key={action.id}
            className={`action-button ${action.color}`}
            id={action.id}
          >
            <i className={`${action.icon} mr-2`}></i> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;