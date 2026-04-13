import React, { useState, useEffect } from 'react';
import { Camera, Edit3, Save, X } from 'lucide-react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Message from '../components/common/Message';

/**
 * Settings page component - Admin profile management with picture upload and name editing
 */
const Settings = () => {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    picture: '',
  });

  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getProfile();
      setAdmin(data);
      setEditName(data.name);
    } catch (err) {
      // Fallback to localStorage if API fails
      const savedAdmin = localStorage.getItem('adminProfile');
      if (savedAdmin) {
        const parsedAdmin = JSON.parse(savedAdmin);
        setAdmin(parsedAdmin);
        setEditName(parsedAdmin.name);
      } else {
        // Default fallback
        setAdmin({
          name: 'Admin User',
          email: 'admin@nazdeek.com',
          picture: 'https://via.placeholder.com/150',
        });
        setEditName('Admin User');
      }
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async () => {
    if (editName.trim()) {
      try {
        setLoading(true);
        setError(null);
        const updatedData = await adminAPI.updateProfile({
          name: editName.trim(),
        });
        setAdmin({ ...admin, name: editName.trim() });

        // Save to localStorage as backup
        localStorage.setItem('adminProfile', JSON.stringify({ ...admin, name: editName.trim() }));

        setSuccessMessage('Name updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        // Fallback: save to localStorage
        setAdmin({ ...admin, name: editName.trim() });
        localStorage.setItem('adminProfile', JSON.stringify({ ...admin, name: editName.trim() }));
        setSuccessMessage('Name updated (offline)');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        setError(null);

        // Show preview while uploading
        const reader = new FileReader();
        reader.onloadend = async () => {
          setAdmin({ ...admin, picture: reader.result });

          // Upload to server
          try {
            const response = await adminAPI.uploadProfilePicture(file);
            const updatedAdmin = { ...admin, picture: response.picture || reader.result };
            setAdmin(updatedAdmin);

            // Save to localStorage as backup
            localStorage.setItem('adminProfile', JSON.stringify(updatedAdmin));

            setSuccessMessage('Picture updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
          } catch (err) {
            // Fallback: keep the local preview
            localStorage.setItem('adminProfile', JSON.stringify({ ...admin, picture: reader.result }));
            setSuccessMessage('Picture updated (offline)');
            setTimeout(() => setSuccessMessage(''), 3000);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to upload picture');
        console.error('Error uploading picture:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Success Message */}
      {successMessage && <Message type="success" message={successMessage} />}

      {/* Error Message */}
      {error && <Message type="error" message={error} />}

      {/* Profile Settings */}
      {loading && !admin.name ? (
        <LoadingSpinner message="Loading profile..." />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Admin Profile</h3>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={admin.picture}
                  alt="Admin Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                <label
                  htmlFor="picture-input"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition disabled:bg-gray-400"
                >
                  <Camera size={16} />
                </label>
                <input
                  id="picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  disabled={uploading}
                  className="hidden"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Profile Picture</p>
                <label
                  htmlFor="picture-input"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 text-sm font-medium inline-block disabled:bg-gray-400 transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Change Picture'}
                </label>
              </div>
            </div>

            <hr className="my-6" />

            {/* Admin Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Name
              </label>
              {!isEditing ? (
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 flex-1">
                    {admin.name}
                  </p>
                  <button
                    onClick={() => {
                      setEditName(admin.name);
                      setIsEditing(true);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium disabled:bg-gray-400 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter name"
                  />
                  <button
                    onClick={handleNameChange}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:bg-gray-400 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditName(admin.name);
                      setIsEditing(false);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 text-sm font-medium disabled:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <hr className="my-6" />

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <p className="text-gray-700 px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {admin.email}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;