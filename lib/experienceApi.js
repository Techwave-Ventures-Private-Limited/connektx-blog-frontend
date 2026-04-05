import { appInstance } from "@/lib/appApi";

export const experienceApi = {
  sendWorkOtp: async (data) => {
    const res = await appInstance.post("/experience/send-verification", data);
    return res.data;
  },

  verifyWorkOtp: async (data) => {
    const res = await appInstance.post("/experience/verify-otp", data);
    return res.data;
  },

  getCompanies: async (params = {}) => {
    const res = await appInstance.get("/experience/companies", { params });
    return res.data;
  },
};
