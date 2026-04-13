import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

/**
 * Reusable status badge component for displaying different statuses
 * @param {string} status - The status value ('active', 'inactive', 'verified', 'pending', 'rejected', etc.)
 * @param {string} type - The type of status ('user', 'provider', 'general') to determine styling
 */
const StatusBadge = ({ status, type = 'general' }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return {
          icon: CheckCircle,
          text: type === 'user' ? 'Active' : 'Verified',
          classes: 'bg-green-100 text-green-800',
        };
      case 'inactive':
        return {
          icon: XCircle,
          text: 'Inactive',
          classes: 'bg-red-100 text-red-800',
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          classes: 'bg-yellow-100 text-yellow-800',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          classes: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: AlertCircle,
          text: status || 'Unknown',
          classes: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </span>
  );
};

export default StatusBadge;