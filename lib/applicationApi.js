import { appInstance } from "@/lib/appApi";

const isFormData = (data) =>
  typeof FormData !== "undefined" && data instanceof FormData;

export const applicationApi = {
  /**
   * Apply for a job (supports multipart FormData for resume upload)
   */
  applyForJob: async (data) => {
    try {
      const config = isFormData(data)
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

      const res = await appInstance.post("/application/apply", data, config);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get applications for the logged-in user
   */
  getMyApplications: async () => {
    try {
      const res = await appInstance.get("/application/my-applications");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update application status (recruiter action)
   */
  updateApplicationStatus: async (data) => {
    try {
      const res = await appInstance.post("/application/status", data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get applications for a specific job (optionally filter by status)
   */
  getJobApplications: async (jobId, params = {}) => {
    try {
      const res = await appInstance.get(`/application/job/${jobId}`, {
        params,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single application details
   */
  getApplicationById: async (id) => {
    try {
      const res = await appInstance.get(`/application/detail/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
