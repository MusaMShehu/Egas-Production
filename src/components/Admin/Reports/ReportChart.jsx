// // components/reports/ReportChart.js
// import React, { useMemo } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   TimeScale,
//   Decimation
// } from 'chart.js';
// import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
// import 'chartjs-adapter-date-fns';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   TimeScale,
//   Decimation
// );

// const ReportChart = ({ 
//   title, 
//   data, 
//   type = 'line', 
//   height = 300, 
//   options = {},
//   interactive = true,
//   showStats = false,
//   onDataPointClick 
// }) => {
//   const defaultOptions = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       intersect: false,
//       mode: 'index',
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           usePointStyle: true,
//           padding: 15,
//           font: {
//             family: "'Inter', sans-serif",
//             size: 12
//           }
//         }
//       },
//       title: {
//         display: !!title,
//         text: title,
//         font: {
//           family: "'Inter', sans-serif",
//           size: 16,
//           weight: '600'
//         },
//         padding: {
//           bottom: 20
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         titleColor: '#1F2937',
//         bodyColor: '#374151',
//         borderColor: '#E5E7EB',
//         borderWidth: 1,
//         cornerRadius: 8,
//         displayColors: true,
//         usePointStyle: true,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== null) {
//               // Format numbers with commas
//               if (typeof context.parsed.y === 'number') {
//                 label += new Intl.NumberFormat().format(context.parsed.y);
//               } else {
//                 label += context.parsed.y;
//               }
//             }
//             return label;
//           }
//         }
//       },
//       decimation: {
//         enabled: true,
//         algorithm: 'min-max',
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           drawBorder: false,
//           color: 'rgba(0, 0, 0, 0.05)',
//         },
//         ticks: {
//           font: {
//             family: "'Inter', sans-serif",
//             size: 11
//           },
//           callback: function(value) {
//             if (value >= 1000) {
//               return '₦' + (value / 1000).toFixed(1) + 'K';
//             }
//             return '₦' + value;
//           }
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           font: {
//             family: "'Inter', sans-serif",
//             size: 11
//           },
//           maxRotation: 45,
//           minRotation: 45
//         }
//       },
//     },
//     elements: {
//       line: {
//         tension: 0.4
//       },
//       point: {
//         radius: 3,
//         hoverRadius: 6,
//         backgroundColor: '#ffffff',
//         borderWidth: 2
//       }
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     transitions: {
//       active: {
//         animation: {
//           duration: 300
//         }
//       }
//     },
//     onClick: (event, elements) => {
//       if (elements.length > 0 && onDataPointClick) {
//         const element = elements[0];
//         const datasetIndex = element.datasetIndex;
//         const dataIndex = element.index;
//         onDataPointClick({
//           datasetIndex,
//           dataIndex,
//           value: data.datasets[datasetIndex].data[dataIndex],
//           label: data.labels[dataIndex]
//         });
//       }
//     },
//     ...options
//   }), [title, onDataPointClick, options]);

//   const chartData = useMemo(() => {
//     // Enhance data with better defaults
//     return {
//       ...data,
//       datasets: data.datasets?.map(dataset => ({
//         borderWidth: 2,
//         fill: type === 'line',
//         pointBackgroundColor: '#ffffff',
//         pointBorderColor: dataset.borderColor,
//         pointHoverBackgroundColor: dataset.borderColor,
//         pointHoverBorderColor: '#ffffff',
//         pointHoverBorderWidth: 2,
//         ...dataset
//       })) || []
//     };
//   }, [data, type]);

//   const renderChart = () => {
//     const chartProps = {
//       data: chartData,
//       options: defaultOptions,
//       redraw: false
//     };

//     switch (type) {
//       case 'line':
//         return <Line {...chartProps} />;
//       case 'bar':
//         return <Bar {...chartProps} />;
//       case 'pie':
//         return <Pie {...chartProps} />;
//       case 'doughnut':
//         return <Doughnut {...chartProps} />;
//       default:
//         return <Line {...chartProps} />;
//     }
//   };

//   const calculateStats = () => {
//     if (!data.datasets || data.datasets.length === 0) return null;

//     const allData = data.datasets.flatMap(dataset => dataset.data);
//     const numericData = allData.filter(val => typeof val === 'number');
    
//     if (numericData.length === 0) return null;

//     const sum = numericData.reduce((a, b) => a + b, 0);
//     const avg = sum / numericData.length;
//     const max = Math.max(...numericData);
//     const min = Math.min(...numericData);

//     return { avg, max, min, total: sum };
//   };

//   const stats = showStats ? calculateStats() : null;

//   return (
//     <div className="report-chart">
//       <div className="chart-container" style={{ height: `${height}px` }}>
//         {renderChart()}
        
//         {/* Loading state */}
//         {!data.labels || data.labels.length === 0 && (
//           <div className="chart-loading">
//             <i className="fas fa-chart-bar fa-spin"></i>
//             <p>Loading chart data...</p>
//           </div>
//         )}
//       </div>

//       {/* Chart Statistics */}
//       {stats && (
//         <div className="chart-stats">
//           <div className="stat-item">
//             <span className="stat-label">Average</span>
//             <span className="stat-value">{stats.avg.toLocaleString()}</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-label">Maximum</span>
//             <span className="stat-value">{stats.max.toLocaleString()}</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-label">Minimum</span>
//             <span className="stat-value">{stats.min.toLocaleString()}</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-label">Total</span>
//             <span className="stat-value">{stats.total.toLocaleString()}</span>
//           </div>
//         </div>
//       )}

//       {/* Chart Controls */}
//       {interactive && (
//         <div className="chart-controls">
//           <button className="chart-control-btn" title="Download Chart">
//             <i className="fas fa-download"></i>
//           </button>
//           <button className="chart-control-btn" title="Expand Chart">
//             <i className="fas fa-expand"></i>
//           </button>
//           <button className="chart-control-btn" title="Refresh Data">
//             <i className="fas fa-sync-alt"></i>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportChart;