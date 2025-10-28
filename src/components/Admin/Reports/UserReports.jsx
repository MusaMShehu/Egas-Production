// components/reports/UserReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const UserReports = ({ 
  data, 
  dateRange, 
  filters, 
  searchQuery,
  sortConfig,
  onSort,
  viewMode = 'dashboard'
}) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [analyticsView, setAnalyticsView] = useState('growth');

  const processedData = useMemo(() => {
    if (!data) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        usersChange: 0,
        activeChange: 0,
        registrationChange: 0,
        conversionRate: 0,
        conversionChange: 0,
        dailyUsers: [],
        userDemographics: [],
        acquisitionSources: [],
        userTiers: [],
        deviceUsage: [],
        geographicData: [],
        peakTimes: [],
        acquisitionRate: 0,
        acquisitionCost: 0,
        activationRate: 0,
        timeToActivate: 0,
        retentionRate: 0,
        churnRate: 0,
        arpu: 0,
        ltv: 0,
        detailedUsers: []
      };
    }
    
    return {
      ...data,
      dailyUsers: data.dailyUsers || [],
      userDemographics: data.userDemographics || [],
      acquisitionSources: data.acquisitionSources || [],
      userTiers: data.userTiers || [],
      deviceUsage: data.deviceUsage || [],
      geographicData: data.geographicData || [],
      peakTimes: data.peakTimes || [],
      detailedUsers: data.detailedUsers || []
    };
  }, [data]);

  const growthMetrics = [
    {
      title: 'Total Users',
      value: (processedData.totalUsers || 0).toLocaleString(),
      change: processedData.usersChange || 0,
      icon: 'fas fa-users',
      color: 'blue',
      trend: (processedData.usersChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.newUsers || 0} new this period`
    },
    {
      title: 'Active Users',
      value: (processedData.activeUsers || 0).toLocaleString(),
      change: processedData.activeChange || 0,
      icon: 'fas fa-user-check',
      color: 'green',
      trend: (processedData.activeChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.dailyActive || 0} daily active`
    },
    {
      title: 'New Registrations',
      value: (processedData.newUsers || 0).toLocaleString(),
      change: processedData.registrationChange || 0,
      icon: 'fas fa-user-plus',
      color: 'purple',
      trend: (processedData.registrationChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.verifiedUsers || 0} verified`
    },
    {
      title: 'Conversion Rate',
      value: `${(processedData.conversionRate || 0).toFixed(1)}%`,
      change: processedData.conversionChange || 0,
      icon: 'fas fa-percentage',
      color: 'orange',
      trend: (processedData.conversionChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Visitor to user'
    }
  ];

  const engagementMetrics = [
    {
      title: 'Avg. Session Duration',
      value: `${(processedData.avgSessionDuration || 0).toFixed(1)}min`,
      change: processedData.sessionChange || 0,
      icon: 'fas fa-clock',
      color: 'teal',
      trend: (processedData.sessionChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Pages per Visit',
      value: (processedData.pagesPerVisit || 0).toFixed(1),
      change: processedData.pagesChange || 0,
      icon: 'fas fa-file',
      color: 'indigo',
      trend: (processedData.pagesChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Bounce Rate',
      value: `${(processedData.bounceRate || 0).toFixed(1)}%`,
      change: processedData.bounceChange || 0,
      icon: 'fas fa-sign-out-alt',
      color: 'red',
      trend: (processedData.bounceChange || 0) <= 0 ? 'down' : 'up'
    },
    {
      title: 'Returning Users',
      value: `${(processedData.returningRate || 0).toFixed(1)}%`,
      change: processedData.returningChange || 0,
      icon: 'fas fa-redo',
      color: 'green',
      trend: (processedData.returningChange || 0) >= 0 ? 'up' : 'down'
    }
  ];

  const userSegments = ['all', 'new', 'active', 'returning', 'inactive', 'premium'];

  const renderDashboardView = () => (
    <>
      <div className="user-controls">
        <div className="control-group">
          <label>User Segment:</label>
          <select 
            value={selectedSegment} 
            onChange={(e) => setSelectedSegment(e.target.value)}
          >
            {userSegments.map(segment => (
              <option key={segment} value={segment}>
                {segment === 'all' ? 'All Users' : segment.charAt(0).toUpperCase() + segment.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="analytics-view-toggle">
          <button 
            className={`view-btn ${analyticsView === 'growth' ? 'active' : ''}`}
            onClick={() => setAnalyticsView('growth')}
          >
            Growth Metrics
          </button>
          <button 
            className={`view-btn ${analyticsView === 'engagement' ? 'active' : ''}`}
            onClick={() => setAnalyticsView('engagement')}
          >
            Engagement Metrics
          </button>
        </div>
      </div>

      <MetricsGrid metrics={analyticsView === 'growth' ? growthMetrics : engagementMetrics} />

      <div className="data-tables">
        <div className="table-section">
          <div className="table-header">
            <h3>User Acquisition Sources</h3>
            <span className="table-info">
              Top performing channels
            </span>
          </div>
          <DataTable
            columns={['Source', 'Users', 'Conversion Rate', 'Cost per Acquisition', 'LTV', 'ROI']}
            rows={processedData.acquisitionSources?.map(source => [
              <div className="source-info">
                <div className="source-name">{source.source}</div>
                <div className="source-type">{source.type}</div>
              </div>,
              (source.users || 0).toLocaleString(),
              <div className="conversion-rate">
                <span className={(source.conversionRate || 0) > 5 ? 'text-green-600' : (source.conversionRate || 0) < 2 ? 'text-red-600' : ''}>
                  {(source.conversionRate || 0)}%
                </span>
              </div>,
              `₦${(source.cpa || 0).toLocaleString()}`,
              `₦${(source.ltv || 0).toLocaleString()}`,
              <div className="roi-indicator">
                <span className={(source.roi || 0) > 300 ? 'text-green-600' : (source.roi || 0) < 100 ? 'text-red-600' : ''}>
                  {(source.roi || 0)}%
                </span>
              </div>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>

        <div className="table-section">
          <h3>User Activity by Tier</h3>
          <DataTable
            columns={['User Tier', 'Users', 'Avg. Sessions', 'Avg. Orders', 'Avg. Spend', 'Retention Rate']}
            rows={processedData.userTiers?.map(tier => [
              <div className="tier-info">
                <div className="tier-name">{tier.tier}</div>
                <div className="tier-criteria">{tier.criteria}</div>
              </div>,
              (tier.users || 0).toLocaleString(),
              (tier.avgSessions || 0).toFixed(1),
              (tier.avgOrders || 0).toFixed(1),
              `₦${(tier.avgSpend || 0).toLocaleString()}`,
              <div className="retention-rate">
                <div className="rate-bar">
                  <div 
                    className="rate-fill" 
                    style={{ width: `${tier.retentionRate || 0}%` }}
                  ></div>
                </div>
                <span>{(tier.retentionRate || 0)}%</span>
              </div>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>
      </div>

      {/* User Behavior Insights */}
      <div className="behavior-insights">
        <h3>User Behavior & Patterns</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <i className="fas fa-mobile-alt"></i>
            <div className="insight-content">
              <h4>Device Usage</h4>
              <div className="device-breakdown">
                {processedData.deviceUsage?.map(device => (
                  <div key={device.type} className="device-item">
                    <span className="device-type">{device.type}</span>
                    <span className="device-percentage">{device.percentage}%</span>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
          
          <div className="insight-card">
            <i className="fas fa-map-marker-alt"></i>
            <div className="insight-content">
              <h4>Geographic Distribution</h4>
              <div className="location-breakdown">
                {processedData.geographicData?.slice(0, 5).map(location => (
                  <div key={location.region} className="location-item">
                    <span className="location-name">{location.region}</span>
                    <span className="location-users">{location.users} users</span>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
          
          <div className="insight-card">
            <i className="fas fa-chart-bar"></i>
            <div className="insight-content">
              <h4>Peak Activity Times</h4>
              <div className="activity-times">
                {processedData.peakTimes?.map(time => (
                  <div key={time.hour} className="time-slot">
                    <span className="time-hour">{time.hour}:00</span>
                    <span className="time-activity">{time.activity}% active</span>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Lifecycle */}
      <div className="lifecycle-analysis">
        <h3>User Lifecycle Analysis</h3>
        <div className="lifecycle-stages">
          <div className="stage-card">
            <div className="stage-header acquisition">
              <i className="fas fa-bullseye"></i>
              <h4>Acquisition</h4>
            </div>
            <div className="stage-metrics">
              <div className="stage-metric">
                <span className="metric-value">{processedData.acquisitionRate || 0}%</span>
                <span className="metric-label">Conversion Rate</span>
              </div>
              <div className="stage-metric">
                <span className="metric-value">₦{(processedData.acquisitionCost || 0).toLocaleString()}</span>
                <span className="metric-label">Avg. Cost</span>
              </div>
            </div>
          </div>
          
          <div className="stage-card">
            <div className="stage-header activation">
              <i className="fas fa-play-circle"></i>
              <h4>Activation</h4>
            </div>
            <div className="stage-metrics">
              <div className="stage-metric">
                <span className="metric-value">{processedData.activationRate || 0}%</span>
                <span className="metric-label">Activation Rate</span>
              </div>
              <div className="stage-metric">
                <span className="metric-value">{processedData.timeToActivate || 0} days</span>
                <span className="metric-label">Time to Activate</span>
              </div>
            </div>
          </div>
          
          <div className="stage-card">
            <div className="stage-header retention">
              <i className="fas fa-redo"></i>
              <h4>Retention</h4>
            </div>
            <div className="stage-metrics">
              <div className="stage-metric">
                <span className="metric-value">{processedData.retentionRate || 0}%</span>
                <span className="metric-label">30-day Retention</span>
              </div>
              <div className="stage-metric">
                <span className="metric-value">{processedData.churnRate || 0}%</span>
                <span className="metric-label">Churn Rate</span>
              </div>
            </div>
          </div>
          
          <div className="stage-card">
            <div className="stage-header revenue">
              <i className="fas fa-dollar-sign"></i>
              <h4>Revenue</h4>
            </div>
            <div className="stage-metrics">
              <div className="stage-metric">
                <span className="metric-value">₦{(processedData.arpu || 0).toLocaleString()}</span>
                <span className="metric-label">ARPU</span>
              </div>
              <div className="stage-metric">
                <span className="metric-value">₦{(processedData.ltv || 0).toLocaleString()}</span>
                <span className="metric-label">Lifetime Value</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailedView = () => (
    <div className="detailed-view">
      <DataTable
        columns={[
          'User ID', 'Name', 'Email', 'Signup Date', 'Last Active',
          'Status', 'Orders', 'Total Spend', 'User Tier', 'Actions'
        ]}
        rows={processedData.detailedUsers?.map(user => [
          <div className="user-id">{user.id}</div>,
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-phone">{user.phone}</div>
          </div>,
          user.email,
          new Date(user.signupDate).toLocaleDateString(),
          <div className="last-active">
            {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
            {user.isOnline && <span className="online-indicator"></span>}
          </div>,
          <span className={`status-badge ${(user.status || 'inactive').toLowerCase()}`}>
            {user.status}
          </span>,
          user.orders || 0,
          `₦${(user.totalSpend || 0).toLocaleString()}`,
          <span className={`user-tier ${(user.tier || 'bronze').toLowerCase()}`}>
            {user.tier}
          </span>,
          <div className="user-actions">
            <button className="btn-action-small" title="View Profile">
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn-action-small" title="Edit User">
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn-action-small" title="Message User">
              <i className="fas fa-envelope"></i>
            </button>
          </div>
        ]) || []}
        sortable={true}
        searchable={true}
        pagination={true}
        itemsPerPage={25}
        selectable={true}
      />
    </div>
  );

  return (
    <div className="user-report">
      <div className="report-header">
        <div className="header-content">
          <h2>User Analytics Dashboard</h2>
          <p className="report-period">
            {dateRange?.startDate?.toLocaleDateString() || 'N/A'} - {dateRange?.endDate?.toLocaleDateString() || 'N/A'}
          </p>
        </div>
        <div className="report-actions">
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="summary-label">User Satisfaction</div>
              <div className="summary-value">
                {(processedData.satisfactionScore || 0).toFixed(1)}/5
              </div>
            </div>
            <div className="summary-card success">
              <div className="summary-label">Net Promoter Score</div>
              <div className="summary-value">
                {processedData.npsScore || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' ? renderDashboardView() : renderDetailedView()}
    </div>
  );
};

export default UserReports;