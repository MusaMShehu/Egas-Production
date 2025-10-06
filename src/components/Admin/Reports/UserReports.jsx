import React from 'react';
// import ReportChart from './ReportChart';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const UserReports = ({ data, dateRange }) => {
  const metrics = [
    {
      title: 'Total Users',
      value: (data.totalUsers || 0).toLocaleString(),
      change: data.usersChange || 0,
      icon: 'fas fa-users',
      color: 'blue'
    },
    {
      title: 'New Registrations',
      value: (data.newUsers || 0).toLocaleString(),
      change: data.registrationChange || 0,
      icon: 'fas fa-user-plus',
      color: 'green'
    },
    {
      title: 'Active Users',
      value: (data.activeUsers || 0).toLocaleString(),
      change: data.activeChange || 0,
      icon: 'fas fa-user-check',
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: `${(data.conversionRate || 0).toFixed(1)}%`,
      change: data.conversionChange || 0,
      icon: 'fas fa-percentage',
      color: 'orange'
    }
  ];

  const chartData = {
    labels: data.dailyUsers?.map(item => item.date) || [],
    datasets: [
      {
        label: 'New Registrations',
        data: data.dailyUsers?.map(item => item.newUsers) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: 'Active Users',
        data: data.dailyUsers?.map(item => item.activeUsers) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    ]
  };

  const userDemographics = {
    labels: data.userDemographics?.map(item => item.group) || [],
    datasets: [
      {
        data: data.userDemographics?.map(item => item.count) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ]
      }
    ]
  };

  return (
    <div className="user-report">
      <div className="report-header">
        <h2>User Analytics Report</h2>
        <p className="report-period">
          {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-grid">
        <div className="chart-section">
          <ReportChart
            title="User Growth Trend"
            data={chartData}
            type="line"
            height={300}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="User Demographics"
            data={userDemographics}
            type="doughnut"
            height={300}
          />
        </div>
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>User Acquisition Sources</h3>
          <DataTable
            columns={['Source', 'Users', 'Conversion Rate', 'Cost per Acquisition']}
            rows={data.acquisitionSources?.map(source => [
              source.source,
              source.users.toLocaleString(),
              `${source.conversionRate}%`,
              `₦${source.cpa.toLocaleString()}`
            ]) || []}
          />
        </div>

        <div className="table-section">
          <h3>User Activity by Tier</h3>
          <DataTable
            columns={['User Tier', 'Users', 'Avg. Orders', 'Avg. Spend']}
            rows={data.userTiers?.map(tier => [
              tier.tier,
              tier.users.toLocaleString(),
              tier.avgOrders.toFixed(1),
              `₦${tier.avgSpend.toLocaleString()}`
            ]) || []}
          />
        </div>
      </div>
    </div>
  );
};

export default UserReports;