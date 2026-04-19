"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { messageApi } from "@/lib/messageApi";
import { userApi } from "@/lib/userApi";
import ConversationsSidebar from "@/components/conversation/ConversationsSidebar";
import ChatWindow from "@/components/conversation/ChatWindow";
import AuthWall from "@/components/AuthWall";

const getCurrentUserId = () => {
  const token = Cookies.get("user_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
};

export default function ConversationsPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showWall, setShowWall] = useState(false);
  const currentUserId = getCurrentUserId();
  const searchParams = useSearchParams();
  const conversationIdFromQuery = searchParams.get("conversationId");

  useEffect(() => {
    checkProfileCompletion();
    fetchConversationData();
  }, []);

  useEffect(() => {
    if (!conversationIdFromQuery || conversations.length === 0) return;
    const match = conversations.find((conv) => conv._id === conversationIdFromQuery);
    if (match) {
      setSelectedChat(match);
    }
  }, [conversationIdFromQuery, conversations]);

  const checkProfileCompletion = async () => {
    try {
      const token = Cookies.get("user_token");
      if (!token) {
        setShowWall(false);
        return;
      }

      const userData = await userApi.getSelf();
      const user = userData?.body || userData?.user;

      if (user) {
        const completion = user.profileCompletion || 0;
        setProfileCompletion(completion);
        setShowWall(completion < 70);
      }
    } catch (err) {
      console.error("Profile check failed:", err);
      setShowWall(false);
    }
  };

  const fetchConversationData = async () => {
    setLoading(true);
    try {
      const [conversationsRes, requestsRes] = await Promise.all([
        messageApi.getConversations(),
        messageApi.getMessageRequests(),
      ]);
      setConversations(conversationsRes.body || []);
      setRequests(requestsRes.body || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (conversationId) => {
    if (!conversationId) return;
    setProcessingRequest(conversationId);
    try {
      await messageApi.acceptMessageRequest(conversationId);
      await fetchConversationData();
    } catch (error) {
      console.error("Accept request failed:", error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (conversationId) => {
    if (!conversationId) return;
    setProcessingRequest(conversationId);
    try {
      await messageApi.rejectMessageRequest(conversationId);
      await fetchConversationData();
    } catch (error) {
      console.error("Reject request failed:", error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const activeConversations = conversations.filter(
    (conv) => conv.status !== "pending"
  );

  return (
    <div className="h-screen bg-black text-white flex relative">
      {/* Profile Completion Wall */}
      {showWall && (
        <AuthWall
          profileCompletion={profileCompletion}
          title="Complete Your Profile"
          message="To access conversations, please complete at least 70% of your profile."
        />
      )}

      <ConversationsSidebar
        loading={loading}
        requests={requests}
        activeConversations={activeConversations}
        selectedChatId={selectedChat?._id}
        onSelectChat={setSelectedChat}
        onAccept={handleAccept}
        onReject={handleReject}
        processingRequest={processingRequest}
      />

      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-slate-500 text-sm">Start connecting with builders.</p>
            </div>
          </div>
        ) : (
          <ChatWindow chat={selectedChat} currentUserId={currentUserId} />
        )}
      </div>
    </div>
  );
}
