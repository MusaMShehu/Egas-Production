import React from 'react';
// import StatsCards from './StatsCards';
// import QuickActions from './QuickActions';
// import RecentOrders from './RecentOrders';
// import SubscriptionDetails from './SubscriptionDetails';
// import DeliveryStatus from './DeliveryStatus';
// import ConsumptionChart from './ConsumptionChart';
import '../../styles/DashboardPage.css'; 


const OverviewPage = ({ user }) => {
  return (
    <div className="dashboard-page">
      {/* <StatsCards user={user} /> */}
      {/* <QuickActions /> */}
      {/* <RecentOrders orders={user.recentOrders} /> */}
      
      <div className="dashboard-grid">
        {/* <SubscriptionDetails subscription={user.subscription} /> */}
        {/* <DeliveryStatus orders={user.recentOrders} /> */}
      </div>
      
      {/* <ConsumptionChart /> */}
    </div>
  );
};

export default OverviewPage;