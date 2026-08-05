// frontend/src/components/cards/StatsCard.jsx
import React from 'react';
import Card from '../common/Card';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'positive',
  subtitle,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-dark-400 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${
                changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {changeType === 'positive' ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-dark-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;