import { appInstance } from "@/lib/appApi";

export const messageApi = {

  getConversations: async () => {
    const res = await appInstance.get("/conversations");
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await appInstance.get(`/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId, data) => {
    const res = await appInstance.post(
        `/conversations/${conversationId}/messages`,
        data
    );
    return res.data;
  }

};
