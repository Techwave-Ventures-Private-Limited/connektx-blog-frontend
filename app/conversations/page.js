import { Suspense } from "react";
import ConversationsPage from "@/components/conversation/ConversationsPage";

export default function ConversationsRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading conversations...
        </div>
      }
    >
      <ConversationsPage />
    </Suspense>
  );
}
