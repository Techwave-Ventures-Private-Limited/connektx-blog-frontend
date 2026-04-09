"use client";

import { useState, useEffect, Suspense } from "react";
import { Download } from "lucide-react";
import { userApi } from "@/lib/userApi";
import { searchApi } from "@/lib/searchApi";
import { useSearchParams } from "next/navigation";
import AppDownloadDialog from "@/components/AppDownloadDialog";
import ChatFAB from "@/components/ChatFab";
import AppHeader from "@/components/appheader/AppHeader";
import ExploreSearchBar from "@/components/explore/ExploreSearchBar";
import ExploreUserGrid from "@/components/explore/ExploreUserGrid";
import ExplorePagination from "@/components/explore/ExplorePagination";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const isSearchActive = query.trim().length >= 4;

  useEffect(() => {
    if (searchParams.get("onboarded") === "true") {
      setShowSuccessDialog(true);
      window.history.replaceState({}, "", "/explore");
    }
    fetchUsers(1, true);
  }, [searchParams]);

  useEffect(() => {
    if (!isSearchActive) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchApi.searchUsers(query.trim(), { limit: 20 });
        setSearchResults(data.users || []);
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query, isSearchActive]);

  const fetchUsers = async (pageNum, isInitial = false) => {
    setLoading(true);
    try {
      const data = await userApi.getExploreUsers(pageNum, 12);
      if (isInitial) {
        setUsers(data.body.users);
      } else {
        setUsers((prev) => [...prev, ...data.body.users]);
      }
      setHasMore(data.body.pagination.hasNextPage);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (isSearchActive) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const redirectToPlaystore = () => {
    window.open("https://play.google.com/store/apps/details?id=app.rork.connektx", "_blank");
  };

  const displayUsers = isSearchActive ? searchResults : users;

  return (
    <>
      <AppDownloadDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />

      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={redirectToPlaystore}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
        >
          Download App <Download size={14} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <AppHeader description="Connect with the Connektx network." />

        <ExploreSearchBar
          query={query}
          setQuery={setQuery}
          searching={searching}
        />

        <ExploreUserGrid
          users={displayUsers}
          isSearchActive={isSearchActive}
          searching={searching}
        />

        <ExplorePagination
          loading={loading}
          hasMore={hasMore}
          isSearchActive={isSearchActive}
          onLoadMore={loadMore}
        />
      </div>

      <ChatFAB />
    </>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black pt-12 pb-12 text-white">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-xs uppercase tracking-widest">
              Initializing Ecosystem...
            </p>
          </div>
        }
      >
        <ExploreContent />
      </Suspense>
    </div>
  );
}
