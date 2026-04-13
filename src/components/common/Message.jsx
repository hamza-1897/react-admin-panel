import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Reusable message component for displaying success, error, or info messages
 * @param {string} type - Type of message ('success', 'error', 'info', 'warning')
 * @param {string} message - The message text
 * @param {function} onClose - Optional close handler
 */
const Message = ({ type = 'info', message, onClose }) => {
  const getMessageConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          classes: 'bg-green-50 border-green-200 text-green-800',
          iconColor: 'text-green-600',
        };
      case 'error':
        return {
          icon: XCircle,
          classes: 'bg-red-50 border-red-200 text-red-800',
          iconColor: 'text-red-600',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          iconColor: 'text-yellow-600',
        };
      default:
        return {
          icon: AlertCircle,
          classes: 'bg-blue-50 border-blue-200 text-blue-800',
          iconColor: 'text-blue-600',
        };
    }
  };

  const config = getMessageConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 border rounded-lg ${config.classes}`}>
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${config.iconColor}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;