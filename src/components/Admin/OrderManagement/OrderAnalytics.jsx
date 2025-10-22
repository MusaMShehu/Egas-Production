// components/OrderAnalytics.js
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faShoppingCart,
  faMoneyBillWave,
  faChartPie,
  faPercentage,
  faChartBar,
  faChartLine,
  faWallet,
  faCreditCard,
  faBolt,
  faTruck,
  faFileExcel,
  faFilePdf,
  faChartLine as faChartLineAlt
} from '@fortawesome/free-solid-svg-icons';
import './OrderAnalytics.css';

const OrderAnalytics = ({ orders, onBack, permissions }) => {
  const [dateRange, setDateRange] = useState('30days');
  const [chartType, setChartType] = useState('bar');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= startDate
    );

    // Order Status Distribution
    const statusDistribution = filteredOrders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    // Payment Status Distribution
    const paymentDistribution = filteredOrders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {});

    // Payment Method Distribution
    const paymentMethodDistribution = filteredOrders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    // Delivery Option Distribution
    const deliveryDistribution = filteredOrders.reduce((acc, order) => {
      acc[order.deliveryOption] = (acc[order.deliveryOption] || 0) + 1;
      return acc;
    }, {});

    // Revenue Calculation
    const revenue = filteredOrders
      .filter(order => order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Average Order Value
    const completedOrders = filteredOrders.filter(order => 
      order.paymentStatus === 'completed'
    );
    const averageOrderValue = completedOrders.length > 0 
      ? revenue / completedOrders.length 
      : 0;

    // Monthly/Weekly Trends
    const trends = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      let key;
      
      if (dateRange === '7days') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (dateRange === '30days') {
        key = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      
      if (!acc[key]) {
        acc[key] = { orders: 0, revenue: 0 };
      }
      
      acc[key].orders += 1;
      if (order.paymentStatus === 'completed') {
        acc[key].revenue += order.totalAmount;
      }
      
      return acc;
    }, {});

    // Top Products (if product data is available)
    const productSales = filteredOrders.reduce((acc, order) => {
      order.products?.forEach(item => {
        const productName = item.product?.name || 'Unknown Product';
        if (!acc[productName]) {
          acc[productName] = { quantity: 0, revenue: 0 };
        }
        acc[productName].quantity += item.quantity;
        acc[productName].revenue += item.quantity * item.price;
      });
      return acc;
    }, {});

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders: filteredOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: filteredOrders.filter(order => 
        order.orderStatus === 'cancelled'
      ).length,
      totalRevenue: revenue,
      averageOrderValue,
      statusDistribution,
      paymentDistribution,
      paymentMethodDistribution,
      deliveryDistribution,
      trends,
      topProducts,
      conversionRate: filteredOrders.length > 0 
        ? (completedOrders.length / filteredOrders.length) * 100 
        : 0
    };
  }, [orders, dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'processing': '#ffc107',
      'in-transit': '#17a2b8',
      'delivered': '#28a745',
      'cancelled': '#dc3545',
      'pending': '#ffc107',
      'completed': '#28a745',
      'failed': '#dc3545',
      'wallet': '#6f42c1',
      'paystack': '#20c997',
      'standard': '#6c757d',
      'express': '#fd7e14'
    };
    return colors[status] || '#6c757d';
  };

  const renderChart = (data, type, isRevenue = false) => {
    const maxValue = Math.max(...Object.values(data).map(item => 
      isRevenue ? item.revenue || item : item
    ));
    
    return (
      <div className={`aom-chart-container ${type}`}>
        {Object.entries(data).map(([key, value]) => {
          const displayValue = isRevenue ? value.revenue || value : value;
          const percentage = maxValue > 0 ? (displayValue / maxValue) * 100 : 0;
          
          return (
            <div key={key} className="aom-chart-item">
              <div className="aom-chart-label">
                <span className="aom-chart-key">{key}</span>
                <span className="aom-chart-value">
                  {isRevenue ? formatCurrency(displayValue) : displayValue}
                </span>
              </div>
              <div className="aom-chart-bar">
                <div 
                  className="aom-chart-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: getStatusColor(key.toLowerCase())
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTrendChart = () => {
    const trendData = analyticsData.trends;
    const periods = Object.keys(trendData);
    const maxOrders = Math.max(...periods.map(period => trendData[period].orders));
    
    return (
      <div className="aom-trend-chart">
        <div className="aom-chart-bars">
          {periods.map(period => {
            const data = trendData[period];
            const height = maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0;
            
            return (
              <div key={period} className="aom-trend-bar">
                <div 
                  className="aom-trend-fill aom-orders"
                  style={{ height: `${height}%` }}
                  title={`${data.orders} orders`}
                ></div>
                <div 
                  className="aom-trend-fill aom-revenue"
                  style={{ 
                    height: `${maxOrders > 0 ? (data.orders / maxOrders) * 50 : 0}%`,
                    backgroundColor: '#28a745'
                  }}
                  title={`${formatCurrency(data.revenue)} revenue`}
                ></div>
                <span className="aom-trend-label">{period}</span>
              </div>
            );
          })}
        </div>
        <div className="aom-chart-legend">
          <div className="aom-legend-item">
            <div className="aom-legend-color aom-orders"></div>
            <span>Orders</span>
          </div>
          <div className="aom-legend-item">
            <div className="aom-legend-color aom-revenue"></div>
            <span>Revenue</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="aom-order-analytics">
      <div className="aom-analytics-header">
        <button onClick={onBack} className="aom-btn-back">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </button>
        <h1>Order Analytics</h1>
        <div className="aom-analytics-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="aom-date-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          
          <div className="aom-chart-type-toggle">
            <button 
              className={chartType === 'bar' ? 'aom-active' : ''}
              onClick={() => setChartType('bar')}
            >
              <FontAwesomeIcon icon={faChartBar} />
            </button>
            <button 
              className={chartType === 'line' ? 'aom-active' : ''}
              onClick={() => setChartType('line')}
            >
              <FontAwesomeIcon icon={faChartLine} />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="aom-metrics-grid">
        <div className="aom-metric-card">
          <div className="aom-metric-icon aom-total">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <div className="aom-metric-info">
            <h3>{analyticsData.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <div className="aom-metric-trend">
            <FontAwesomeIcon icon={faArrowLeft} className="aom-trend-up" />
            <span>12%</span>
          </div>
        </div>

        <div className="aom-metric-card">
          <div className="aom-metric-icon aom-revenue">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="aom-metric-info">
            <h3>{formatCurrency(analyticsData.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="aom-metric-trend">
            <FontAwesomeIcon icon={faArrowLeft} className="aom-trend-up" />
            <span>8%</span>
          </div>
        </div>

        <div className="aom-metric-card">
          <div className="aom-metric-icon aom-average">
            <FontAwesomeIcon icon={faChartPie} />
          </div>
          <div className="aom-metric-info">
            <h3>{formatCurrency(analyticsData.averageOrderValue)}</h3>
            <p>Average Order Value</p>
          </div>
          <div className="aom-metric-trend">
            <FontAwesomeIcon icon={faArrowLeft} className="aom-trend-up" />
            <span>5%</span>
          </div>
        </div>

        <div className="aom-metric-card">
          <div className="aom-metric-icon aom-conversion">
            <FontAwesomeIcon icon={faPercentage} />
          </div>
          <div className="aom-metric-info">
            <h3>{analyticsData.conversionRate.toFixed(1)}%</h3>
            <p>Conversion Rate</p>
          </div>
          <div className="aom-metric-trend">
            <FontAwesomeIcon icon={faArrowLeft} className="aom-trend-up" />
            <span>3%</span>
          </div>
        </div>
      </div>

      <div className="aom-analytics-content">
        {/* Left Column */}
        <div className="aom-analytics-column">
          {/* Order Trends */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Order Trends</h3>
              <span className="aom-card-subtitle">Orders & Revenue Over Time</span>
            </div>
            <div className="aom-card-content">
              {renderTrendChart()}
            </div>
          </div>

          {/* Top Products */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Top Products</h3>
              <span className="aom-card-subtitle">By Quantity Sold</span>
            </div>
            <div className="aom-card-content">
              <div className="aom-products-list">
                {analyticsData.topProducts.map(([product, data], index) => (
                  <div key={product} className="aom-product-item">
                    <div className="aom-product-rank">#{index + 1}</div>
                    <div className="aom-product-info">
                      <h4>{product}</h4>
                      <p>{data.quantity} units • {formatCurrency(data.revenue)}</p>
                    </div>
                    <div className="aom-product-sales">
                      <div 
                        className="aom-sales-bar"
                        style={{ 
                          width: `${(data.quantity / analyticsData.topProducts[0][1].quantity) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="aom-analytics-column">
          {/* Order Status Distribution */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Order Status</h3>
              <span className="aom-card-subtitle">Distribution by Status</span>
            </div>
            <div className="aom-card-content">
              {renderChart(analyticsData.statusDistribution, chartType)}
              <div className="aom-distribution-details">
                {Object.entries(analyticsData.statusDistribution).map(([status, count]) => (
                  <div key={status} className="aom-distribution-item">
                    <div className="aom-status-indicator" style={{backgroundColor: getStatusColor(status)}}></div>
                    <span className="aom-status-name">{status}</span>
                    <span className="aom-status-count">{count}</span>
                    <span className="aom-status-percentage">
                      {((count / analyticsData.totalOrders) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Payment Status</h3>
              <span className="aom-card-subtitle">Payment Completion Rate</span>
            </div>
            <div className="aom-card-content">
              {renderChart(analyticsData.paymentDistribution, chartType)}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Payment Methods</h3>
              <span className="aom-card-subtitle">Preferred Payment Options</span>
            </div>
            <div className="aom-card-content">
              <div className="aom-methods-distribution">
                {Object.entries(analyticsData.paymentMethodDistribution).map(([method, count]) => (
                  <div key={method} className="aom-method-item">
                    <div className="aom-method-info">
                      <div 
                        className="aom-method-icon"
                        style={{backgroundColor: getStatusColor(method)}}
                      >
                        <FontAwesomeIcon icon={method === 'wallet' ? faWallet : faCreditCard} />
                      </div>
                      <span className="aom-method-name">{method}</span>
                    </div>
                    <div className="aom-method-stats">
                      <span className="aom-method-count">{count}</span>
                      <span className="aom-method-percentage">
                        {((count / analyticsData.totalOrders) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="aom-analytics-card">
            <div className="aom-card-header">
              <h3>Delivery Options</h3>
              <span className="aom-card-subtitle">Customer Delivery Preferences</span>
            </div>
            <div className="aom-card-content">
              <div className="aom-delivery-distribution">
                {Object.entries(analyticsData.deliveryDistribution).map(([option, count]) => (
                  <div key={option} className="aom-delivery-item">
                    <div className="aom-delivery-type">
                      <div 
                        className="aom-delivery-icon"
                        style={{backgroundColor: getStatusColor(option)}}
                      >
                        <FontAwesomeIcon icon={option === 'express' ? faBolt : faTruck} />
                      </div>
                      <span className="aom-delivery-name">
                        {option === 'express' ? 'Express' : 'Standard'}
                      </span>
                    </div>
                    <div className="aom-delivery-stats">
                      <span className="aom-delivery-count">{count}</span>
                      <span className="aom-delivery-percentage">
                        {((count / analyticsData.totalOrders) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      {permissions?.canViewAnalytics && (
        <div className="aom-export-section">
          <div className="aom-export-actions">
            <button className="aom-btn-export">
              <FontAwesomeIcon icon={faFileExcel} />
              Export to Excel
            </button>
            <button className="aom-btn-export">
              <FontAwesomeIcon icon={faFilePdf} />
              Export to PDF
            </button>
            <button className="aom-btn-export">
              <FontAwesomeIcon icon={faChartLineAlt} />
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAnalytics;