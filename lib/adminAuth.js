import Cookies from 'js-cookie';
import { adminApi } from './api';

export const auth = {
  login: async (username, password) => {
    try {
      console.log('Auth: Starting login process...');
      
      const response = await adminApi.login(username, password);
      
      // Token is already saved in adminApi.login(), just verify it's there
      const savedToken = Cookies.get('admin_token');
      
      if (savedToken) {
        console.log('Auth: Login successful, token verified');
        // Save username in cookie for context usage
        Cookies.set('username', username, { expires: 7 });
        return true;
      } else {
        console.error('Auth: Token not found after login');
        return false;
      }
    } catch (error) {
      console.error('Auth: Login failed:', error.message);
      return false;
    }
  },
  
  logout: () => {
    console.log('Auth: Logging out...');
    Cookies.remove('admin_token');
  },
  
  isAuthenticated: () => {
    const token = Cookies.get('admin_token');
    console.log('Auth: Checking authentication:', token ? 'authenticated' : 'not authenticated');
    return !!token;
  },

  getToken: () => {
    return Cookies.get('admin_token');
  }
};
