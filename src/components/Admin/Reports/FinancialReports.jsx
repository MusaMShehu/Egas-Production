// components/reports/FinancialReports.js
import React, { useMemo } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const FinancialReports = ({ 
  data, 
  dateRange, 
  filters, 
  searchQuery,
  sortConfig,
  onSort,
  viewMode = 'dashboard'
}) => {
  const processedData = useMemo(() => {
    if (!data) {
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        cashFlow: 0,
        roi: 0,
        revenueChange: 0,
        expensesChange: 0,
        profitChange: 0,
        marginChange: 0,
        cashFlowChange: 0,
        roiChange: 0,
        grossProfit: 0,
        operatingIncome: 0,
        monthlyFinancials: [],
        incomeStatement: [],
        expenseBreakdown: [],
        financialRatios: [],
        detailedFinancials: []
      };
    }
    
    return {
      ...data,
      monthlyFinancials: data.monthlyFinancials || [],
      incomeStatement: data.incomeStatement || [],
      expenseBreakdown: data.expenseBreakdown || [],
      financialRatios: data.financialRatios || [],
      detailedFinancials: data.detailedFinancials || []
    };
  }, [data]);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₦${(processedData.totalRevenue || 0).toLocaleString()}`,
      change: processedData.revenueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green',
      trend: (processedData.revenueChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Expenses',
      value: `₦${(processedData.totalExpenses || 0).toLocaleString()}`,
      change: processedData.expensesChange || 0,
      icon: 'fas fa-file-invoice-dollar',
      color: 'red',
      trend: (processedData.expensesChange || 0) <= 0 ? 'down' : 'up'
    },
    {
      title: 'Net Profit',
      value: `₦${(processedData.netProfit || 0).toLocaleString()}`,
      change: processedData.profitChange || 0,
      icon: 'fas fa-chart-line',
      color: 'blue',
      trend: (processedData.profitChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Profit Margin',
      value: `${(processedData.profitMargin || 0).toFixed(1)}%`,
      change: processedData.marginChange || 0,
      icon: 'fas fa-percent',
      color: 'purple',
      trend: (processedData.marginChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Operating Cash Flow',
      value: `₦${(processedData.cashFlow || 0).toLocaleString()}`,
      change: processedData.cashFlowChange || 0,
      icon: 'fas fa-exchange-alt',
      color: 'teal',
      trend: (processedData.cashFlowChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'ROI',
      value: `${(processedData.roi || 0).toFixed(1)}%`,
      change: processedData.roiChange || 0,
      icon: 'fas fa-chart-pie',
      color: 'orange',
      trend: (processedData.roiChange || 0) >= 0 ? 'up' : 'down'
    }
  ];

  const renderDashboardView = () => (
    <>
      <MetricsGrid metrics={metrics} />

      <div className="data-tables">
        <div className="table-section">
          <h3>Income Statement Summary</h3>
          <DataTable
            columns={['Category', 'Amount', 'Percentage', 'Trend']}
            rows={processedData.incomeStatement?.map(item => [
              item.category,
              `₦${(item.amount || 0).toLocaleString()}`,
              `${item.percentage}%`,
              <span className={`trend-indicator ${(item.trend || 0) >= 0 ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${(item.trend || 0) >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(item.trend || 0)}%
              </span>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>

        <div className="table-section">
          <h3>Expense Breakdown</h3>
          <DataTable
            columns={['Expense Category', 'Amount', 'Budget', 'Variance', 'Status']}
            rows={processedData.expenseBreakdown?.map(expense => [
              expense.category,
              `₦${(expense.amount || 0).toLocaleString()}`,
              `₦${(expense.budget || 0).toLocaleString()}`,
              <span className={(expense.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {(expense.variance || 0) >= 0 ? '+' : ''}{(expense.variance || 0)}%
              </span>,
              <span className={`status-badge ${(expense.status || 'on-budget').toLowerCase()}`}>
                {expense.status}
              </span>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>
      </div>

      <div className="financial-summary">
        <h3>Key Financial Ratios & KPIs</h3>
        <div className="ratios-grid">
          {processedData.financialRatios?.map(ratio => (
            <div key={ratio.name} className="ratio-card">
              <div className="ratio-header">
                <div className="ratio-name">{ratio.name}</div>
                <div className={`ratio-trend ${(ratio.trend || 0) >= 0 ? 'positive' : 'negative'}`}>
                  <i className={`fas fa-arrow-${(ratio.trend || 0) >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(ratio.trend || 0)}%
                </div>
              </div>
              <div className="ratio-value">{ratio.value}</div>
              <div className="ratio-description">{ratio.description}</div>
              <div className="ratio-benchmark">
                Industry Avg: {ratio.benchmark}
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </>
  );

  const renderDetailedView = () => (
    <div className="detailed-view">
      <DataTable
        columns={[
          'Date', 'Revenue', 'Expenses', 'Profit', 'Margin', 
          'Cash Flow', 'ROI', 'Growth Rate'
        ]}
        rows={processedData.detailedFinancials?.map(item => [
          new Date(item.date).toLocaleDateString(),
          `₦${(item.revenue || 0).toLocaleString()}`,
          `₦${(item.expenses || 0).toLocaleString()}`,
          `₦${(item.profit || 0).toLocaleString()}`,
          `${(item.margin || 0)}%`,
          `₦${(item.cashFlow || 0).toLocaleString()}`,
          `${(item.roi || 0)}%`,
          <span className={(item.growthRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
            {(item.growthRate || 0) >= 0 ? '+' : ''}{(item.growthRate || 0)}%
          </span>
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
    <div className="financial-report">
      <div className="report-header">
        <div className="header-content">
          <h2>Financial Performance Dashboard</h2>
          <p className="report-period">
            {dateRange?.startDate?.toLocaleDateString() || 'N/A'} - {dateRange?.endDate?.toLocaleDateString() || 'N/A'}
          </p>
        </div>
        <div className="report-actions">
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="summary-label">Gross Profit</div>
              <div className="summary-value">
                ₦{(processedData.grossProfit || 0).toLocaleString()}
              </div>
            </div>
            <div className="summary-card secondary">
              <div className="summary-label">Operating Income</div>
              <div className="summary-value">
                ₦{(processedData.operatingIncome || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' ? renderDashboardView() : renderDetailedView()}

      {/* Financial Insights */}
      <div className="insights-panel">
        <h3>Financial Insights & Recommendations</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <i className="fas fa-chart-line"></i>
            <div className="insight-content">
              <h4>Revenue Growth</h4>
              <p>Revenue increased by {processedData.revenueChange || 0}% compared to last period</p>
            </div>
          </div>
          <div className="insight-card warning">
            <i className="fas fa-exclamation-triangle"></i>
            <div className="insight-content">
              <h4>Expense Alert</h4>
              <p>Operating expenses are {processedData.expensesChange || 0}% above budget</p>
            </div>
          </div>
          <div className="insight-card info">
            <i className="fas fa-lightbulb"></i>
            <div className="insight-content">
              <h4>Efficiency Improvement</h4>
              <p>Profit margin improved by {processedData.marginChange || 0}% due to cost optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;