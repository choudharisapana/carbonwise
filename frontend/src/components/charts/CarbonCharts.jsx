// frontend/src/components/charts/CarbonChart.jsx
import React from 'react';
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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../common/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CarbonChart = ({ data, title = 'Carbon Emissions Trend' }) => {
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Carbon Emissions (kg CO₂)',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 60, 55, 45],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#10B981',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Energy Efficiency (%)',
        data: [70, 75, 80, 78, 82, 85, 88, 90, 87, 85, 90, 92],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#3B82F6',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5],
      },
    ],
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: {
            family: 'Poppins',
            size: 12,
          },
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#94A3B8',
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            family: 'Poppins',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            family: 'Poppins',
            size: 11,
          },
        },
      },
    },
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors">
            Weekly
          </button>
          <button className="text-xs px-3 py-1 rounded-lg bg-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors">
            Monthly
          </button>
          <button className="text-xs px-3 py-1 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors">
            Yearly
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default CarbonChart;