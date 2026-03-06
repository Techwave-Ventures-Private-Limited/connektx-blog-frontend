import { appInstance } from './appApi';

export const userApi = {
  /**
   * Fetch a public profile by username
   * Endpoint: GET /user/profile/:username
   */
  getProfileByUsername: async (username) => {
    try {
      const response = await appInstance.get(`/user/profile/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExploreUsers: async (page = 1, limit = 12) => {
    try {
      const response = await appInstance.get(`/user/explore?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch the logged-in user's data
   * Endpoint: GET /user/getUser
   */
  getSelf: async () => {
    try {
      const response = await appInstance.get('/user/getUser');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update basic profile details (Bio, Headline, etc.)
   * Endpoint: POST /user/update
   */
  updateProfile: async (updateData) => {
    try {
      const response = await appInstance.post('/user/update', updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch connection stats (Followers/Following)
   */
  getConnections: async () => {
    try {
      const response = await appInstance.get('/user/connections');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch a specific user's portfolio
   * Endpoint: GET /user/:userId/portfolio
   */
  getUserPortfolio: async (userId) => {
    try {
      const response = await appInstance.get(`/user/${userId}/portfolio`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};