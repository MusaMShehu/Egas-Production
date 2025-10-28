// components/reports/SubscriptionReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const SubscriptionReports = ({ 
  data, 
  dateRange, 
  filters, 
  searchQuery,
  sortConfig,
  onSort,
  viewMode = 'dashboard'
}) => {
  const [selectedPlanType, setSelectedPlanType] = useState('all');
  const [metricView, setMetricView] = useState('overview');

  const processedData = useMemo(() => {
    if (!data) {
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        mrr: 0,
        renewalRate: 0,
        churnRate: 0,
        arpu: 0,
        subscriptionsChange: 0,
        activeChange: 0,
        mrrChange: 0,
        renewalChange: 0,
        churnChange: 0,
        arpuChange: 0,
        ltv: 0,
        ltvChange: 0,
        cac: 0,
        cacChange: 0,
        ltvCacRatio: 0,
        ratioChange: 0,
        subscriptionTrend: [],
        planDistribution: [],
        revenueTrend: [],
        planPerformance: [],
        upcomingRenewals: [],
        retentionRate: 0,
        retentionChange: 0,
        netGrowth: 0,
        growthRate: 0,
        revenueHealth: 0,
        revenueGrowth: 0,
        churnReasons: [],
        atRiskSubscriptions: [],
        detailedSubscriptions: []
      };
    }
    
    return {
      ...data,
      subscriptionTrend: data.subscriptionTrend || [],
      planDistribution: data.planDistribution || [],
      revenueTrend: data.revenueTrend || [],
      planPerformance: data.planPerformance || [],
      upcomingRenewals: data.upcomingRenewals || [],
      churnReasons: data.churnReasons || [],
      atRiskSubscriptions: data.atRiskSubscriptions || [],
      detailedSubscriptions: data.detailedSubscriptions || []
    };
  }, [data]);

  const metrics = [
    {
      title: 'Total Subscriptions',
      value: (processedData.totalSubscriptions || 0).toLocaleString(),
      change: processedData.subscriptionsChange || 0,
      icon: 'fas fa-calendar-check',
      color: 'blue',
      trend: (processedData.subscriptionsChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.activeSubscriptions || 0} active`
    },
    {
      title: 'Active Subscriptions',
      value: (processedData.activeSubscriptions || 0).toLocaleString(),
      change: processedData.activeChange || 0,
      icon: 'fas fa-user-clock',
      color: 'green',
      trend: (processedData.activeChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.trialSubscriptions || 0} trials`
    },
    {
      title: 'Monthly Recurring Revenue',
      value: `₦${(processedData.mrr || 0).toLocaleString()}`,
      change: processedData.mrrChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'purple',
      trend: (processedData.mrrChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Recurring revenue'
    },
    {
      title: 'Renewal Rate',
      value: `${(processedData.renewalRate || 0).toFixed(1)}%`,
      change: processedData.renewalChange || 0,
      icon: 'fas fa-sync',
      color: 'orange',
      trend: (processedData.renewalChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Successful renewals'
    },
    {
      title: 'Churn Rate',
      value: `${(processedData.churnRate || 0).toFixed(1)}%`,
      change: processedData.churnChange || 0,
      icon: 'fas fa-running',
      color: 'red',
      trend: (processedData.churnChange || 0) <= 0 ? 'down' : 'up',
      subtitle: 'Customer attrition'
    },
    {
      title: 'Avg. Revenue Per User',
      value: `₦${(processedData.arpu || 0).toLocaleString()}`,
      change: processedData.arpuChange || 0,
      icon: 'fas fa-chart-line',
      color: 'teal',
      trend: (processedData.arpuChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Per active user'
    }
  ];

  const revenueMetrics = [
    {
      title: 'Lifetime Value',
      value: `₦${(processedData.ltv || 0).toLocaleString()}`,
      change: processedData.ltvChange || 0,
      icon: 'fas fa-gem',
      color: 'purple',
      trend: (processedData.ltvChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Customer Acquisition Cost',
      value: `₦${(processedData.cac || 0).toLocaleString()}`,
      change: processedData.cacChange || 0,
      icon: 'fas fa-tag',
      color: 'orange',
      trend: (processedData.cacChange || 0) <= 0 ? 'down' : 'up'
    },
    {
      title: 'LTV to CAC Ratio',
      value: (processedData.ltvCacRatio || 0).toFixed(1),
      change: processedData.ratioChange || 0,
      icon: 'fas fa-balance-scale',
      color: 'green',
      trend: (processedData.ratioChange || 0) >= 0 ? 'up' : 'down'
    }
  ];

  const planTypes = ['all', 'custom', 'one-time', 'emergency', 'preset'];

  const renderDashboardView = () => (
    <>
      <div className="subscription-controls">
        <div className="control-group">
          <label>Plan Type:</label>
          <select 
            value={selectedPlanType} 
            onChange={(e) => setSelectedPlanType(e.target.value)}
          >
            {planTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Plan Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="metric-view-toggle">
          <button 
            className={`view-btn ${metricView === 'overview' ? 'active' : ''}`}
            onClick={() => setMetricView('overview')}
          >
            Overview
          </button>
          <button 
            className={`view-btn ${metricView === 'revenue' ? 'active' : ''}`}
            onClick={() => setMetricView('revenue')}
          >
            Revenue Metrics
          </button>
        </div>
      </div>

      <MetricsGrid metrics={metricView === 'overview' ? metrics : revenueMetrics} />

      <div className="data-tables">
        <div className="table-section">
          <div className="table-header">
            <h3>Subscription Performance by Plan</h3>
            <span className="table-info">
              {processedData.planPerformance?.length || 0} active plans
            </span>
          </div>
          <DataTable
            columns={['Plan Name', 'Type', 'Subscribers', 'MRR', 'Churn Rate', 'LTV', 'Health Score']}
            rows={processedData.planPerformance?.map(plan => [
              <div className="plan-info">
                <div className="plan-name">{plan.name}</div>
                <div className="plan-frequency">{plan.frequency}</div>
              </div>,
              <span className={`plan-type ${plan.type}`}>
                {plan.type}
              </span>,
              (plan.subscribers || 0).toLocaleString(),
              `₦${(plan.mrr || 0).toLocaleString()}`,
              <div className="churn-indicator">
                <span className={(plan.churnRate || 0) < 5 ? 'text-green-600' : (plan.churnRate || 0) > 15 ? 'text-red-600' : 'text-yellow-600'}>
                  {(plan.churnRate || 0)}%
                </span>
              </div>,
              `₦${(plan.ltv || 0).toLocaleString()}`,
              <div className="health-score">
                <div className="score-bar">
                  <div 
                    className={`score-fill ${(plan.healthScore || 0) > 80 ? 'excellent' : (plan.healthScore || 0) > 60 ? 'good' : 'poor'}`}
                    style={{ width: `${plan.healthScore || 0}%` }}
                  ></div>
                </div>
                <span>{(plan.healthScore || 0)}%</span>
              </div>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>

        <div className="table-section">
          <h3>Upcoming Renewals & Expirations</h3>
          <DataTable
            columns={['Customer', 'Plan', 'Renewal Date', 'Amount', 'Status', 'Auto-Renew', 'Action']}
            rows={processedData.upcomingRenewals?.map(renewal => [
              <div className="customer-info">
                <div className="customer-name">{renewal.customer}</div>
                <div className="customer-email">{renewal.email}</div>
              </div>,
              renewal.plan,
              <div className="date-info">
                <div className="renewal-date">
                  {new Date(renewal.renewalDate).toLocaleDateString()}
                </div>
                <div className="days-away">
                  {renewal.daysUntilRenewal} days
                </div>
              </div>,
              `₦${(renewal.amount || 0).toLocaleString()}`,
              <span className={`status-badge ${(renewal.status || 'active').toLowerCase()}`}>
                {renewal.status}
              </span>,
              <div className="auto-renew">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={renewal.autoRenew}
                    onChange={() => {/* Handle toggle */}}
                  />
                  <span className="slider"></span>
                </label>
              </div>,
              <div className="renewal-actions">
                <button className="btn-action-small" title="Send Reminder">
                  <i className="fas fa-bell"></i>
                </button>
                <button className="btn-action-small" title="View Details">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
            itemsPerPage={8}
          />
        </div>
      </div>

      {/* Subscription Health */}
      <div className="health-metrics">
        <h3>Subscription Health Dashboard</h3>
        <div className="health-grid">
          <div className="health-card">
            <div className="health-header">
              <i className="fas fa-heartbeat"></i>
              <h4>Retention Health</h4>
            </div>
            <div className="health-content">
              <div className="health-metric">
                <span className="metric-value">{processedData.retentionRate || 0}%</span>
                <span className="metric-label">Retention Rate</span>
              </div>
              <div className={`health-trend ${(processedData.retentionChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${(processedData.retentionChange || 0) >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(processedData.retentionChange || 0)}%
              </div>
            </div>
          </div>
          
          <div className="health-card">
            <div className="health-header">
              <i className="fas fa-chart-line"></i>
              <h4>Growth Health</h4>
            </div>
            <div className="health-content">
              <div className="health-metric">
                <span className="metric-value">{processedData.netGrowth || 0}</span>
                <span className="metric-label">Net Growth</span>
              </div>
              <div className={`health-trend ${(processedData.growthRate || 0) >= 0 ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${(processedData.growthRate || 0) >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(processedData.growthRate || 0)}%
              </div>
            </div>
          </div>
          
          <div className="health-card">
            <div className="health-header">
              <i className="fas fa-dollar-sign"></i>
              <h4>Revenue Health</h4>
            </div>
            <div className="health-content">
              <div className="health-metric">
                <span className="metric-value">{processedData.revenueHealth || 0}%</span>
                <span className="metric-label">Revenue Health</span>
              </div>
              <div className={`health-trend ${(processedData.revenueGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${(processedData.revenueGrowth || 0) >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(processedData.revenueGrowth || 0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Churn Analysis */}
      <div className="churn-analysis">
        <h3>Churn Analysis & Prevention</h3>
        <div className="churn-grid">
          <div className="churn-card">
            <h4>Top Churn Reasons</h4>
            <div className="churn-reasons">
              {processedData.churnReasons?.map((reason, index) => (
                <div key={index} className="churn-reason">
                  <span className="reason-text">{reason.reason}</span>
                  <span className="reason-percentage">{reason.percentage}%</span>
                </div>
              )) || []}
            </div>
          </div>
          
          <div className="churn-card">
            <h4>At-Risk Subscriptions</h4>
            <div className="at-risk-list">
              {processedData.atRiskSubscriptions?.map((subscription, index) => (
                <div key={index} className="risk-item">
                  <div className="risk-customer">{subscription.customer}</div>
                  <div className="risk-level">
                    <span className={`risk-badge ${subscription.riskLevel}`}>
                      {subscription.riskLevel}
                    </span>
                  </div>
                  <button className="btn-action-small">
                    <i className="fas fa-life-ring"></i>
                    Intervene
                  </button>
                </div>
              )) || []}
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
          'Subscription ID', 'Customer', 'Plan', 'Start Date', 'End Date',
          'Status', 'MRR', 'Total Value', 'Renewal Date', 'Actions'
        ]}
        rows={processedData.detailedSubscriptions?.map(sub => [
          <div className="subscription-id">{sub.id}</div>,
          <div className="customer-info">
            <div className="customer-name">{sub.customer}</div>
            <div className="customer-email">{sub.email}</div>
          </div>,
          <div className="plan-info">
            <div className="plan-name">{sub.plan}</div>
            <div className="plan-type">{sub.type}</div>
          </div>,
          new Date(sub.startDate).toLocaleDateString(),
          new Date(sub.endDate).toLocaleDateString(),
          <span className={`status-badge ${(sub.status || 'active').toLowerCase()}`}>
            {sub.status}
          </span>,
          `₦${(sub.mrr || 0).toLocaleString()}`,
          `₦${(sub.totalValue || 0).toLocaleString()}`,
          new Date(sub.renewalDate).toLocaleDateString(),
          <div className="subscription-actions">
            <button className="btn-action-small" title="View Details">
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn-action-small" title="Edit Subscription">
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn-action-small" title="Renewal History">
              <i className="fas fa-history"></i>
            </button>
          </div>
        ]) || []}
        sortable={true}
        searchable={true}
        pagination={true}
        itemsPerPage={20}
        selectable={true}
      />
    </div>
  );

  return (
    <div className="subscription-report">
      <div className="report-header">
        <div className="header-content">
          <h2>Subscription Analytics Dashboard</h2>
          <p className="report-period">
            {dateRange?.startDate?.toLocaleDateString() || 'N/A'} - {dateRange?.endDate?.toLocaleDateString() || 'N/A'}
          </p>
        </div>
        <div className="report-actions">
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="summary-label">Net Revenue Retention</div>
              <div className="summary-value">
                {(processedData.netRevenueRetention || 0).toFixed(1)}%
              </div>
            </div>
            <div className="summary-card success">
              <div className="summary-label">Quick Ratio</div>
              <div className="summary-value">
                {(processedData.quickRatio || 0).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' ? renderDashboardView() : renderDetailedView()}
    </div>
  );
};

export default SubscriptionReports;