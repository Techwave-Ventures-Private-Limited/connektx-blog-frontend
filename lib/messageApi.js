import { appInstance } from "@/lib/appApi";

export const messageApi = {
  startConversation: async (data) => {
    const res = await appInstance.post("/conversations", data);
    return res.data;
  },

  getConversations: async () => {
    const res = await appInstance.get("/conversations");
    return res.data;
  },

  getMessageRequests: async () => {
    const res = await appInstance.get("/conversations/requests");
    return res.data;
  },

  acceptMessageRequest: async (conversationId) => {
    const res = await appInstance.post(
      `/conversations/requests/${conversationId}/accept`
    );
    return res.data;
  },

  rejectMessageRequest: async (conversationId) => {
    const res = await appInstance.post(
      `/conversations/requests/${conversationId}/reject`
    );
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
  },

  markMessagesAsSeen: async (conversationId) => {
    const res = await appInstance.post(`/conversations/${conversationId}/seen`);
    return res.data;
  },

  deleteMessage: async (conversationId, messageId) => {
    const res = await appInstance.delete(
      `/conversations/${conversationId}/messages/${messageId}`
    );
    return res.data;
  },
};
