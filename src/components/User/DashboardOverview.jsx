// components/DashboardOverview.js
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaFire,
  FaRedo,
  FaWallet,
  FaHeadset,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardOverview.css";

const BASE_URL = "http://localhost:5000";

const DashboardOverview = () => {
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Get logged in user + token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Axios config with Authorization header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Calculate next delivery from subscription
  const calculateNextDelivery = (sub) => {
    if (!sub) return null;
    const startDate = new Date(sub.startDate);
    const now = new Date();
    let next = new Date(startDate);

    while (next <= now) {
      if (sub.frequency === "weekly") next.setDate(next.getDate() + 7);
      if (sub.frequency === "biweekly") next.setDate(next.getDate() + 14);
      if (sub.frequency === "monthly") next.setMonth(next.getMonth() + 1);
    }
    return next.toLocaleDateString();
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [walletRes, ordersRes, subsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/dashboard/wallet`, axiosConfig),
          axios.get(`${BASE_URL}/api/v1/dashboard/orders?limit=3`, axiosConfig),
          axios.get(`${BASE_URL}/api/v1/dashboard/subscriptions?limit=3`, axiosConfig),
        ]);

        setBalance(walletRes.data.balance || 0);
        setOrders(ordersRes.data.data || []);
        setSubscriptions(subsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      navigate("/login"); // redirect if not logged in
    }
  }, [token, navigate]);

  const refreshBalance = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/dashboard/wallet/refresh`,
        axiosConfig
      );
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Failed to refresh balance", error);
    }
  };

  const activeSubscription = subscriptions.find(
    (sub) => sub?.status?.toLowerCase() === "active"
  );
  const nextDelivery = calculateNextDelivery(activeSubscription);

  const quickActions = [
    {
      icon: <FaFire />,
      text: "Order Gas",
      onClick: () => navigate("/dashboard/orders"),
    },
    {
      icon: <FaRedo />,
      text: "Manage Subscription",
      onClick: () => navigate("/dashboard/subscriptions"),
    },
    { icon: <FaWallet />, text: "Top Up Wallet", onClick: () => navigate("/wallet") },
    {
      icon: <FaHeadset />,
      text: "Contact Support",
      onClick: () => navigate("/dashboard/support"),
    },
  ];

  if (loading) {
    return <div className="overview-loading">Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="overview-dashboard-header">
        <h1>Welcome, {user?.firstName || "Customer"} 👋</h1>
        <div className="overview-search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Type here to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="overview-stats-container">
        <div className="overview-stat-card">
          <h3>Active Orders</h3>
          <div className="overview-value">
            {orders.filter((order) => order?.status?.toLowerCase() === "active").length}
          </div>
        </div>
        <div className="overview-stat-card">
          <h3>Upcoming Deliveries</h3>
          <div className="overview-value">{nextDelivery ? 1 : 0}</div>
          {nextDelivery && <p>Next: {nextDelivery}</p>}
        </div>
        <div className="overview-stat-card">
          <h3>Subscription Status</h3>
          <div className="overview-value">{activeSubscription?.status || "None"}</div>
          {activeSubscription && (
            <span
              className={`overview-status ${
                activeSubscription?.status?.toLowerCase() === "active"
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              {activeSubscription.plan}
            </span>
          )}
        </div>
        <div className="overview-stat-card">
          <h3>Account Balance</h3>
          <div className="overview-value">₦{balance.toLocaleString()}</div>
          <button className="overview-refresh-btn" onClick={refreshBalance}>
            <FaSyncAlt /> Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="overview-quick-actions">
        {quickActions.map((action, index) => (
          <button key={index} className="overview-action-btn" onClick={action.onClick}>
            {action.icon}
            <span>{action.text}</span>
          </button>
        ))}
      </div>

      {/* Subscriptions Section */}
      {subscriptions.length > 0 && (
        <div className="overview-subscription-container">
          <h2>Recent Subscriptions</h2>
          <table className="overview-subscription-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Next Renewal</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub, index) => {
                const status = sub?.status?.toLowerCase() || "unknown";
                return (
                  <tr key={index}>
                    <td>{sub?.plan || "N/A"}</td>
                    <td className={`overview-status-${status}`}>{sub?.status || "N/A"}</td>
                    <td>{sub?.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}</td>
                    <td>{sub?.nextRenewal ? new Date(sub.nextRenewal).toLocaleDateString() : "N/A"}</td>
                    <td>₦{sub?.amount?.toLocaleString() || "0"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Section */}
      <div className="overview-orders-container">
        <h2>Recent Orders</h2>
        <table className="overview-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => {
                const status = order?.status?.toLowerCase() || "unknown";
                return (
                  <tr key={index}>
                    <td>{order?._id}</td>
                    <td>
                      {order?.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {order?.products?.map((p) => p?.product?.name || "Unnamed").join(", ")}
                    </td>
                    <td>
                      {order?.products?.reduce((sum, p) => sum + (p?.quantity || 0), 0)}
                    </td>
                    <td>₦{order?.totalAmount?.toLocaleString() || "0"}</td>
                    <td className={`overview-status-${status}`}>{order?.status || "N/A"}</td>
                    <td>
                      <button
                        className="overview-track-btn"
                        onClick={() => navigate(`/orders/${order?._id}`)}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">No recent orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverview;
