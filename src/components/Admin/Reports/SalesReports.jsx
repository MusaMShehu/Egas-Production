// components/reports/SalesReports.js
import React, { useMemo, useState } from 'react';
import MetricsGrid from './MetricsGrid';
import DataTable from './DataTable';
// import ReportChart from './ReportChart';

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
    // Apply filters and processing logic
    return {
      ...data,
      // Add any data processing here
    };
  }, [data, filters, searchQuery]);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `₦${(processedData.totalSales || 0).toLocaleString()}`,
      change: processedData.salesChange || 0,
      icon: 'fas fa-shopping-cart',
      color: 'blue',
      trend: processedData.salesTrend || 'up',
      subtitle: `${processedData.totalOrders || 0} orders`
    },
    {
      title: 'Orders',
      value: (processedData.totalOrders || 0).toLocaleString(),
      change: processedData.ordersChange || 0,
      icon: 'fas fa-receipt',
      color: 'green',
      trend: processedData.ordersTrend || 'up',
      subtitle: `${processedData.newCustomers || 0} new customers`
    },
    {
      title: 'Average Order Value',
      value: `₦${(processedData.averageOrderValue || 0).toLocaleString()}`,
      change: processedData.aovChange || 0,
      icon: 'fas fa-chart-line',
      color: 'purple',
      trend: processedData.aovTrend || 'up',
      subtitle: 'Per order'
    },
    {
      title: 'Conversion Rate',
      value: `${(processedData.conversionRate || 0).toFixed(1)}%`,
      change: processedData.conversionChange || 0,
      icon: 'fas fa-percentage',
      color: 'orange',
      trend: processedData.conversionTrend || 'up',
      subtitle: 'Visitor to customer'
    },
    {
      title: 'Refund Rate',
      value: `${(processedData.refundRate || 0).toFixed(1)}%`,
      change: processedData.refundChange || 0,
      icon: 'fas fa-undo',
      color: 'red',
      trend: processedData.refundTrend || 'down',
      subtitle: `${processedData.totalRefunds || 0} refunds`
    },
    {
      title: 'Customer Satisfaction',
      value: `${(processedData.satisfactionScore || 0).toFixed(1)}/5`,
      change: processedData.satisfactionChange || 0,
      icon: 'fas fa-smile',
      color: 'teal',
      trend: processedData.satisfactionTrend || 'up',
      subtitle: `${processedData.totalReviews || 0} reviews`
    }
  ];

  const chartData = {
    labels: processedData.dailySales?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Sales Revenue',
        data: processedData.dailySales?.map(item => item.amount) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Orders',
        data: processedData.dailySales?.map(item => item.orders) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Average Order Value',
        data: processedData.dailySales?.map(item => item.averageValue) || [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        hidden: true
      }
    ]
  };

  const paymentMethodData = {
    labels: processedData.paymentMethods?.map(item => item.method) || [],
    datasets: [
      {
        data: processedData.paymentMethods?.map(item => item.percentage) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
          '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const deliveryPerformanceData = {
    labels: processedData.deliveryPerformance?.map(item => item.option) || [],
    datasets: [
      {
        label: 'On Time Delivery',
        data: processedData.deliveryPerformance?.map(item => item.onTimeRate) || [],
        backgroundColor: '#10B981'
      },
      {
        label: 'Average Delivery Time',
        data: processedData.deliveryPerformance?.map(item => item.avgTime) || [],
        backgroundColor: '#3B82F6'
      }
    ]
  };

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

      {/* <div className="chart-grid">
        <div className="chart-section full-width">
          <ReportChart
            title="Sales Performance Trend"
            data={chartData}
            type="line"
            height={350}
            showStats={true}
            onDataPointClick={(point) => {
              console.log('Clicked point:', point);
            }}
          />
        </div>
        
        <div className="chart-section">
          <ReportChart
            title="Payment Methods Distribution"
            data={paymentMethodData}
            type="doughnut"
            height={300}
            options={{
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
        
        <div className="chart-section">
          <ReportChart
            title="Delivery Performance"
            data={deliveryPerformanceData}
            type="bar"
            height={300}
          />
        </div>
      </div> */}

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
              product.unitsSold.toLocaleString(),
              `₦${product.revenue.toLocaleString()}`,
              `₦${product.averagePrice.toLocaleString()}`,
              <span className={product.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                <i className={`fas fa-arrow-${product.growth >= 0 ? 'up' : 'down'}`}></i>
                {Math.abs(product.growth)}%
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
              `₦${cat.sales.toLocaleString()}`,
              cat.units.toLocaleString(),
              <div className="market-share">
                <div className="share-bar">
                  <div 
                    className="share-fill" 
                    style={{ width: `${cat.marketShare}%` }}
                  ></div>
                </div>
                <span>{cat.marketShare}%</span>
              </div>,
              <span className={cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {cat.growth >= 0 ? '+' : ''}{cat.growth}%
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
              <p>{processedData.bestProduct?.name || 'N/A'} with ₦{processedData.bestProduct?.revenue?.toLocaleString() || '0'} revenue</p>
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
          `₦${order.amount.toLocaleString()}`,
          <span className={`status-badge ${order.status.toLowerCase()}`}>
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
            {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
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