// components/dashboard/DeliveryStatus.js
import React from 'react';
import { formatDate } from '../../utils/helperss';

const DeliveryStatus = ({ orders }) => {
  const activeOrder = orders.find(order => order.status === 'processing');
  
  return (
    <div className="delivery-card">
      <h2 className="text-xl font-bold mb-4">Current Delivery Status</h2>
      <div>
        {activeOrder && activeOrder.tracking ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Order #{activeOrder.id}</h3>
              <p className="text-sm text-gray-600">Estimated delivery: {formatDate(activeOrder.deliveryDate)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Order Placed</span>
                <span>Shipped</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
              <div className="tracking-bar">
                <div 
                  className="tracking-progress" 
                  style={{ width: `${activeOrder.tracking.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="tracking-info">
              <p className="text-sm">
                <span className="font-medium">Current Status:</span> 
                {activeOrder.tracking.status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Location:</span> {activeOrder.tracking.location}
              </p>
            </div>
            
            <button className="track-button" id="track-order">
              View Full Tracking
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No active deliveries at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryStatus;