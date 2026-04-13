import React from 'react';

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-linear-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-2">
          Welcome to the Nazdeek Admin Dashboard. You are viewing the main overview.
        </p>
        <p className="text-sm text-gray-400">
          Use the nested sidebar options to navigate further.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
