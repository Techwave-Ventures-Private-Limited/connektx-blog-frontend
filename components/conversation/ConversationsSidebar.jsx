import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ConversationsSidebar({
  loading,
  requests,
  activeConversations,
  selectedChatId,
  onSelectChat,
  onAccept,
  onReject,
  processingRequest,
}) {
  return (
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
            {requests.length} request{requests.length === 1 ? "" : "s"} ·{" "}
            {activeConversations.length} chat
            {activeConversations.length === 1 ? "" : "s"}
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
                      <div
                        key={conv._id}
                        className="rounded-xl border border-white/10 p-3 bg-white/5"
                      >
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
                            onClick={() => onAccept(conv._id)}
                            disabled={processingRequest === conv._id}
                            className="flex-1 rounded-md border border-white/10 bg-emerald-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(conv._id)}
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
                    onClick={() => onSelectChat(conv)}
                    className={`w-full text-left px-6 py-4 border-b border-white/5 hover:bg-white/5 transition flex items-center gap-3 ${
                      selectedChatId === conv._id ? "bg-white/5" : ""
                    }`}
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
  );
}
