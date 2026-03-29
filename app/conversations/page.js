"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { messageApi } from "@/lib/messageApi";
import { useSearchParams } from "next/navigation";

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
  const currentUserId = getCurrentUserId();
  const searchParams = useSearchParams();
  const conversationIdFromQuery = searchParams.get("conversationId");

  useEffect(() => {
    fetchConversationData();
  }, []);

  useEffect(() => {
    if (!conversationIdFromQuery || conversations.length === 0) return;
    const match = conversations.find((conv) => conv._id === conversationIdFromQuery);
    if (match) {
      setSelectedChat(match);
    }
  }, [conversationIdFromQuery, conversations]);

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


  const activeConversations = conversations.filter(
    (conv) => conv.status !== "pending"
  );

  return (
    <div className="h-screen bg-black text-white flex">
      <div className="w-[320px] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <Link href="/explore">
            <ArrowLeft size={18} className="text-slate-400 hover:text-white transition" />
          </Link>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest">
              Conversations
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              {requests.length} request{requests.length === 1 ? "" : "s"} · {activeConversations.length} chat{activeConversations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-6 text-xs text-slate-500 uppercase tracking-widest">
              Loading conversations...
            </p>
          ) : (
            <>
              {requests.length > 0 && (
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                    Message requests
                  </h2>
                  <div className="space-y-3">
                    {requests.map((conv) => {
                      const user = conv.participants?.[0];
                      return (
                        <div key={conv._id} className="rounded-xl border border-white/10 p-3 bg-white/5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {user?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {conv.lastMessage?.content || "Pending request"}
                              </p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-amber-300">
                              {conv.status || "pending"}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleAccept(conv._id)}
                              disabled={processingRequest === conv._id}
                              className="flex-1 rounded-md border border-white/10 bg-emerald-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(conv._id)}
                              disabled={processingRequest === conv._id}
                              className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-200 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeConversations.length === 0 ? (
                <p className="p-6 text-xs text-slate-500 uppercase tracking-widest">
                  No active conversations yet
                </p>
              ) : (
                activeConversations.map((conv) => {
                  const user = conv.participants?.[0];
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setSelectedChat(conv)}
                      className={`w-full text-left px-6 py-4 border-b border-white/5 hover:bg-white/5 transition flex items-center gap-3 ${selectedChat?._id === conv._id ? "bg-white/5" : ""}`}
                    >
                      <img
                        src={user?.profileImage || "/default-avatar.png"}
                        className="w-10 h-10 rounded-sm object-cover"
                        alt={user?.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {conv.lastMessage?.content || "Start conversation"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

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


function ChatWindow({ chat, currentUserId }) {

  const user = chat?.participants?.[0];

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat?._id) return;
      setLoadingMessages(true);
      try {
        const res = await messageApi.getMessages(chat._id);
        setMessages(res.body?.messages || []);
        await messageApi.markMessagesAsSeen(chat._id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || sending) return;
    setSending(true);
    try {
      const res = await messageApi.sendMessage(chat._id, {
        content: messageText.trim(),
      });
      const newMessage = res.body;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setMessageText("");
    } catch (error) {
      console.error("Send message failed:", error);
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!messageId || deletingMessageId) return;
    setDeletingMessageId(messageId);
    try {
      await messageApi.deleteMessage(chat._id, messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Delete message failed:", error);
    } finally {
      setDeletingMessageId(null);
    }
  };



  return (
    <div className="flex flex-col h-full">

      {/* Chat Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">

        <img
          src={user?.profileImage || "/default-avatar.png"}
          className="w-8 h-8 rounded-sm"
          alt={user?.name}
        />

        <h2 className="text-sm font-bold uppercase tracking-widest">
          {user?.name}
        </h2>

      </div>


      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >

        {loadingMessages ? (
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            No messages yet
          </p>
        ) : (

          messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender;
            const isMe = senderId === currentUserId;
            return (
              <div
                key={msg._id}
                className={`relative max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? "bg-slate-800 ml-auto" : "bg-white text-black"}`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.message || msg.content}
                </div>
                {isMe && (
                  <button
                    type="button"
                    onClick={() => deleteMessage(msg._id)}
                    disabled={deletingMessageId === msg._id}
                    className="absolute top-1 right-1 text-slate-400 hover:text-white"
                    aria-label="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })

        )}

        {/* 🔹 Scroll anchor */}
        <div ref={messagesEndRef} />

      </div>


      {/* Message Input */}
      <div className="p-4 border-t border-white/10 flex gap-3">

        <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {if (e.key === "Enter") sendMessage();}}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-white/10 px-4 py-2 text-sm outline-none focus:border-white/30"
        />

        <button 
          onClick={sendMessage}
          className="px-6 py-2 bg-white text-black text-sm font-semibold hover:bg-slate-200 transition"
        >
          Send
        </button>

      </div>

    </div>
  );
}
