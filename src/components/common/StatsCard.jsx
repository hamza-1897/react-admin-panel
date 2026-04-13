import React from 'react';

/**
 * Reusable stats card component
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {React.Component} icon - Icon component
 * @param {string} iconColor - Tailwind color class for icon background
 * @param {string} className - Additional CSS classes
 */
const StatsCard = ({ title, value, icon: Icon, iconColor = 'bg-blue-100', className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center">
        {Icon && (
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon className="h-6 w-6 text-current" />
          </div>
        )}
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;