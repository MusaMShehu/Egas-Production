// components/reports/FinancialReports.js
import React from 'react';
// import ReportChart from './ReportChart';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const FinancialReports = ({ data, dateRange }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `₦${(data.totalRevenue || 0).toLocaleString()}`,
      change: data.revenueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green'
    },
    {
      title: 'Total Expenses',
      value: `₦${(data.totalExpenses || 0).toLocaleString()}`,
      change: data.expensesChange || 0,
      icon: 'fas fa-file-invoice-dollar',
      color: 'red'
    },
    {
      title: 'Net Profit',
      value: `₦${(data.netProfit || 0).toLocaleString()}`,
      change: data.profitChange || 0,
      icon: 'fas fa-chart-line',
      color: 'blue'
    },
    {
      title: 'Profit Margin',
      value: `${(data.profitMargin || 0).toFixed(1)}%`,
      change: data.marginChange || 0,
      icon: 'fas fa-percent',
      color: 'purple'
    }
  ];

  const revenueExpenseData = {
    labels: data.monthlyFinancials?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: data.monthlyFinancials?.map(item => item.revenue) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: 'Expenses',
        data: data.monthlyFinancials?.map(item => item.expenses) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }
    ]
  };

  const profitMarginData = {
    labels: data.monthlyFinancials?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Profit Margin',
        data: data.monthlyFinancials?.map(item => item.profitMargin) || [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true
      }
    ]
  };

  return (
    <div className="financial-report">
      <div className="report-header">
        <h2>Financial Performance Report</h2>
        <p className="report-period">
          {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-grid">
        <div className="chart-section">
          <ReportChart
            title="Revenue vs Expenses"
            data={revenueExpenseData}
            type="line"
            height={300}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="Profit Margin Trend"
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
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>Income Statement Summary</h3>
          <DataTable
            columns={['Category', 'Amount', 'Percentage']}
            rows={data.incomeStatement?.map(item => [
              item.category,
              `₦${item.amount.toLocaleString()}`,
              `${item.percentage}%`
            ]) || []}
          />
        </div>

        <div className="table-section">
          <h3>Expense Breakdown</h3>
          <DataTable
            columns={['Expense Category', 'Amount', 'Budget', 'Variance']}
            rows={data.expenseBreakdown?.map(expense => [
              expense.category,
              `₦${expense.amount.toLocaleString()}`,
              `₦${expense.budget.toLocaleString()}`,
              <span className={expense.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                {expense.variance >= 0 ? '+' : ''}{expense.variance}%
              </span>
            ]) || []}
          />
        </div>
      </div>

      <div className="financial-summary">
        <h3>Key Financial Ratios</h3>
        <div className="ratios-grid">
          {data.financialRatios?.map(ratio => (
            <div key={ratio.name} className="ratio-card">
              <div className="ratio-name">{ratio.name}</div>
              <div className="ratio-value">{ratio.value}</div>
              <div className="ratio-trend">
                <span className={ratio.trend >= 0 ? 'positive' : 'negative'}>
                  <i className={`fas fa-arrow-${ratio.trend >= 0 ? 'up' : 'down'}`}></i>
                  {Math.abs(ratio.trend)}%
                </span>
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;