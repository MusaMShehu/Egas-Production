// components/ChartComponent.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const ChartComponent = ({
  title,
  type,
  endpoint,
  timeframeOptions,
  defaultTimeframe,
  borderColor,
  backgroundColor
}) => {
  const [timeframe, setTimeframe] = useState(defaultTimeframe);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchChartData();
  }, [timeframe]);

  const fetchChartData = async () => {
    try {
      const response = await fetch(`${endpoint}?days=${timeframe}`);
      const data = await response.json();
      
      // Format and update chart data
      const formattedData = data.map(item => ({
        x: new Date(item.date).toISOString(),
        y: type === 'line' ? item.count : item.amount
      }));
      
      if (chartRef.current) {
        chartRef.current.data.datasets[0].data = formattedData;
        chartRef.current.update();
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const chartData = {
    datasets: [
      {
        label: title,
        data: [],
        borderColor: borderColor,
        backgroundColor: backgroundColor || borderColor,
        borderWidth: type === 'line' ? 2 : 1,
        tension: type === 'line' ? 0.1 : undefined,
        fill: type === 'line'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {timeframeOptions.map(option => (
            <option key={option} value={option}>
              Last {option} Days
            </option>
          ))}
        </select>
      </div>
      <div className="h-64">
        <Chart
          ref={chartRef}
          type={type}
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default ChartComponent;