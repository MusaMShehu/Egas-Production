// // src/components/PaymentSuccess.js
// import React from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { transaction, message } = location.state || {};

//   return (
//     <div className="success-container">
//       <div className="success-card">
//         <div className="success-icon">🎉</div>
//         <h1>Payment Successful!</h1>
//         <p>{message || 'Thank you for your purchase!'}</p>
        
//         {transaction && (
//           <div className="transaction-details">
//             <h3>Transaction Details</h3>
//             <p><strong>Reference:</strong> {transaction.reference}</p>
//             <p><strong>Amount:</strong> ₦{(transaction.amount || 0).toLocaleString()}</p>
//             <p><strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}</p>
//             <p><strong>Status:</strong> <span className="status-success">Completed</span></p>
//           </div>
//         )}

//         <div className="success-actions">
//           <Link to="/dashboard" className="btn-primary">
//             Go to Dashboard
//           </Link>
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="btn-secondary"
//           >
//             Buy Another Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;




















// src/pages/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, message, type } = location.state || {};

  const handleGoToDashboard = () => navigate('/dashboard');
  const handleGoToSubscriptions = () => navigate('/dashboard/subscriptions');
  const handleGoToOrders = () => navigate('/dashboard/orders');

  const getRedirectButtons = () => {
    switch (type) {
      case 'subscription':
        return <button onClick={handleGoToSubscriptions} className="btn-primary">View Subscriptions</button>;
      case 'order':
        return <button onClick={handleGoToOrders} className="btn-primary">View Orders</button>;
      default:
        return <button onClick={handleGoToDashboard} className="btn-primary">Go to Dashboard</button>;
    }
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" style={{ fontSize: '64px', color: '#2ecc71' }} />
        <h1>Payment Successful!</h1>
        <p>{message || 'Thank you for your purchase!'}</p>
        
        {transaction && (
          <div className="transaction-details">
            <h3>Transaction Details</h3>
            <p><strong>Reference:</strong> {transaction.reference}</p>
            <p><strong>Amount:</strong> ₦{(transaction.amount || 0).toLocaleString()}</p>
            <p><strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className="status-success">Completed</span></p>
          </div>
        )}

        <div className="success-actions">
          {getRedirectButtons()}
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;