import React, { useState, useEffect } from 'react';
import { Eye, Filter, X } from 'lucide-react';
import { providersAPI } from '../services/api';
import SearchInput from '../components/common/SearchInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Message from '../components/common/Message';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

/**
 * Providers page component - Manage provider verification with detailed view and status management
 */
const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Filter providers based on search and status
  useEffect(() => {
    let filtered = providers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(provider => provider.verificationStatus === statusFilter);
    }

    setFilteredProviders(filtered);
  }, [providers, searchTerm, statusFilter]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providersAPI.getAllProviders();
      setProviders(data);
    } catch (err) {
      setError('Failed to load providers');
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleStatusChange = async (providerId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await providersAPI.updateProviderStatus(providerId, newStatus);

      // Update local state
      setProviders(providers.map(provider =>
        provider.id === providerId
          ? { ...provider, verificationStatus: newStatus }
          : provider
      ));

      // Update selected provider if modal is open
      if (selectedProvider && selectedProvider.id === providerId) {
        setSelectedProvider({ ...selectedProvider, verificationStatus: newStatus });
      }
    } catch (err) {
      console.error('Error updating provider status:', err);
      alert('Failed to update provider status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: providers.length,
      verified: providers.filter(p => p.verificationStatus === 'verified').length,
      pending: providers.filter(p => p.verificationStatus === 'pending').length,
      rejected: providers.filter(p => p.verificationStatus === 'rejected').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
        <div className="text-sm text-gray-500">
          Total: {statusCounts.all} | Verified: {statusCounts.verified} | Pending: {statusCounts.pending} | Rejected: {statusCounts.rejected}
        </div>
      </div>

      {/* Error Message */}
      {error && <Message type="error" message={error} />}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by business name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status ({statusCounts.all})</option>
            <option value="verified">Verified ({statusCounts.verified})</option>
            <option value="pending">Pending ({statusCounts.pending})</option>
            <option value="rejected">Rejected ({statusCounts.rejected})</option>
          </select>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={provider.profilePicture}
                    alt={provider.businessName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{provider.businessName}</h3>
                    <p className="text-sm text-gray-500 truncate">{provider.email}</p>
                  </div>
                </div>
                <StatusBadge status={provider.verificationStatus} type="provider" />
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {provider.address}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {provider.category}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(provider)}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Provider Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Provider Details"
        size="xl"
      >
        {selectedProvider && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedProvider.profilePicture}
                  alt={selectedProvider.businessName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedProvider.businessName}</h3>
                  <p className="text-gray-600">{selectedProvider.address}</p>
                  <StatusBadge status={selectedProvider.verificationStatus} type="provider" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedProvider.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-gray-900">{selectedProvider.category}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedProvider.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                  <p className="text-gray-900">{new Date(selectedProvider.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                <div className="flex gap-2">
                  {['verified', 'pending', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedProvider.id, status)}
                      disabled={updatingStatus || selectedProvider.verificationStatus === status}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        status === 'verified'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 disabled:bg-green-50'
                          : status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:bg-yellow-50'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 disabled:bg-red-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">Documents</h4>

              {/* ID Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Card</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Front</p>
                    <img
                      src={selectedProvider.idCardFront}
                      alt="ID Card Front"
                      className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(selectedProvider.idCardFront, '_blank')}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Back</p>
                    <img
                      src={selectedProvider.idCardBack}
                      alt="ID Card Back"
                      className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(selectedProvider.idCardBack, '_blank')}
                    />
                  </div>
                </div>
              </div>

              {/* Business Evidence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Evidence</label>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProvider.businessEvidence.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Business Evidence ${index + 1}`}
                      className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Providers;