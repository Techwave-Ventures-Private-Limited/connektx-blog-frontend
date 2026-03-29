import { appInstance } from "@/lib/appApi";

export const searchApi = {
  searchUsers: async (query, params = {}) => {
    const res = await appInstance.get("/search", {
      params: {
        q: query,
        ...params,
      },
    });
    return res.data;
  },

  searchPosts: async (query, params = {}) => {
    const res = await appInstance.get("/search/post", {
      params: {
        q: query,
        ...params,
      },
    });
    return res.data;
  },
};
