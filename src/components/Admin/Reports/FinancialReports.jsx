// components/reports/FinancialReports.js
import React, { useMemo } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';
// import ReportChart from './ReportChart';

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
    // Process data based on filters and search
    return {
      ...data,
      // Add any data processing logic here
    };
  }, [data, filters, searchQuery]);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₦${(processedData.totalRevenue || 0).toLocaleString()}`,
      change: processedData.revenueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green',
      trend: processedData.revenueTrend || 'up'
    },
    {
      title: 'Total Expenses',
      value: `₦${(processedData.totalExpenses || 0).toLocaleString()}`,
      change: processedData.expensesChange || 0,
      icon: 'fas fa-file-invoice-dollar',
      color: 'red',
      trend: processedData.expensesTrend || 'down'
    },
    {
      title: 'Net Profit',
      value: `₦${(processedData.netProfit || 0).toLocaleString()}`,
      change: processedData.profitChange || 0,
      icon: 'fas fa-chart-line',
      color: 'blue',
      trend: processedData.profitTrend || 'up'
    },
    {
      title: 'Profit Margin',
      value: `${(processedData.profitMargin || 0).toFixed(1)}%`,
      change: processedData.marginChange || 0,
      icon: 'fas fa-percent',
      color: 'purple',
      trend: processedData.marginTrend || 'up'
    },
    {
      title: 'Operating Cash Flow',
      value: `₦${(processedData.cashFlow || 0).toLocaleString()}`,
      change: processedData.cashFlowChange || 0,
      icon: 'fas fa-exchange-alt',
      color: 'teal',
      trend: processedData.cashFlowTrend || 'up'
    },
    {
      title: 'ROI',
      value: `${(processedData.roi || 0).toFixed(1)}%`,
      change: processedData.roiChange || 0,
      icon: 'fas fa-chart-pie',
      color: 'orange',
      trend: processedData.roiTrend || 'up'
    }
  ];

  const revenueExpenseData = {
    labels: processedData.monthlyFinancials?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: processedData.monthlyFinancials?.map(item => item.revenue) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: processedData.monthlyFinancials?.map(item => item.expenses) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const profitMarginData = {
    labels: processedData.monthlyFinancials?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Profit Margin',
        data: processedData.monthlyFinancials?.map(item => item.profitMargin) || [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const cashFlowData = {
    labels: processedData.cashFlowBreakdown?.map(item => item.category) || [],
    datasets: [
      {
        label: 'Cash Flow',
        data: processedData.cashFlowBreakdown?.map(item => item.amount) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ]
      }
    ]
  };

  const renderDashboardView = () => (
    <>
      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-grid">
        <div className="chart-section full-width">
          <ReportChart
            title="Revenue vs Expenses Trend"
            data={revenueExpenseData}
            type="line"
            height={300}
          />
        </div>
        
        <div className="chart-section">
          <ReportChart
            title="Profit Margin Analysis"
            data={profitMarginData}
            type="line"
            height={300}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }}
          />
        </div>
        
        <div className="chart-section">
          <ReportChart
            title="Cash Flow Distribution"
            data={cashFlowData}
            type="doughnut"
            height={300}
          />
        </div>
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>Income Statement Summary</h3>
          <DataTable
            columns={['Category', 'Amount', 'Percentage', 'Trend']}
            rows={processedData.incomeStatement?.map(item => [
              item.category,
              `₦${item.amount.toLocaleString()}`,
              `${item.percentage}%`,
              <span className={`trend-indicator ${item.trend >= 0 ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${item.trend >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(item.trend)}%
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
              `₦${expense.amount.toLocaleString()}`,
              `₦${expense.budget.toLocaleString()}`,
              <span className={expense.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                {expense.variance >= 0 ? '+' : ''}{expense.variance}%
              </span>,
              <span className={`status-badge ${expense.status.toLowerCase()}`}>
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
                <div className={`ratio-trend ${ratio.trend >= 0 ? 'positive' : 'negative'}`}>
                  <i className={`fas fa-arrow-${ratio.trend >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(ratio.trend)}%
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
          `₦${item.revenue.toLocaleString()}`,
          `₦${item.expenses.toLocaleString()}`,
          `₦${item.profit.toLocaleString()}`,
          `${item.margin}%`,
          `₦${item.cashFlow.toLocaleString()}`,
          `${item.roi}%`,
          <span className={item.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
            {item.growthRate >= 0 ? '+' : ''}{item.growthRate}%
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
            {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
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