"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { messageApi } from "@/lib/messageApi";
import Cookies from "js-cookie";

export default function ChatFab() {

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {

    const fetchUnread = async () => {
      try {

        const res = await messageApi.getConversations();
        const conversations = res.body || [];

        // decode user from cookie JWT if needed
        const token = Cookies.get("user_token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        const unread = conversations.filter((conv) => {

          if (!conv.lastMessage) return false;

          const lastMsg = conv.lastMessage;

          const sentByMe = lastMsg.sender._id === userId;

          if (sentByMe) return false;

          const isRead = lastMsg.readBy?.some(
            (r) => r.user === userId
          );

          return !isRead;

        }).length;

        setUnreadCount(unread);

      } catch (err) {
        console.error("Unread count error:", err);
      }
    };

    fetchUnread();

  }, []);

  return (
    <Link
      href="/conversations"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">

        <MessageSquare size={24} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

      </div>
    </Link>
  );
}
