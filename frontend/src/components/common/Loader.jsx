// frontend/src/components/ui/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;