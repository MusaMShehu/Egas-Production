import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaExclamationCircle,
  FaWallet,
  FaCalendarAlt,
  FaChartLine,
  FaReceipt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./UserPayment.css";

const Payments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const API_BASE_URL = "https://egas-server-1.onrender.com/api/v1";

  const getAuthToken = () => localStorage.getItem("token");
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // ✅ Fetch Payment History
  const fetchPaymentHistory = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/wallet/history?page=${page}&limit=${limit}`,
        { headers: getHeaders() }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setPaymentHistory(data.data || []);
      setPagination(data.pagination || {});

      // Spending calculations
      if (data.data) {
        let total = 0;
        let monthly = 0;
        const now = new Date();
        data.data.forEach((tx) => {
          if (tx.status === "success") {
            total += tx.amount;
            const txDate = new Date(tx.createdAt);
            if (
              txDate.getMonth() === now.getMonth() &&
              txDate.getFullYear() === now.getFullYear()
            ) {
              monthly += tx.amount;
            }
          }
        });
        setTotalSpending(total);
        setMonthlySpending(monthly);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setError("Failed to load payment history");
    }
  }, []);

  // ✅ Fetch Wallet Balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/wallet/balance`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setError("Failed to load wallet balance");
    }
  }, []);

  // ✅ Verify redirect after Paystack payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    if (reference) {
      const verifyTopup = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/payments/wallet/verify?reference=${reference}`,
            { headers: getHeaders() }
          );
          const data = await response.json();
          if (data.success) {
            setWalletBalance(data.walletBalance);
            await fetchPaymentHistory(1);
            alert("Wallet top-up successful!");
          }
        } catch (err) {
          console.error("Verification failed:", err);
        } finally {
          window.history.replaceState(null, "", window.location.pathname);
        }
      };
      verifyTopup();
    }
  }, [fetchPaymentHistory]);

  // ✅ Load Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPaymentHistory(1), fetchWalletBalance()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchPaymentHistory, fetchWalletBalance]);

  // ✅ Handle Top-up
  const handleTopUp = async () => {
    if (topUpAmount < 1000) {
      setError("Minimum top-up amount is ₦1,000");
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/payments/wallet/topup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ amount: topUpAmount }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Top-up failed");

      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        throw new Error("Paystack authorization URL not received");
      }
    } catch (error) {
      console.error("Error processing top-up:", error);
      setError(error.message || "Failed to process top-up.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Helper formatters
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatCurrency = (amount) => `₦${amount?.toLocaleString() || "0"}`;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchPaymentHistory(newPage);
  };

  // ✅ UI Render
  if (isLoading) {
    return (
      <div className="pay-payments-page loading">
        <div className="pay-loading-spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }

  return (
    <div className="pay-payments-page">
      <div className="pay-dashboard-header">
        <h1>Payment Management</h1>
        <div className="pay-header-actions">
          <div className="pay-search-bar">
            <FaSearch className="pay-search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="pay-btn-primary" onClick={() => setShowTopUpModal(true)}>
            <FaPlus className="pay-btn-icon" /> Top Up Wallet
          </button>
        </div>
      </div>

      {error && (
        <div className="pay-error-message">
          <FaExclamationCircle className="pay-error-icon" /> {error}
          <button onClick={() => setError("")} className="pay-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Wallet Stats */}
      <div className="pay-stats-container">
        <div className="pay-stat-card">
          <FaWallet /> <h3>Wallet Balance</h3>
          <p>{formatCurrency(walletBalance)}</p>
        </div>
        <div className="pay-stat-card">
          <FaCalendarAlt /> <h3>This Month</h3>
          <p>{formatCurrency(monthlySpending)}</p>
        </div>
        <div className="pay-stat-card">
          <FaChartLine /> <h3>Total Spending</h3>
          <p>{formatCurrency(totalSpending)}</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="pay-content-section">
        <h2>Payment History</h2>
        {paymentHistory.length === 0 ? (
          <div className="pay-no-payments">
            <FaReceipt /> <p>No payment history found</p>
          </div>
        ) : (
          <div className="pay-table-container">
            <table className="pay-payments-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p) => (
                  <tr key={p._id || p.reference}>
                    <td>{p.reference}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>{p.type}</td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="pay-payment-modal-overlay">
          <div className="pay-payment-modal-content">
            <div className="pay-payment-modal-header">
              <h2>Top Up Wallet</h2>
              <button onClick={() => setShowTopUpModal(false)} className="pay-close-btn">
                <FaTimes />
              </button>
            </div>
            <div className="pay-payment-modal-body">
              <label htmlFor="amount">Amount (₦)</label>
              <input
                type="number"
                id="amount"
                value={topUpAmount}
                min="1000"
                onChange={(e) => setTopUpAmount(parseInt(e.target.value) || 0)}
              />
              <small>Minimum ₦1,000</small>
            </div>
            <div className="pay-payment-modal-footer">
              <button onClick={() => setShowTopUpModal(false)}>Cancel</button>
              <button onClick={handleTopUp} disabled={isProcessing || topUpAmount < 1000}>
                {isProcessing ? "Processing..." : `Top Up ${formatCurrency(topUpAmount)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
