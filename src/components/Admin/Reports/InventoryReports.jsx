// components/reports/InventoryReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';
// import ReportChart from './ReportChart';

const InventoryReports = ({ 
  data, 
  dateRange, 
  filters, 
  searchQuery,
  sortConfig,
  onSort,
  viewMode = 'dashboard'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const processedData = useMemo(() => {
    let filteredData = { ...data };
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredData = {
        ...filteredData,
        stockLevels: data.stockLevels?.filter(item => item.category === selectedCategory),
        lowStockAlerts: data.lowStockAlerts?.filter(item => item.category === selectedCategory),
        inventoryMovement: data.inventoryMovement?.filter(item => item.category === selectedCategory)
      };
    }
    
    return filteredData;
  }, [data, selectedCategory]);

  const metrics = [
    {
      title: 'Total Products',
      value: (processedData.totalProducts || 0).toLocaleString(),
      change: processedData.productsChange || 0,
      icon: 'fas fa-boxes',
      color: 'blue',
      trend: processedData.productsTrend || 'up'
    },
    {
      title: 'Low Stock Items',
      value: (processedData.lowStockItems || 0).toLocaleString(),
      change: processedData.lowStockChange || 0,
      icon: 'fas fa-exclamation-triangle',
      color: 'red',
      trend: processedData.lowStockTrend || 'down'
    },
    {
      title: 'Out of Stock',
      value: (processedData.outOfStockItems || 0).toLocaleString(),
      change: processedData.outOfStockChange || 0,
      icon: 'fas fa-times-circle',
      color: 'orange',
      trend: processedData.outOfStockTrend || 'down'
    },
    {
      title: 'Inventory Value',
      value: `₦${(processedData.inventoryValue || 0).toLocaleString()}`,
      change: processedData.valueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green',
      trend: processedData.valueTrend || 'up'
    },
    {
      title: 'Stock Turnover',
      value: (processedData.stockTurnover || 0).toFixed(1),
      change: processedData.turnoverChange || 0,
      icon: 'fas fa-exchange-alt',
      color: 'purple',
      trend: processedData.turnoverTrend || 'up'
    },
    {
      title: 'Carrying Cost',
      value: `₦${(processedData.carryingCost || 0).toLocaleString()}`,
      change: processedData.costChange || 0,
      icon: 'fas fa-dollar-sign',
      color: 'teal',
      trend: processedData.costTrend || 'down'
    }
  ];

  const stockLevelData = {
    labels: processedData.stockLevels?.slice(0, 10).map(item => item.product) || [],
    datasets: [
      {
        label: 'Current Stock',
        data: processedData.stockLevels?.slice(0, 10).map(item => item.current) || [],
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1
      },
      {
        label: 'Minimum Required',
        data: processedData.stockLevels?.slice(0, 10).map(item => item.minimum) || [],
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        borderWidth: 1
      },
      {
        label: 'Maximum Capacity',
        data: processedData.stockLevels?.slice(0, 10).map(item => item.maximum) || [],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1
      }
    ]
  };

  const categoryDistribution = {
    labels: processedData.categoryDistribution?.map(item => item.category) || [],
    datasets: [
      {
        data: processedData.categoryDistribution?.map(item => item.value) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const turnoverData = {
    labels: processedData.turnoverTrend?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Stock Turnover Ratio',
        data: processedData.turnoverTrend?.map(item => item.turnover) || [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categories = ['all', 'gas', 'accessory', '6kg', '12kg', '50kg'];

  const renderDashboardView = () => (
    <>
      <div className="inventory-controls">
        <div className="category-filter">
          <label>Filter by Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="inventory-actions">
          <button className="btn-action">
            <i className="fas fa-download"></i>
            Stock Report
          </button>
          <button className="btn-action">
            <i className="fas fa-bell"></i>
            Set Alerts
          </button>
        </div>
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
              indexAxis: 'y',
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="Inventory by Category"
            data={categoryDistribution}
            type="doughnut"
            height={300}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </div>
        <div className="chart-section">
          <ReportChart
            title="Stock Turnover Trend"
            data={turnoverData}
            type="line"
            height={300}
          />
        </div>
      </div> */}

      <div className="data-tables">
        <div className="table-section">
          <div className="table-header">
            <h3>Low Stock Alert</h3>
            <span className="alert-count">
              {processedData.lowStockAlerts?.length || 0} items need attention
            </span>
          </div>
          <DataTable
            columns={['Product', 'Category', 'Current Stock', 'Minimum Required', 'Days of Supply', 'Status', 'Action']}
            rows={processedData.lowStockAlerts?.map(item => [
              item.product,
              <span className={`category-tag ${item.category}`}>{item.category}</span>,
              item.currentStock,
              item.minimumRequired,
              item.daysOfSupply,
              <span className={`status-badge ${item.status.toLowerCase()}`}>
                <i className={`fas ${item.status === 'Critical' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}`}></i>
                {item.status}
              </span>,
              <button className="btn-action-small">
                <i className="fas fa-plus"></i>
                Reorder
              </button>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>

        <div className="table-section">
          <h3>Inventory Movement</h3>
          <DataTable
            columns={['Product', 'Starting Stock', 'Received', 'Sold', 'Returns', 'Ending Stock', 'Movement']}
            rows={processedData.inventoryMovement?.map(item => [
              item.product,
              item.startingStock,
              <span className="text-green-600">+{item.received}</span>,
              <span className="text-red-600">-{item.sold}</span>,
              <span className="text-blue-600">+{item.returns}</span>,
              item.endingStock,
              <span className={item.movement > 0 ? 'text-green-600' : item.movement < 0 ? 'text-red-600' : ''}>
                {item.movement > 0 ? '+' : ''}{item.movement}
              </span>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
          />
        </div>
      </div>

      <div className="inventory-insights">
        <h3>Inventory Optimization Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <i className="fas fa-rocket"></i>
            <div className="insight-content">
              <h4>Fast Moving Items</h4>
              <p>{processedData.fastMovingItems || 0} products with high turnover rate</p>
              <div className="insight-metrics">
                <span className="metric">Avg. Turnover: {(processedData.avgFastTurnover || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="insight-card">
            <i className="fas fa-snail"></i>
            <div className="insight-content">
              <h4>Slow Moving Items</h4>
              <p>{processedData.slowMovingItems || 0} products with low turnover rate</p>
              <div className="insight-metrics">
                <span className="metric">Avg. Turnover: {(processedData.avgSlowTurnover || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="insight-card">
            <i className="fas fa-calendar"></i>
            <div className="insight-content">
              <h4>Reorder Schedule</h4>
              <p>{processedData.upcomingReorder || 0} items need reorder in next 7 days</p>
              <div className="insight-metrics">
                <span className="metric">Est. Cost: ₦{(processedData.reorderCost || 0).toLocaleString()}</span>
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
          'Product ID', 'Product Name', 'Category', 'Current Stock', 
          'Min Stock', 'Max Stock', 'Unit Cost', 'Total Value', 
          'Turnover Rate', 'Last Restocked', 'Status'
        ]}
        rows={processedData.detailedInventory?.map(item => [
          item.id,
          item.name,
          <span className={`category-tag ${item.category}`}>{item.category}</span>,
          item.currentStock,
          item.minStock,
          item.maxStock,
          `₦${item.unitCost.toLocaleString()}`,
          `₦${item.totalValue.toLocaleString()}`,
          <span className={item.turnoverRate > 5 ? 'text-green-600' : item.turnoverRate < 2 ? 'text-red-600' : ''}>
            {item.turnoverRate}x
          </span>,
          new Date(item.lastRestocked).toLocaleDateString(),
          <span className={`status-badge ${item.status.toLowerCase()}`}>
            {item.status}
          </span>
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
    <div className="inventory-report">
      <div className="report-header">
        <div className="header-content">
          <h2>Inventory Management Dashboard</h2>
          <p className="report-period">
            {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
          </p>
        </div>
        <div className="report-actions">
          <div className="summary-cards">
            <div className="summary-card warning">
              <div className="summary-label">Stock-Out Risk</div>
              <div className="summary-value">
                {processedData.stockOutRisk || 0} items
              </div>
            </div>
            <div className="summary-card info">
              <div className="summary-label">Excess Inventory</div>
              <div className="summary-value">
                {processedData.excessInventory || 0} items
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' ? renderDashboardView() : renderDetailedView()}
    </div>
  );
};

export default InventoryReports;