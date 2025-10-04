import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

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

        const res = await fetch(`https://egas-server.onrender.com/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch order details");
        }

        const data = await res.json();
        setOrder(data.data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/cart")}>Go Back to Cart</button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="order-details-container">
      <header className="order-header">
        <h1>Order Confirmation</h1>
        <p>Order ID: {order._id}</p>
      </header>

      {/* Shipping Info */}
      <section className="order-section">
        <h2>Shipping Information</h2>
        <p><strong>Address:</strong> {order.shippingAddress.address}</p>
        <p><strong>City:</strong> {order.shippingAddress.city}</p>
        <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
        <p><strong>Country:</strong> {order.shippingAddress.country}</p>
      </section>

      {/* Payment Info */}
      <section className="order-section">
        <h2>Payment</h2>
        <p><strong>Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Status:</strong>{" "}
          {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : "Not Paid"}
        </p>
      </section>

      {/* Items */}
      <section className="order-section">
        <h2>Items</h2>
        <div className="order-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <img
                src={item.image || "/images/default-product.jpg"}
                alt={item.name}
                onError={(e) => (e.target.src = "/images/default-product.jpg")}
              />
              <div className="item-info">
                <p><strong>{item.name}</strong></p>
                <p>Qty: {item.quantity}</p>
                <p>₦{item.price.toFixed(2)}</p>
              </div>
              <div className="item-total">
                ₦{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <section className="order-section totals">
        <h2>Order Summary</h2>
        <p><strong>Subtotal:</strong> ₦{order.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₦{order.shippingPrice.toFixed(2)}</p>
        <p><strong>Tax:</strong> ₦{order.taxPrice.toFixed(2)}</p>
        <p className="order-total"><strong>Total:</strong> ₦{order.totalPrice.toFixed(2)}</p>
      </section>

      <footer className="order-footer">
        <button onClick={() => navigate("/")}>Continue Shopping</button>
        <button onClick={() => navigate("/orders")}>View All Orders</button>
      </footer>
    </div>
  );
};

export default OrderDetails;
