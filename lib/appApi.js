import axios from 'axios';
import Cookies from 'js-cookie';

const APP_API_BASE = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

export const appInstance = axios.create({
  baseURL: APP_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

appInstance.interceptors.request.use((config) => {
  const userToken = Cookies.get('user_token');
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
    config.headers.token = userToken; // Required by your specific networking backend
  }
  return config;
});


// --------------------
// Networking App API (New)
// --------------------


export const appApi = {
  // 1. Send OTP to Email
  sendOTP: (email) => appInstance.post(`${APP_API_BASE}/auth/sendEmail`, { email }),

  // 2. Final Signup (Includes OTP and all details) 
  signup: async (data) => {
    try {
      const response = await appInstance.post(`${APP_API_BASE}/auth/signup`, {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        otp: data.otp,
        type: data.type || 'User',
        referralCode: data.referralCode || ''
      });

      // CRITICAL: Set the cookie here so it exists before the redirect
      if (response.data?.token) {
        Cookies.set('user_token', response.data.token, {
          expires: 365,
          path: '/'
        });
        Cookies.set('username', response.data.user.username, {
          expires: 365,
        });
          // New users haven't finished onboarding yet
        Cookies.remove('onboarding_completed');
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // 3. User Login
  login: async (email, password) => {
    try {
      const response = await appInstance.post(`${APP_API_BASE}/auth/login`, { email, password });

      if (response.data?.success && response.data?.token) {
        Cookies.set('user_token', response.data.token, {
          expires: 365, // 1 Year expiry


          // secure: process.env.NODE_ENV === 'production',
          // sameSite: 'lax',
          path: '/'
        });
        Cookies.set('onboarding_completed', response.data.user.onboardingCompleted, {
          expires: 365, // 1 Year expiry
        });
        Cookies.set('username', response.data.user.username, {
          expires: 365, // 1 Year expiry
        });
      }
      // console.log('Login response:', response.data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 4. Verify OTP (For post-login verification if required)
  verifyOtp: (userId, otp) => appInstance.post(`${APP_API_BASE}/auth/otp`, { userId, otp }),

  // 5. Logout
  logout: () => {
    Cookies.remove('user_token');
    window.location.href = '/login';
  },

  // 6. Onboarding completion
  saveOnboarding: async (data, type) => {
    try {
      const response = await appInstance.post(`${APP_API_BASE}/onboarding`, { 
        onboardingData: data, 
        role: type // Use 'role' if your backend controller expects 'role'
      });

      if (response.data?.success) {
        // Set the cookie to 'true' so middleware stops redirecting
        Cookies.set('onboarding_completed', 'true', {
          expires: 365, // 1 Year expiry
          path: '/'
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
};
