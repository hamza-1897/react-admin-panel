import React, { useState, useEffect } from 'react';
import { User, UserCheck } from 'lucide-react';
import Table from '../components/Table';
import { usersAPI } from '../services/api';
import SearchInput from '../components/common/SearchInput';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Message from '../components/common/Message';
import StatusBadge from '../components/common/StatusBadge';

/**
 * Users page component - Manage platform users with search, filtering, and status management
 */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';

      // Call API to update status
      await usersAPI.updateUserStatus(id, newStatus);

      // Update local state
      setUsers(users.map(user =>
        user.id === id
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalCustomers = users.filter(user => user.role === 'customer').length;
  const totalProviders = users.filter(user => user.role === 'provider').length;

  const columns = [
    { key: 'srNo', label: 'Sr.No' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (user) => <StatusBadge status={user.status} type="user" />
    },
    { key: 'joinedAt', label: 'Joined At' },
    {
      key: 'action',
      label: 'Action',
      render: (user) => (
        <button
          onClick={() => handleStatusToggle(user.id)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            user.status === 'active'
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {user.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      {/* Error Message */}
      {error && <Message type="error" message={error} />}

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total Customers"
            value={totalCustomers}
            icon={User}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Total Providers"
            value={totalProviders}
            icon={UserCheck}
            iconColor="bg-green-100 text-green-600"
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <SearchInput
          placeholder="Search users by name, email, role, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="max-h-96 overflow-y-auto">
        <Table
          columns={columns}
          data={filteredUsers}
          loading={loading}
          emptyMessage="No users found matching your search."
        />
      </div>
    </div>
  );
};

export default Users;