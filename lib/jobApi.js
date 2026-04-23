import { appInstance } from "@/lib/appApi";

export const jobApi = {

  /**
   * Get all jobs with filters + pagination
   * Supports: keyword, location, locationType, level, type, salaryMin, page, limit
   */
  getJobs: async (params = {}) => {
    try {
      const query = new URLSearchParams();

      // Dynamically append only available params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, value);
        }
      });

      // Use public endpoint so unauthenticated users can view jobs
      const res = await appInstance.get(`/job/public/all?${query.toString()}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get job details by slug (public endpoint - no auth required)
   */
  getJobBySlug: async (slug) => {
    try {
      const res = await appInstance.get(`/job/public/slug/${slug}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get job details by id (public endpoint - no auth required)
   */
  getJobById: async (id) => {
    try {
      const res = await appInstance.get(`/job/public/details/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new job
   */
  createJob: async (data) => {
    try {
      const res = await appInstance.post(`/job/create`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a job
   */
  updateJob: async (id, data) => {
    try {
      const res = await appInstance.put(`/job/update/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Close a job
   */
  closeJob: async (id) => {
    try {
      const res = await appInstance.put(`/job/close/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get jobs posted by a specific user
   */
  getJobsByUser: async (userId) => {
    try {
      const res = await appInstance.get(`/job/user/${userId}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

};
