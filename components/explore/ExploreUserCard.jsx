import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { messageApi } from "@/lib/messageApi";

export default function ExploreUserCard({ user }) {
  const details = user.onboardingDetails || {};
  const router = useRouter();
  const [startingChat, setStartingChat] = useState(false);

  const handleStartConversation = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (startingChat) return;

    setStartingChat(true);
    try {
      const res = await messageApi.startConversation({ recipientId: user._id });
      const conversationId = res?.body?._id;

      if (conversationId) {
        router.push(`/conversations?conversationId=${conversationId}`);
        return;
      }

      router.push("/conversations");
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <Link href={`/profile/${user.username}`}>
      <div className="bg-black border border-white/10 p-6 hover:border-white/30 transition-all duration-300 flex flex-col h-full rounded-sm">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.profileImage || "/images/default-avatar.png"}
            className="w-14 h-14 rounded-sm object-cover border border-white/5"
            alt={user.name}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{user.name}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1 truncate">
              {details.role || user.headline || user.type}
            </p>
          </div>
        </div>

        <div className="space-y-5 flex-1 text-xs">
          <div>
            <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">
              Building
            </p>
            <p className="text-slate-300 leading-relaxed line-clamp-2">
              {details.building || user.bio || "Product details not provided."}
            </p>
          </div>

          <div>
            <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">
              Looking For
            </p>
            <p className="text-slate-300 leading-relaxed line-clamp-2">
              {details.lookingFor || "Opportunities and connections."}
            </p>
          </div>

          {details.skills && (
            <div>
              <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">
                Skills
              </p>
              <p className="text-slate-400">
                {details.skills.split(",").slice(0, 4).join(" • ")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 uppercase font-bold">
              Last Active: <span className="text-slate-400">Recently</span>
            </span>
          </div>
          <button
            className="flex items-center gap-2 text-[10px] font-bold text-white hover:text-slate-400 transition-colors uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleStartConversation}
            disabled={startingChat}
          >
            {startingChat ? "Starting..." : "Message"} <MessageSquare size={12} />
          </button>
        </div>
      </div>
    </Link>
  );
}
