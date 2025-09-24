// components/PaymentGateway.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentGateway.css';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // After success, redirect to order confirmation
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId: `EG-${Math.floor(1000 + Math.random() * 9000)}`,
            ...orderData 
          } 
        });
      }, 2000);
    }, 3000);
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (!orderData) {
    return (
      <div className="payment-page">
        <div className="error-message">
          No order data found. Please start from the cart.
        </div>
        <button className="btn-primary" onClick={() => navigate('/cart')}>
          Go to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="dashboard-header">
        <h1>Payment Gateway</h1>
      </div>

      <div className="payment-content">
        <div className="order-summary-payment">
          <h2>Order Summary</h2>
          <div className="summary-section">
            {orderData.products.map((product, index) => (
              <div key={index} className="product-summary">
                <span>{product.quantity} x {product.name}</span>
                <span>{formatCurrency(product.price * product.quantity)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>{formatCurrency(orderData.deliveryFee)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatCurrency(orderData.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="payment-form">
          {paymentSuccess ? (
            <div className="payment-success">
              <i className="fas fa-check-circle"></i>
              <h2>Payment Successful!</h2>
              <p>Your order has been placed successfully. Redirecting to confirmation page...</p>
            </div>
          ) : isProcessing ? (
            <div className="payment-processing">
              <div className="spinner"></div>
              <h2>Processing Payment...</h2>
              <p>Please do not refresh or close this page.</p>
            </div>
          ) : (
            <>
              <h2>Payment Details</h2>
              
              {orderData.paymentMethod === 'card' ? (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardInput}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardInput}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardInput}
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInput}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              ) : orderData.paymentMethod === 'wallet' ? (
                <div className="wallet-payment">
                  <i className="fas fa-wallet"></i>
                  <h3>Wallet Payment</h3>
                  <p>You will be redirected to your wallet to complete the payment.</p>
                </div>
              ) : (
                <div className="transfer-payment">
                  <i className="fas fa-university"></i>
                  <h3>Bank Transfer</h3>
                  <p>Please transfer the amount to our bank account:</p>
                  <div className="bank-details">
                    <p><strong>Bank:</strong> EcoGas Bank</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>Account Name:</strong> EcoGas Limited</p>
                  </div>
                </div>
              )}
              
              <button 
                className="btn-primary pay-now-btn"
                onClick={processPayment}
              >
                Pay Now {formatCurrency(orderData.totalAmount)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;