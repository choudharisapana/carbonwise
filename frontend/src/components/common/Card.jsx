// frontend/src/components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false,
  ...props 
}) => {
  const variants = {
    default: 'bg-dark-800 border border-dark-700',
    glass: 'glass-effect',
    gradient: 'bg-gradient-to-br from-primary-900/20 to-dark-800 border border-primary-500/20',
  };

  const hoverStyles = hoverable ? 'hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300' : '';

  return (
    <div className={`rounded-2xl p-6 ${variants[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;