"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { messageApi } from "@/lib/messageApi";

export default function ConversationsPage() {

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchConversations = async () => {
      try {
        const res = await messageApi.getConversations();
        setConversations(res.body || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

  }, []);


  return (
    <div className="h-screen bg-black text-white flex">

      {/* LEFT SIDEBAR */}
      <div className="w-[320px] border-r border-white/10 flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <Link href="/explore">
            <ArrowLeft size={18} className="text-slate-400 hover:text-white transition"/>
          </Link>

          <h1 className="text-sm font-bold uppercase tracking-widest">
            Conversations
          </h1>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">

          {loading ? (
            <p className="p-6 text-xs text-slate-500 uppercase tracking-widest">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p className="p-6 text-xs text-slate-500 uppercase tracking-widest">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => {

              const user = conv.participants?.[0];

              return (
                <button
                  key={conv._id}
                  onClick={() => setSelectedChat(conv)}
                  className="w-full text-left px-6 py-4 border-b border-white/5 hover:bg-white/5 transition flex items-center gap-3"
                >
                  <img
                    src={user?.profileImage || "/default-avatar.png"}
                    className="w-10 h-10 rounded-sm object-cover"
                    alt={user?.name}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user?.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {conv.lastMessage?.content || "Start conversation"}
                    </p>
                  </div>

                </button>
              );
            })
          )}

        </div>

      </div>


      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {!selectedChat ? (

          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Select a conversation
              </h2>

              <p className="text-slate-500 text-sm">
                Start connecting with builders.
              </p>
            </div>
          </div>

        ) : (

          <ChatWindow chat={selectedChat} />

        )}

      </div>

    </div>
  );
}



function ChatWindow({ chat }) {

  const user = chat?.participants?.[0];

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
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        <div className="max-w-xs bg-white text-black px-4 py-2 rounded-lg text-sm">
          Hey! I saw your profile on Connektx.
        </div>

        <div className="max-w-xs bg-slate-800 px-4 py-2 rounded-lg text-sm ml-auto">
          Thanks! What are you building?
        </div>

      </div>


      {/* Message Input */}
      <div className="p-4 border-t border-white/10 flex gap-3">

        <input
          placeholder="Type a message..."
          className="flex-1 bg-black border border-white/10 px-4 py-2 text-sm outline-none focus:border-white/30"
        />

        <button className="px-6 py-2 bg-white text-black text-sm font-semibold hover:bg-slate-200 transition">
          Send
        </button>

      </div>

    </div>
  );
}
