// components/reports/SalesReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';

const SalesReports = ({ 
  data, 
  dateRange, 
  filters, 
  searchQuery,
  sortConfig,
  onSort,
  viewMode = 'dashboard'
}) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const processedData = useMemo(() => {
    if (!data) {
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        refundRate: 0,
        satisfactionScore: 0,
        salesChange: 0,
        ordersChange: 0,
        aovChange: 0,
        conversionChange: 0,
        refundChange: 0,
        satisfactionChange: 0,
        dailySales: [],
        topProducts: [],
        salesByCategory: [],
        paymentMethods: [],
        deliveryPerformance: [],
        bestProduct: null,
        underperformingCategories: [],
        lowConversionProducts: [],
        dailyAverage: 0,
        successRate: 0,
        detailedOrders: []
      };
    }
    
    return {
      ...data,
      dailySales: data.dailySales || [],
      topProducts: data.topProducts || [],
      salesByCategory: data.salesByCategory || [],
      paymentMethods: data.paymentMethods || [],
      deliveryPerformance: data.deliveryPerformance || [],
      detailedOrders: data.detailedOrders || []
    };
  }, [data]);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₦${(processedData.totalSales || 0).toLocaleString()}`,
      change: processedData.salesChange || 0,
      icon: 'fas fa-shopping-cart',
      color: 'blue',
      trend: (processedData.salesChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.totalOrders || 0} orders`
    },
    {
      title: 'Orders',
      value: (processedData.totalOrders || 0).toLocaleString(),
      change: processedData.ordersChange || 0,
      icon: 'fas fa-receipt',
      color: 'green',
      trend: (processedData.ordersChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.newCustomers || 0} new customers`
    },
    {
      title: 'Average Order Value',
      value: `₦${(processedData.averageOrderValue || 0).toLocaleString()}`,
      change: processedData.aovChange || 0,
      icon: 'fas fa-chart-line',
      color: 'purple',
      trend: (processedData.aovChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Per order'
    },
    {
      title: 'Conversion Rate',
      value: `${(processedData.conversionRate || 0).toFixed(1)}%`,
      change: processedData.conversionChange || 0,
      icon: 'fas fa-percentage',
      color: 'orange',
      trend: (processedData.conversionChange || 0) >= 0 ? 'up' : 'down',
      subtitle: 'Visitor to customer'
    },
    {
      title: 'Refund Rate',
      value: `${(processedData.refundRate || 0).toFixed(1)}%`,
      change: processedData.refundChange || 0,
      icon: 'fas fa-undo',
      color: 'red',
      trend: (processedData.refundChange || 0) <= 0 ? 'down' : 'up',
      subtitle: `${processedData.totalRefunds || 0} refunds`
    },
    {
      title: 'Customer Satisfaction',
      value: `${(processedData.satisfactionScore || 0).toFixed(1)}/5`,
      change: processedData.satisfactionChange || 0,
      icon: 'fas fa-smile',
      color: 'teal',
      trend: (processedData.satisfactionChange || 0) >= 0 ? 'up' : 'down',
      subtitle: `${processedData.totalReviews || 0} reviews`
    }
  ];

  const renderDashboardView = () => (
    <>
      <MetricsGrid metrics={metrics} />

      <div className="chart-controls">
        <div className="metric-selector">
          <label>Primary Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="aov">Average Order Value</option>
            <option value="conversion">Conversion Rate</option>
          </select>
        </div>
        <div className="chart-actions">
          <button className="btn-chart-action">
            <i className="fas fa-compress"></i>
            Compare
          </button>
          <button className="btn-chart-action">
            <i className="fas fa-forecast"></i>
            Forecast
          </button>
        </div>
      </div>

      <div className="data-tables">
        <div className="table-section">
          <div className="table-header">
            <h3>Top Performing Products</h3>
            <div className="table-actions">
              <span className="table-info">
                Showing top {processedData.topProducts?.length || 0} products
              </span>
              <button className="btn-action">
                <i className="fas fa-sync"></i>
                Refresh
              </button>
            </div>
          </div>
          <DataTable
            columns={['Product', 'Category', 'Units Sold', 'Revenue', 'Avg. Price', 'Growth']}
            rows={processedData.topProducts?.map(product => [
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-sku">SKU: {product.sku}</div>
              </div>,
              <span className={`category-tag ${product.category}`}>
                {product.category}
              </span>,
              (product.unitsSold || 0).toLocaleString(),
              `₦${(product.revenue || 0).toLocaleString()}`,
              `₦${(product.averagePrice || 0).toLocaleString()}`,
              <span className={(product.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                <i className={`fas fa-arrow-${(product.growth || 0) >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(product.growth || 0)}%
              </span>
            ]) || []}
            sortable={true}
            searchable={true}
            pagination={true}
            itemsPerPage={8}
          />
        </div>

        <div className="table-section">
          <h3>Sales by Category</h3>
          <DataTable
            columns={['Category', 'Sales Revenue', 'Units Sold', 'Market Share', 'Growth']}
            rows={processedData.salesByCategory?.map(cat => [
              <div className="category-info">
                <div className="category-name">{cat.category}</div>
                <div className="category-products">{cat.products} products</div>
              </div>,
              `₦${(cat.sales || 0).toLocaleString()}`,
              (cat.units || 0).toLocaleString(),
              <div className="market-share">
                <div className="share-bar">
                  <div 
                    className="share-fill" 
                    style={{ width: `${cat.marketShare || 0}%` }}
                  ></div>
                </div>
                <span>{(cat.marketShare || 0)}%</span>
              </div>,
              <span className={(cat.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {(cat.growth || 0) >= 0 ? '+' : ''}{(cat.growth || 0)}%
              </span>
            ]) || []}
            sortable={true}
            searchable={true}
          />
        </div>
      </div>

      {/* Sales Insights */}
      <div className="insights-panel">
        <h3>Sales Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <i className="fas fa-trophy"></i>
            <div className="insight-content">
              <h4>Best Performing</h4>
              <p>{processedData.bestProduct?.name || 'N/A'} with ₦{(processedData.bestProduct?.revenue || 0).toLocaleString()} revenue</p>
            </div>
          </div>
          <div className="insight-card warning">
            <i className="fas fa-chart-line"></i>
            <div className="insight-content">
              <h4>Growth Opportunity</h4>
              <p>{(processedData.underperformingCategories?.length || 0)} categories below average performance</p>
            </div>
          </div>
          <div className="insight-card info">
            <i className="fas fa-bullseye"></i>
            <div className="insight-content">
              <h4>Conversion Focus</h4>
              <p>{(processedData.lowConversionProducts?.length || 0)} products with conversion below 2%</p>
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
          'Order ID', 'Date', 'Customer', 'Products', 'Amount', 
          'Status', 'Payment Method', 'Delivery', 'Actions'
        ]}
        rows={processedData.detailedOrders?.map(order => [
          <div className="order-id">{order.orderId}</div>,
          new Date(order.date).toLocaleDateString(),
          <div className="customer-info">
            <div className="customer-name">{order.customer}</div>
            <div className="customer-email">{order.email}</div>
          </div>,
          <div className="products-count">
            {order.products} items
          </div>,
          `₦${(order.amount || 0).toLocaleString()}`,
          <span className={`status-badge ${(order.status || 'pending').toLowerCase()}`}>
            {order.status}
          </span>,
          <span className={`payment-method ${order.paymentMethod}`}>
            {order.paymentMethod}
          </span>,
          <span className={`delivery-status ${order.deliveryStatus}`}>
            {order.deliveryStatus}
          </span>,
          <div className="order-actions">
            <button className="btn-action-small" title="View Details">
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn-action-small" title="Print Invoice">
              <i className="fas fa-print"></i>
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
    <div className="sales-report">
      <div className="report-header">
        <div className="header-content">
          <h2>Sales Performance Dashboard</h2>
          <p className="report-period">
            {dateRange?.startDate?.toLocaleDateString() || 'N/A'} - {dateRange?.endDate?.toLocaleDateString() || 'N/A'}
          </p>
        </div>
        <div className="report-actions">
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="summary-label">Daily Average</div>
              <div className="summary-value">
                ₦{(processedData.dailyAverage || 0).toLocaleString()}
              </div>
            </div>
            <div className="summary-card success">
              <div className="summary-label">Success Rate</div>
              <div className="summary-value">
                {(processedData.successRate || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'dashboard' ? renderDashboardView() : renderDetailedView()}
    </div>
  );
};

export default SalesReports;