// components/reports/InventoryReports.js
import React from 'react';
// import ReportChart from './ReportChart';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const InventoryReports = ({ data, dateRange }) => {
  const metrics = [
    {
      title: 'Total Products',
      value: (data.totalProducts || 0).toLocaleString(),
      change: data.productsChange || 0,
      icon: 'fas fa-boxes',
      color: 'blue'
    },
    {
      title: 'Low Stock Items',
      value: (data.lowStockItems || 0).toLocaleString(),
      change: data.lowStockChange || 0,
      icon: 'fas fa-exclamation-triangle',
      color: 'red'
    },
    {
      title: 'Inventory Value',
      value: `₦${(data.inventoryValue || 0).toLocaleString()}`,
      change: data.valueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green'
    },
    {
      title: 'Stock Turnover',
      value: (data.stockTurnover || 0).toFixed(1),
      change: data.turnoverChange || 0,
      icon: 'fas fa-exchange-alt',
      color: 'purple'
    }
  ];

  const stockLevelData = {
    labels: data.stockLevels?.map(item => item.product) || [],
    datasets: [
      {
        label: 'Current Stock',
        data: data.stockLevels?.map(item => item.current) || [],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Minimum Required',
        data: data.stockLevels?.map(item => item.minimum) || [],
        backgroundColor: '#EF4444'
      }
    ]
  };

  const categoryDistribution = {
    labels: data.categoryDistribution?.map(item => item.category) || [],
    datasets: [
      {
        data: data.categoryDistribution?.map(item => item.percentage) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ]
      }
    ]
  };

  return (
    <div className="inventory-report">
      <div className="report-header">
        <h2>Inventory Management Report</h2>
        <p className="report-period">
          {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* <div className="chart-grid">
        <div className="chart-section">
          <ReportChart
            title="Stock Levels Overview"
            data={stockLevelData}
            type="bar"
            height={300}
            options={{
              indexAxis: 'y'
            }}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="Inventory by Category"
            data={categoryDistribution}
            type="pie"
            height={300}
          />
        </div>
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <h3>Low Stock Alert</h3>
          <DataTable
            columns={['Product', 'Current Stock', 'Minimum Required', 'Status']}
            rows={data.lowStockAlerts?.map(item => [
              item.product,
              item.currentStock,
              item.minimumRequired,
              <span className={`status-badge ${item.status === 'Critical' ? 'critical' : 'warning'}`}>
                {item.status}
              </span>
            ]) || []}
          />
        </div>

        <div className="table-section">
          <h3>Inventory Movement</h3>
          <DataTable
            columns={['Product', 'Starting Stock', 'Received', 'Sold', 'Ending Stock']}
            rows={data.inventoryMovement?.map(item => [
              item.product,
              item.startingStock,
              item.received,
              item.sold,
              item.endingStock
            ]) || []}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;