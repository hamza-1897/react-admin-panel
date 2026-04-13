import React from 'react';

/**
 * Reusable table component with customizable columns and actions
 * @param {Array} columns - Array of column objects with key, label, and optional render function
 * @param {Array} data - Array of data objects
 * @param {function} onAction - Action handler function
 * @param {boolean} loading - Whether table is in loading state
 * @param {string} emptyMessage - Message to show when no data
 */
const Table = ({
  columns = [],
  data = [],
  onAction,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.key === 'srNo' ? index + 1 :
                   col.render ? col.render(row, index) :
                   row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;