import { appInstance } from './appApi';

export const userApi = {

  // -------------------------
  // GET DATA
  // -------------------------

  getSelf: async () => {
    const res = await appInstance.get('/user/getUser');
    return res.data;
  },

  getProfileByUsername: async (username) => {
    const res = await appInstance.get(`/user/profile/${username}`);
    return res.data;
  },

  // -------------------------
  // EXPLORE USERS
  // -------------------------

  getExploreUsers: async (page = 1, limit = 12) => {
    const res = await appInstance.get(`/user/explore?page=${page}&limit=${limit}`);
    return res.data;
  },


  // -------------------------
  // UPDATE: BASIC PROFILE
  // -------------------------

  updateProfile: async (data) => {
    const res = await appInstance.post('/user/update/profile', data);
    return res.data;
  },


  // -------------------------
  // UPDATE: EDUCATION
  // -------------------------

  updateEducation: async (education) => {
    const res = await appInstance.post('/user/update/education', {
      education,
    });
    return res.data;
  },


  // -------------------------
  // UPDATE: EXPERIENCE
  // -------------------------

  updateExperience: async (experience) => {
    const res = await appInstance.post('/user/update/experience', {
      experience,
    });
    return res.data;
  },


  // -------------------------
  // MEDIA
  // -------------------------

  uploadProfileImage: async (formData) => {
    const res = await appInstance.post('/user/uploadProfileImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadBannerImage: async (formData) => {
    const res = await appInstance.post('/user/uploadBannerImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },


  // -------------------------
  // CONNECTIONS
  // -------------------------

  getConnections: async () => {
    const res = await appInstance.get('/user/connections');
    return res.data;
  },


  // -------------------------
  // PORTFOLIO
  // -------------------------

  getPortfolio: async () => {
    const res = await appInstance.get('/user/portfolio');
    return res.data;
  },

  addPortfolio: async (formData) => {
    const res = await appInstance.post('/user/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deletePortfolio: async (id) => {
    const res = await appInstance.delete(`/user/portfolio/${id}`);
    return res.data;
  },
};