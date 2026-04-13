import React from 'react';

const Table = ({ columns, data, onAction }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.key === 'srNo' ? index + 1 :
                   col.key === 'action' ? (
                     <button
                       onClick={() => onAction(row.id)}
                       className={`px-3 py-1 rounded text-xs font-medium ${
                         row.status === 'active'
                           ? 'bg-red-100 text-red-800 hover:bg-red-200'
                           : 'bg-green-100 text-green-800 hover:bg-green-200'
                       }`}
                     >
                       {row.status === 'active' ? 'Deactivate' : 'Activate'}
                     </button>
                   ) : (
                     row[col.key]
                   )}
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