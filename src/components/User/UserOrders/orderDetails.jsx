import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

const OrderDetails = () => {
  const { id } = useParams(); // order ID from route
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        infoToast(`Loading order details #${id}...`);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const res = await fetch(`https://egas-server-1.onrender.com/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch order details");
        }

        const data = await res.json();
        setOrder(data.data);
        successToast(`Order #${id} loaded successfully`);
        
      } catch (err) {
        console.error("Failed to load order:", err);
        const errorMessage = err.message || "Failed to load order details";
        setError(errorMessage);
        
        if (err.message.includes("Authentication")) {
          warningToast("Please log in to view order details");
        } else {
          errorToast(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleContinueShopping = () => {
    infoToast("Returning to shopping...");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleViewAllOrders = () => {
    infoToast("Loading all orders...");
    setTimeout(() => {
      navigate("/orders");
    }, 500);
  };

  const handleGoBackToCart = () => {
    infoToast("Returning to cart...");
    setTimeout(() => {
      navigate("/cart");
    }, 500);
  };

  const handleImageError = (e, productName) => {
    e.target.src = "/images/default-product.jpg";
    warningToast(`Could not load image for ${productName}, using default image`);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    successToast("Order ID copied to clipboard!");
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getOrderStatusBadge = (order) => {
    if (order.isDelivered) {
      return <span className="status-badge delivered">Delivered</span>;
    } else if (order.isPaid) {
      return <span className="status-badge processing">Processing</span>;
    } else {
      return <span className="status-badge pending">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="order-loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Order</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={handleGoBackToCart}>Go Back to Cart</button>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
          <button onClick={handleContinueShopping} className="secondary-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-error">
        <div className="error-icon">📦</div>
        <h2>Order Not Found</h2>
        <p>The requested order could not be found.</p>
        <div className="error-actions">
          <button onClick={handleViewAllOrders}>View All Orders</button>
          <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <header className="order-header">
        <div className="order-header-top">
          <h1>Order Confirmation</h1>
          {getOrderStatusBadge(order)}
        </div>
        <div className="order-id-section">
          <p>
            <strong>Order ID:</strong> 
            <span className="order-id" onClick={handleCopyOrderId} title="Click to copy">
              {order._id}
            </span>
          </p>
          <p className="order-date">
            <strong>Order Date:</strong> {formatDate(order.createdAt)}
          </p>
        </div>
      </header>

      {/* Shipping Info */}
      <section className="order-section">
        <h2>📦 Shipping Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Address:</strong> 
            <span>{order.shippingAddress?.address || "Not specified"}</span>
          </div>
          <div className="info-item">
            <strong>Street:</strong> 
            <span>{order.shippingAddress?.street || "Not specified"}</span>
          </div>
          <div className="info-item">
            <strong>City:</strong>
            <span>{order.shippingAddress?.city || "Not specified"}</span>
          </div>
          <div className="info-item">
            <strong>State:</strong> 
            <span>{order.shippingAddress?.state|| "Not specified"}</span>
          </div>
        </div>
      </section>

      {/* Payment Info */}
      <section className="order-section">
        <h2>💳 Payment Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Method:</strong> 
            <span className="payment-method">{order.paymentMethod || "Not specified"}</span>
          </div>
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`payment-status ${order.isPaid ? 'paid' : 'pending'}`}>
              {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : "Pending Payment"}
            </span>
          </div>
          {order.paymentResult?.id && (
            <div className="info-item">
              <strong>Transaction ID:</strong> 
              <span className="transaction-id">{order.paymentResult.id}</span>
            </div>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="order-section">
        <h2>🛒 Order Items</h2>
        <div className="order-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <img
                src={item.image || "/images/default-product.jpg"}
                alt={item.name}
                onError={(e) => handleImageError(e, item.name)}
              />
              <div className="item-info">
                <p className="item-name"><strong>{item.name}</strong></p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
                <p className="item-price">Price: {formatCurrency(item.price)}</p>
              </div>
              <div className="item-total">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <section className="order-section totals">
        <h2>📊 Order Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Subtotal:</strong> 
            <span>{formatCurrency(order.items.reduce((acc, i) => acc + i.price * i.quantity, 0))}</span>
          </div>
          <div className="summary-item">
            <strong>Shipping:</strong> 
            <span>{formatCurrency(order.shippingPrice || 0)}</span>
          </div>
          <div className="summary-item">
            <strong>Tax:</strong> 
            <span>{formatCurrency(order.taxPrice || 0)}</span>
          </div>
          <div className="summary-item order-total">
            <strong>Total:</strong> 
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
      </section>

      <footer className="order-footer">
        <button 
          onClick={handleContinueShopping} 
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
        <button 
          onClick={handleViewAllOrders} 
          className="view-orders-btn"
        >
          View All Orders
        </button>
        {!order.isPaid && (
          <button 
            onClick={() => warningToast("Payment feature coming soon!")}
            className="pay-now-btn"
          >
            Pay Now
          </button>
        )}
      </footer>
    </div>
  );
};

export default OrderDetails;