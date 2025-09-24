import React from 'react';
import { formatDate } from '../../utils/helpers';
import '../../styles/SubscriptionDetails.css';

const SubscriptionDetails = ({ subscription }) => {
  return (
    <div className="subscription-card">
      <div className="card-header">
        <h2 className="text-xl font-bold">Subscription Details</h2>
        <button className="view-all-button" id="manage-subscription">
          Manage
        </button>
      </div>
      <div className="subscription-details">
        {subscription.active ? (
          <>
            <div className="detail-item">
              <span className="detail-label">Plan:</span>
              <span className="detail-value">{subscription.type.replace(/^\w/, c => c.toUpperCase())} Auto-Refill</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Product:</span>
              <span className="detail-value">{subscription.product}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value">₦{subscription.price.toLocaleString()}/month</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Next Delivery:</span>
              <span className="detail-value">{formatDate(subscription.nextDelivery)}</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600">You don't have an active subscription.</p>
            <button className="action-button bg-blue-600 mt-2" id="subscribe-now">
              Subscribe Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;