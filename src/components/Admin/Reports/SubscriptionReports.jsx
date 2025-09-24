// components/reports/SubscriptionReports.js
import React from 'react';
// import ReportChart from './ReportChart';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const SubscriptionReports = ({ data, dateRange }) => {
  const metrics = [
    {
      title: 'Total Subscriptions',
      value: (data.totalSubscriptions || 0).toLocaleString(),
      change: data.subscriptionsChange || 0,
      icon: 'fas fa-calendar-check',
      color: 'blue'
    },
    {
      title: 'Active Subscriptions',
      value: (data.activeSubscriptions || 0).toLocaleString(),
      change: data.activeChange || 0,
      icon: 'fas fa-user-clock',
      color: 'green'
    },
    {
      title: 'Renewal Rate',
      value: `${(data.renewalRate || 0).toFixed(1)}%`,
      change: data.renewalChange || 0,
      icon: 'fas fa-sync',
      color: 'purple'
    },
    {
      title: 'Avg. Revenue per User',
      value: `₦${(data.arpu || 0).toLocaleString()}`,
      change: data.arpuChange || 0,
      icon: 'fas fa-money-bill',
      color: 'orange'
    }
  ];

  const subscriptionTrendData = {
    labels: data.subscriptionTrend?.map(item => item.period) || [],
    datasets: [
      {
        label: 'New Subscriptions',
        data: data.subscriptionTrend?.map(item => item.new) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: 'Cancellations',
        data: data.subscriptionTrend?.map(item => item.cancelled) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }
    ]
  };

  const planDistribution = {
    labels: data.planDistribution?.map(item => item.plan) || [],
    datasets: [
      {
        data: data.planDistribution?.map(item => item.percentage) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ]
      }
    ]
  };

  return (
    <div className="subscription-report">
      <div className="report-header">
        <h2>Subscription Analytics Report</h2>
        <p className="report-period">
          {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-grid">
        <div className="chart-section">
          <ReportChart
            title="Subscription Trends"
            data={subscriptionTrendData}
            type="line"
            height={300}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="Plan Distribution"
            data={planDistribution}
            type="doughnut"
            height={300}
          />
        </div>
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>Subscription Performance by Plan</h3>
          <DataTable
            columns={['Plan', 'Subscribers', 'MRR', 'Churn Rate', 'LTV']}
            rows={data.planPerformance?.map(plan => [
              plan.name,
              plan.subscribers.toLocaleString(),
              `₦${plan.mrr.toLocaleString()}`,
              `${plan.churnRate}%`,
              `₦${plan.ltv.toLocaleString()}`
            ]) || []}
          />
        </div>

        <div className="table-section">
          <h3>Upcoming Renewals</h3>
          <DataTable
            columns={['Customer', 'Plan', 'Renewal Date', 'Amount', 'Status']}
            rows={data.upcomingRenewals?.map(renewal => [
              renewal.customer,
              renewal.plan,
              new Date(renewal.renewalDate).toLocaleDateString(),
              `₦${renewal.amount.toLocaleString()}`,
              <span className={`status-badge ${renewal.status.toLowerCase()}`}>
                {renewal.status}
              </span>
            ]) || []}
            pagination={true}
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionReports;