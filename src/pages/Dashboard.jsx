import React, { useState, useEffect } from 'react';
import { Users, FolderOpen, UserCheck, Clock, TrendingUp, Activity } from 'lucide-react';
import { usersAPI, categoriesAPI, providersAPI } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

/**
 * Dashboard page component - Main overview page with key metrics and recent activity
 */
function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalProviders: 0,
    pendingProviders: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProviders, setRecentProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [users, categories, providers] = await Promise.all([
          usersAPI.getAllUsers(),
          categoriesAPI.getAllCategories(),
          providersAPI.getAllProviders(),
        ]);

        setStats({
          totalUsers: users.length,
          totalCategories: categories.length,
          totalProviders: providers.length,
          pendingProviders: providers.filter(p => p.verificationStatus === 'pending').length,
        });

        // Get last 5 items, sorted by join date (most recent first)
        setRecentUsers(users.slice(-5).reverse());
        setRecentProviders(providers.slice(-5).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nazdeek Admin Dashboard</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderOpen}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Total Providers"
          value={stats.totalProviders}
          icon={UserCheck}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Pending Providers"
          value={stats.pendingProviders}
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <StatusBadge status={user.status} type="user" />
                  <p className="text-xs text-gray-500 mt-1">{user.joinedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Providers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Providers</h2>
          </div>
          <div className="space-y-3">
            {recentProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{provider.businessName}</p>
                  <p className="text-sm text-gray-600 truncate">{provider.category}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <StatusBadge status={provider.verificationStatus} type="provider" />
                  <p className="text-xs text-gray-500 mt-1">{provider.joinedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
