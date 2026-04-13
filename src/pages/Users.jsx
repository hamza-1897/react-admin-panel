import React, { useState } from 'react';
import Table from '../components/Table';

const Users = () => {
  // Mock data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joinedAt: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'provider', status: 'inactive', joinedAt: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', status: 'active', joinedAt: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'provider', status: 'active', joinedAt: '2023-04-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'customer', status: 'inactive', joinedAt: '2023-05-12' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'provider', status: 'active', joinedAt: '2023-06-18' },
    { id: 7, name: 'Eve Adams', email: 'eve@example.com', role: 'customer', status: 'active', joinedAt: '2023-07-22' },
    { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'provider', status: 'inactive', joinedAt: '2023-08-30' },
    { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'customer', status: 'active', joinedAt: '2023-09-14' },
    { id: 10, name: 'Henry Ford', email: 'henry@example.com', role: 'provider', status: 'active', joinedAt: '2023-10-25' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'srNo', label: 'Sr.No' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'joinedAt', label: 'Joined At' },
    { key: 'action', label: 'Action' },
  ];

  const handleAction = (id) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalCustomers = users.filter(user => user.role === 'customer').length;
  const totalProviders = users.filter(user => user.role === 'provider').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Providers</h3>
          <p className="text-3xl font-bold text-green-600">{totalProviders}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table with Scroll */}
      <div className="max-h-96 overflow-y-auto">
        <Table columns={columns} data={filteredUsers} onAction={handleAction} />
      </div>
    </div>
  );
};

export default Users;