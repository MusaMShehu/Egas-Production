// components/Dashboard.js
import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUsers, FaMoneyBillWave, FaFire } from "react-icons/fa";
import StatsCard from "./AdminStatsCard";
// import ChartComponent from './AdminChartComponents';
import ActivityList from "./AdminActivityList";
import RecentOrders from "./AdminRecentOrders";
import "./Admin.css"; // 👈 external CSS

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todaysOrders: 0,
    activeUsers: 0,
    todayRevenue: 0,
    cylinderStock: 0,
    ordersChange: 0,
    usersChange: 0,
    revenueChange: 0,
    stockChange: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Replace with actual API call
      const statsResponse = await fetch("http://localhost:5000/api/v1/admin/dashboard");
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Real-time Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={<FaShoppingCart className="stat-icon blue" />}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          change={stats.usersChange}
          icon={<FaUsers className="stat-icon green" />}
        />
        <StatsCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          change={stats.subscriptionChange}
          icon={<FaUsers className="stat-icon green" />}
        />
        <StatsCard
          title="Today's Revenue"
          value={`₦${stats.todaysRevenue}`}
          change={stats.revenueChange}
          icon={<FaMoneyBillWave className="stat-icon purple" />}
        />
        <StatsCard
          title="Cylinders Stock"
          value={stats.inventoryLevel}
          change={stats.stockChange}
          icon={<FaFire className="stat-icon yellow" />}
        />
        <StatsCard
          title="Today's Orders"
          value={`₦${stats.todaysOrders}`}
          change={stats.ordersChange}
          icon={<FaMoneyBillWave className="stat-icon purple" />}
        />
      </div>

      {/* Recent Activity Section */}
      <ActivityList />

      {/* Recent Orders Section */}
      <RecentOrders />
    </div>
  );
};

export default Dashboard;
