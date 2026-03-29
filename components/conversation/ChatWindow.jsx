import { useState, useEffect, useRef } from "react";
import { Trash2, Menu } from "lucide-react";
import { messageApi } from "@/lib/messageApi";

export default function ChatWindow({ chat, currentUserId }) {
  const user = chat?.participants?.[0];

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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

  useEffect(() => {
    setSelectionMode(false);
    setSelectedMessageIds(new Set());
    setShowMenu(false);
  }, [chat?._id]);

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

  const toggleMessageSelection = (messageId) => {
    setSelectedMessageIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const enterSelectionMode = (messageId) => {
    setSelectionMode(true);
    if (messageId) {
      setSelectedMessageIds(new Set([messageId]));
    }
  };

  const clearSelection = () => {
    setSelectionMode(false);
    setSelectedMessageIds(new Set());
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessageIds.size === 0 || isDeleting) return;
    setIsDeleting(true);
    try {
      const ids = Array.from(selectedMessageIds);
      await Promise.all(ids.map((id) => messageApi.deleteMessage(chat._id, id)));
      setMessages((prev) => prev.filter((msg) => !selectedMessageIds.has(msg._id)));
      clearSelection();
    } catch (error) {
      console.error("Bulk delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user?.profileImage || "/default-avatar.png"}
            className="w-8 h-8 rounded-sm"
            alt={user?.name}
          />

          <h2 className="text-sm font-bold uppercase tracking-widest">
            {user?.name}
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-sm border border-white/10 hover:bg-white/10 transition"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Conversation menu"
          >
            <Menu size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-black border border-white/10 rounded-sm shadow-lg z-10">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-slate-200 hover:bg-white/10"
                onClick={() => {
                  setShowMenu(false);
                  setSelectionMode(true);
                }}
              >
                Select Messages
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-slate-200 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowMenu(false);
                  deleteSelectedMessages();
                }}
                disabled={selectedMessageIds.size === 0 || isDeleting}
              >
                Delete Selected
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-slate-200 hover:bg-white/10"
                onClick={() => {
                  setShowMenu(false);
                  clearSelection();
                }}
              >
                Cancel Selection
              </button>
            </div>
          )}
        </div>
      </div>

      {selectionMode && (
        <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {selectedMessageIds.size} selected
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-white hover:text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={deleteSelectedMessages}
              disabled={selectedMessageIds.size === 0 || isDeleting}
            >
              Delete <Trash2 size={14} />
            </button>
            <button
              type="button"
              className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition"
              onClick={clearSelection}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            const isSelected = selectedMessageIds.has(msg._id);
            return (
              <div
                key={msg._id}
                className={`relative max-w-xs px-4 py-2 rounded-lg text-sm cursor-pointer transition ${
                  isMe ? "bg-slate-800 ml-auto" : "bg-white text-black"
                } ${isSelected ? "ring-2 ring-emerald-400" : ""}`}
                onDoubleClick={() => enterSelectionMode(msg._id)}
                onClick={() => {
                  if (selectionMode) {
                    toggleMessageSelection(msg._id);
                  }
                }}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.message || msg.content}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 flex gap-3">
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
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
