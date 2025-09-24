// components/reports/SalesReports.js
import React from 'react';
// import ReportChart from './ReportChart';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const SalesReports = ({ data, dateRange }) => {
  const metrics = [
    {
      title: 'Total Sales',
      value: `₦${(data.totalSales || 0).toLocaleString()}`,
      change: data.salesChange || 0,
      icon: 'fas fa-shopping-cart',
      color: 'blue'
    },
    {
      title: 'Orders',
      value: (data.totalOrders || 0).toLocaleString(),
      change: data.ordersChange || 0,
      icon: 'fas fa-receipt',
      color: 'green'
    },
    {
      title: 'Average Order Value',
      value: `₦${(data.averageOrderValue || 0).toLocaleString()}`,
      change: data.aovChange || 0,
      icon: 'fas fa-chart-line',
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
    labels: data.dailySales?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Sales Revenue',
        data: data.dailySales?.map(item => item.amount) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: 'Orders',
        data: data.dailySales?.map(item => item.orders) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    ]
  };

  const tableData = {
    columns: ['Product', 'Units Sold', 'Revenue', 'Avg. Price'],
    rows: data.topProducts?.map(product => [
      product.name,
      product.unitsSold.toLocaleString(),
      `₦${product.revenue.toLocaleString()}`,
      `₦${product.averagePrice.toLocaleString()}`
    ]) || []
  };

  return (
    <div className="sales-report">
      <div className="report-header">
        <h2>Sales Performance Report</h2>
        <p className="report-period">
          {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-section">
        <ReportChart
          title="Sales Trend"
          data={chartData}
          type="line"
          height={300}
        />
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>Top Performing Products</h3>
          <DataTable
            columns={tableData.columns}
            rows={tableData.rows}
            pagination={true}
            itemsPerPage={5}
          />
        </div>

        <div className="table-section">
          <h3>Sales by Category</h3>
          <DataTable
            columns={['Category', 'Sales', 'Units', 'Market Share']}
            rows={data.salesByCategory?.map(cat => [
              cat.category,
              `₦${cat.sales.toLocaleString()}`,
              cat.units.toLocaleString(),
              `${cat.marketShare}%`
            ]) || []}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesReports;