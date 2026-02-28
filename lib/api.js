import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const APP_API_BASE = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

// Environment variable validation
if (!API_BASE) {
  console.error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
}

if (!APP_API_BASE) {
  console.error('NEXT_PUBLIC_APP_BACKEND_URL environment variable is not set');
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
    const adminToken = Cookies.get('admin_token');
    const userToken = Cookies.get('user_token');

    // If the request is going to the Networking Backend, use user_token
    if (config.url.includes(process.env.NEXT_PUBLIC_APP_BACKEND_URL) && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
      config.headers.token = userToken; // Matches your backend req.headers.token logic
    } 
    // Otherwise, if it's the Blog Backend, use admin_token
    else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
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


// --------------------
// Networking App API (New)
// --------------------

export const appApi = {
  // 1. Send OTP to Email
  sendOTP: (email) => 
    api.post(`${APP_API_BASE}/auth/sendEmail`, { email }),

  // 2. Final Signup (Includes OTP and all details)
  signup: (data) => 
    api.post(`${APP_API_BASE}/auth/signup`, {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      otp: data.otp,
      type: data.type || 'User',
      category: data.category || '',
      referralCode: data.referralCode || ''
    }),

  // 3. User Login
  login: async (email, password) => {
    try {
      const response = await api.post(`${APP_API_BASE}/auth/login`, { email, password });
      
      if (response.data?.success && response.data?.token) {
        Cookies.set('user_token', response.data.token, { 
          expires: 365, // 1 Year expiry
          // secure: process.env.NODE_ENV === 'production',
          // sameSite: 'lax',
          path: '/'
        });
      }
      // console.log('Login response:', response.data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 4. Verify OTP (For post-login verification if required)
  verifyOtp: (userId, otp) => 
    api.post(`${APP_API_BASE}/auth/otp`, { userId, otp }),

  // 5. Logout
  logout: () => {
    Cookies.remove('user_token');
    window.location.href = '/login';
  }
};