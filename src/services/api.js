import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data
const mockUsers = [
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
];

const mockCategories = [
  { id: 1, name: 'Electronics', providersCount: 12 },
  { id: 2, name: 'Clothing', providersCount: 8 },
  { id: 3, name: 'Home & Garden', providersCount: 15 },
  { id: 4, name: 'Sports', providersCount: 6 },
  { id: 5, name: 'Books', providersCount: 9 },
];

const mockProviders = [
  {
    id: 1,
    username: 'techstore_pro',
    businessName: 'TechStore Pro',
    email: 'contact@techstore.com',
    profilePicture: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=TS',
    description: 'Leading provider of electronic gadgets and accessories with 10+ years of experience.',
    category: 'Electronics',
    verificationStatus: 'verified',
    joinedAt: '2023-01-15',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Store+Front',
      'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=License',
      'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Tax+Certificate',
    ],
  },
  {
    id: 2,
    username: 'fashion_hub',
    businessName: 'Fashion Hub',
    email: 'info@fashionhub.com',
    profilePicture: 'https://via.placeholder.com/150/EC4899/FFFFFF?text=FH',
    description: 'Trendy clothing and fashion accessories for all ages.',
    category: 'Clothing',
    verificationStatus: 'pending',
    joinedAt: '2023-02-20',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Showroom',
      'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Business+Card',
    ],
  },
  {
    id: 3,
    username: 'garden_master',
    businessName: 'Garden Master',
    email: 'support@gardenmaster.com',
    profilePicture: 'https://via.placeholder.com/150/059669/FFFFFF?text=GM',
    description: 'Complete gardening solutions and landscaping services.',
    category: 'Home & Garden',
    verificationStatus: 'verified',
    joinedAt: '2023-03-10',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/059669/FFFFFF?text=Garden+Center',
      'https://via.placeholder.com/300x200/059669/FFFFFF?text=Equipment',
      'https://via.placeholder.com/300x200/059669/FFFFFF?text=Certification',
    ],
  },
  {
    id: 4,
    username: 'sports_zone',
    businessName: 'Sports Zone',
    email: 'hello@sportszone.com',
    profilePicture: 'https://via.placeholder.com/150/DC2626/FFFFFF?text=SZ',
    description: 'Sports equipment and fitness gear for athletes.',
    category: 'Sports',
    verificationStatus: 'rejected',
    joinedAt: '2023-04-05',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Store+Interior',
    ],
  },
  {
    id: 5,
    username: 'bookworm_haven',
    businessName: 'Bookworm Haven',
    email: 'books@bookwormhaven.com',
    profilePicture: 'https://via.placeholder.com/150/7C3AED/FFFFFF?text=BH',
    description: 'Curated collection of books for all readers.',
    category: 'Books',
    verificationStatus: 'pending',
    joinedAt: '2023-05-12',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Bookstore',
      'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Reading+Area',
    ],
  },
  {
    id: 6,
    username: 'electro_world',
    businessName: 'Electro World',
    email: 'sales@electroworld.com',
    profilePicture: 'https://via.placeholder.com/150/EA580C/FFFFFF?text=EW',
    description: 'Wide range of electronic appliances and gadgets.',
    category: 'Electronics',
    verificationStatus: 'verified',
    joinedAt: '2023-06-18',
    idCardFront: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Front',
    idCardBack: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=ID+Back',
    businessEvidence: [
      'https://via.placeholder.com/300x200/EA580C/FFFFFF?text=Showroom',
      'https://via.placeholder.com/300x200/EA580C/FFFFFF?text=ID+Badge',
      'https://via.placeholder.com/300x200/EA580C/FFFFFF?text=Invoice',
    ],
  },
];

const mockAdminProfile = {
  name: 'Admin User',
  email: 'admin@nazdeek.com',
  picture: 'https://via.placeholder.com/150',
};

// ==================== ADMIN/SETTINGS API ====================
export const adminAPI = {
  // Get admin profile
  getProfile: async () => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.get('/admin/profile');
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockAdminProfile);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  },

  // Update admin profile
  updateProfile: async (data) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.put('/admin/profile', data);
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          Object.assign(mockAdminProfile, data);
          resolve(mockAdminProfile);
        }, 300);
      });
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      // Replace with actual API call when backend is ready
      // const formData = new FormData();
      // formData.append('picture', file);
      // const response = await apiClient.post('/admin/upload-picture', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // return response.data;
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          mockAdminProfile.picture = reader.result;
          setTimeout(() => {
            resolve({ picture: reader.result });
          }, 300);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw error;
    }
  },
};

// ==================== USERS API ====================
export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.get('/users');
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUsers);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.patch(`/users/${userId}`, { status });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

// ==================== CATEGORIES API ====================
export const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.get('/categories');
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockCategories);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Add new category
  addCategory: async (categoryName) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.post('/categories', { name: categoryName });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newCategory = {
            id: mockCategories.length + 1,
            name: categoryName,
            providersCount: 0,
          };
          mockCategories.push(newCategory);
          resolve(newCategory);
        }, 300);
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.delete(`/categories/${categoryId}`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockCategories.findIndex(cat => cat.id === categoryId);
          if (index > -1) {
            mockCategories.splice(index, 1);
          }
          resolve({ success: true });
        }, 300);
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// ==================== PROVIDERS API ====================
export const providersAPI = {
  // Get all providers
  getAllProviders: async () => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.get('/providers');
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockProviders);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  },

  // Update provider verification status
  updateProviderStatus: async (providerId, status) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.patch(`/providers/${providerId}`, { verificationStatus: status });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const provider = mockProviders.find(p => p.id === providerId);
          if (provider) {
            provider.verificationStatus = status;
          }
          resolve({ success: true });
        }, 300);
      });
    } catch (error) {
      console.error('Error updating provider status:', error);
      throw error;
    }
  },

  // Get provider details by ID
  getProviderById: async (providerId) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiClient.get(`/providers/${providerId}`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const provider = mockProviders.find(p => p.id === providerId);
          if (provider) {
            resolve(provider);
          } else {
            reject(new Error('Provider not found'));
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching provider:', error);
      throw error;
    }
  },
};

export default apiClient;
