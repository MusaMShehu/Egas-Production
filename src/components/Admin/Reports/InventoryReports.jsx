// components/reports/InventoryReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

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
    if (!data) {
      return {
        totalProducts: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        inventoryValue: 0,
        stockTurnover: 0,
        carryingCost: 0,
        productsChange: 0,
        lowStockChange: 0,
        outOfStockChange: 0,
        valueChange: 0,
        turnoverChange: 0,
        costChange: 0,
        stockLevels: [],
        categoryDistribution: [],
        lowStockAlerts: [],
        inventoryMovement: [],
        fastMovingItems: 0,
        slowMovingItems: 0,
        avgFastTurnover: 0,
        avgSlowTurnover: 0,
        upcomingReorder: 0,
        reorderCost: 0,
        stockOutRisk: 0,
        excessInventory: 0,
        detailedInventory: []
      };
    }
    
    return {
      ...data,
      stockLevels: data.stockLevels || [],
      categoryDistribution: data.categoryDistribution || [],
      lowStockAlerts: data.lowStockAlerts || [],
      inventoryMovement: data.inventoryMovement || [],
      detailedInventory: data.detailedInventory || []
    };
  }, [data]);

  const metrics = [
    {
      title: 'Total Products',
      value: (processedData.totalProducts || 0).toLocaleString(),
      change: processedData.productsChange || 0,
      icon: 'fas fa-boxes',
      color: 'blue',
      trend: (processedData.productsChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Low Stock Items',
      value: (processedData.lowStockItems || 0).toLocaleString(),
      change: processedData.lowStockChange || 0,
      icon: 'fas fa-exclamation-triangle',
      color: 'red',
      trend: (processedData.lowStockChange || 0) <= 0 ? 'down' : 'up'
    },
    {
      title: 'Out of Stock',
      value: (processedData.outOfStockItems || 0).toLocaleString(),
      change: processedData.outOfStockChange || 0,
      icon: 'fas fa-times-circle',
      color: 'orange',
      trend: (processedData.outOfStockChange || 0) <= 0 ? 'down' : 'up'
    },
    {
      title: 'Inventory Value',
      value: `₦${(processedData.inventoryValue || 0).toLocaleString()}`,
      change: processedData.valueChange || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'green',
      trend: (processedData.valueChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Stock Turnover',
      value: (processedData.stockTurnover || 0).toFixed(1),
      change: processedData.turnoverChange || 0,
      icon: 'fas fa-exchange-alt',
      color: 'purple',
      trend: (processedData.turnoverChange || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Carrying Cost',
      value: `₦${(processedData.carryingCost || 0).toLocaleString()}`,
      change: processedData.costChange || 0,
      icon: 'fas fa-dollar-sign',
      color: 'teal',
      trend: (processedData.costChange || 0) <= 0 ? 'down' : 'up'
    }
  ];

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
              <span className={`status-badge ${(item.status || 'low').toLowerCase()}`}>
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
              <span className={(item.movement || 0) > 0 ? 'text-green-600' : (item.movement || 0) < 0 ? 'text-red-600' : ''}>
                {(item.movement || 0) > 0 ? '+' : ''}{(item.movement || 0)}
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
          `₦${(item.unitCost || 0).toLocaleString()}`,
          `₦${(item.totalValue || 0).toLocaleString()}`,
          <span className={(item.turnoverRate || 0) > 5 ? 'text-green-600' : (item.turnoverRate || 0) < 2 ? 'text-red-600' : ''}>
            {(item.turnoverRate || 0)}x
          </span>,
          new Date(item.lastRestocked).toLocaleDateString(),
          <span className={`status-badge ${(item.status || 'healthy').toLowerCase()}`}>
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
            {dateRange?.startDate?.toLocaleDateString() || 'N/A'} - {dateRange?.endDate?.toLocaleDateString() || 'N/A'}
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