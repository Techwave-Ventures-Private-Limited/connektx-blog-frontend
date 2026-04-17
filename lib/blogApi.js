import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// Environment variable validation
if (!API_BASE) {
  console.error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
}

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: true, // in case backend uses cookies
});

// Attach auth token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token'); // stored at login
    // console.log('Request to:', config.url, token ? 'with token' : 'no token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // console.log('Response from:', response.config?.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    let errorInfo;
    
    if (error.response) {
      // Server responded with error status
      errorInfo = {
        type: 'HTTP Error',
        url: error.config?.url || 'Unknown URL',
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.message || 'Unknown error',
        data: error.response.data || 'No response data'
      };
    } else if (error.request) {
      // Request was made but no response received (network error)
      errorInfo = {
        type: 'Network Error',
        url: error.config?.url || 'Unknown URL',
        message: error.message || 'Network request failed',
        code: error.code || 'No error code',
        timeout: error.config?.timeout || 'No timeout set'
      };
    } else {
      // Something else happened during request setup
      errorInfo = {
        type: 'Request Setup Error',
        message: error.message || 'Unknown setup error'
      };
    }
    
    // console.log('API Error:', errorInfo);
    
    // Also log the full error object for debugging
    // console.log('Full error object:', error);

    // Clear invalid token on 401
    if (error.response?.status === 401) {
      // console.log('Clearing invalid token due to 401 response');
      Cookies.remove('admin_token');
    }
    
    return Promise.reject(error);
  }
);

// --------------------
// Public API calls
// --------------------
export const publicApi = {
  getBlogs: () => api.get('/blogs'),
  getPublishedBlogs: () => api.get('/blogs/published'),
  getFeaturedBlogs: () => api.get('/blogs/featured'),
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  // Fixed: Changed from {categorySlug} to ${categorySlug}
  getBlogsByCategory: (categorySlug) => api.get(`/categories/${categorySlug}/blogs`)
};

// --------------------
// Admin API calls
// --------------------
export const adminApi = {
  // Authentication
  login: async (username, password) => {
    try {
      // console.log('Attempting login for:', username);
      // console.log('API URL:', `${API_BASE}/login`);
      
      const response = await api.post('/login', { 
        username: username.trim(), 
        password: password.trim() 
      });
      
      // console.log('Login response:', response.data);
      
      // Save token from response
      if (response.data?.token) {
        Cookies.set('admin_token', response.data.token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        // console.log('Token saved successfully');
      } else {
        console.warn('No token in response');
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },
  
  bootstrap: (username, password) =>
    api.post('/bootstrap', { username, password }),

  // Blog management
  createBlog: (blog) => api.post('/admin/blogs', blog),
  updateBlog: (id, blog) => api.put(`/admin/blogs/${id}`, blog),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),

  // Category management
  createCategory: (category) => api.post('/admin/categories', category),
  updateCategory: (id, category) => api.put(`/admin/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Event and Job management (Social Backend)
  updateEvents: async () => {
    const socialBackendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
    if (!socialBackendUrl) {
      throw new Error('NEXT_PUBLIC_APP_BACKEND_URL is not configured');
    }
    return axios.post(`${socialBackendUrl}/admin/update-events`, {}, {
      timeout: 180000, // 3 minutes for scraping
      headers: { 'Content-Type': 'application/json' }
    });
  },

  extractJobFromUrl: async (jobUrl) => {
    const socialBackendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
    if (!socialBackendUrl) {
      throw new Error('NEXT_PUBLIC_APP_BACKEND_URL is not configured');
    }
    return axios.post(`${socialBackendUrl}/admin/extract-job`, { jobUrl }, {
      timeout: 30000, // 30 seconds for job extraction
      headers: { 'Content-Type': 'application/json' }
    });
  },

  saveCompany: async (companyData) => {
    const socialBackendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
    if (!socialBackendUrl) {
      throw new Error('NEXT_PUBLIC_APP_BACKEND_URL is not configured');
    }
    return axios.post(`${socialBackendUrl}/admin/save-company`, companyData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  saveJob: async (jobData) => {
    const socialBackendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
    if (!socialBackendUrl) {
      throw new Error('NEXT_PUBLIC_APP_BACKEND_URL is not configured');
    }
    return axios.post(`${socialBackendUrl}/admin/save-job`, jobData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

// Optional: Export a helper function for handling API errors in components
export const handleApiError = (error, customMessage = 'An error occurred') => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || customMessage;
    return {
      message,
      status: error.response.status,
      type: 'server'
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      type: 'network'
    };
  } else {
    // Request setup error
    return {
      message: customMessage,
      status: null,
      type: 'setup'
    };
  }
};