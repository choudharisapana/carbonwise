// frontend/src/components/charts/EnergyChart.jsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '../common/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const EnergyChart = ({ data, title = 'Energy Distribution' }) => {
  const defaultData = {
    labels: ['Cloud Computing', 'Data Centers', 'Development', 'Testing', 'CI/CD'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#F59E0B',
          '#EF4444',
        ],
        borderColor: '#1E293B',
        borderWidth: 2,
      },
    ],
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          font: {
            family: 'Poppins',
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
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
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-[250px] flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default EnergyChart;