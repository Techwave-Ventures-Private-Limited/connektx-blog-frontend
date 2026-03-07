"use client";
import { useState, useEffect, Suspense } from 'react';
import { userApi } from '@/lib/userApi';
import { MessageSquare, Download } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppDownloadDialog from '@/components/AppDownloadDialog';

// 1. Move the search params logic into a separate internal component
function ExploreContent() {
  const searchParams = useSearchParams();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // Check if we just came from onboarding
    if (searchParams.get('onboarded') === 'true') {
      setShowSuccessDialog(true);
      // Optional: Clean up URL without refreshing
      window.history.replaceState({}, '', '/explore');
    }
    fetchUsers(1, true);
  }, [searchParams]);

  const fetchUsers = async (pageNum, isInitial = false) => {
    setLoading(true);
    try {
      const data = await userApi.getExploreUsers(pageNum, 12);
      if (isInitial) {
        setUsers(data.body.users);
      } else {
        setUsers(prev => [...prev, ...data.body.users]);
      }
      setHasMore(data.body.pagination.hasNextPage);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const redirectToPlaystore = () => {
    window.open("https://play.google.com/store/apps/details?id=app.rork.connektx", "_blank");
  };

  return (
    <>
      <AppDownloadDialog 
        isOpen={showSuccessDialog} 
        onClose={() => setShowSuccessDialog(false)} 
      />
      
      {/* 3rd FIX: DOWNLOAD BUTTON IN UPPER RIGHT */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={redirectToPlaystore}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm backdrop-blur-md"
        >
          Download App <Download size={14} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* 1st FIX: REDUCED TOP MARGIN/GAP */}
        <div className="mb-12 border-b border-white/10 pb-8 w-full text-left">
          <h1 className="text-3xl font-bold tracking-tight uppercase text-white">
            Explore
          </h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em]">
            Connect with the Connektx network.
          </p>
        </div>

        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="mt-16 flex justify-center">
          {loading ? (
             <p className="text-slate-500 text-xs uppercase tracking-widest">Loading...</p>
          ) : hasMore && (
            <button 
              onClick={loadMore}
              className="px-8 py-3 border border-white/20 text-white text-xs font-bold hover:bg-white hover:text-black transition-all uppercase tracking-widest"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// 2. Wrap the content in a Suspense boundary in the default export
export default function ExplorePage() {
  return (
    /* 1st FIX: REDUCED TOP PADDING FROM pt-24 TO pt-12 */
    <div className="min-h-screen bg-black pt-12 pb-12 text-white">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 text-xs uppercase tracking-widest">Initializing Ecosystem...</p>
        </div>
      }>
        <ExploreContent />
      </Suspense>
    </div>
  );
}

// 3. UserCard stays exactly as it was
function UserCard({ user }) {
  const details = user.onboardingDetails || {};
  
  return (
    <Link href={`/profile/${user.username}`}>
      <div className="bg-black border border-white/10 p-6 hover:border-white/30 transition-all duration-300 flex flex-col h-full rounded-sm">
        
        {/* HEADER: IMAGE & IDENTITY */}
        <div className="flex items-center gap-4 mb-6">
          {/* 2nd FIX: REMOVED grayscale CLASS */}
          <img 
            src={user.profileImage || '/default-avatar.png'} 
            className="w-14 h-14 rounded-sm object-cover border border-white/5"
            alt={user.name}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{user.name}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">
              {details.role || user.type}
            </p>
          </div>
        </div>

        {/* CONTENT FIELDS */}
        <div className="space-y-5 flex-1 text-xs">
          <div>
            <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">Building</p>
            <p className="text-slate-300 leading-relaxed line-clamp-2">
              {details.building || user.headline || "Product details not provided."}
            </p>
          </div>

          <div>
            <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">Looking For</p>
            <p className="text-slate-300 leading-relaxed line-clamp-2">
              {details.lookingFor || "Opportunities and connections."}
            </p>
          </div>

          {/* SKILLS AS SIMPLE TEXT LIST */}
          {details.skills && (
            <div>
              <p className="text-slate-600 uppercase font-bold tracking-tighter mb-1">Skills</p>
              <p className="text-slate-400">
                {details.skills.split(',').slice(0, 4).join(' • ')}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER: STATUS & MESSAGE */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-600 uppercase font-bold">
                 Last Active: <span className="text-slate-400">Recently</span>
               </span>
            </div>
            <button 
              className="flex items-center gap-2 text-[10px] font-bold text-white hover:text-slate-400 transition-colors uppercase tracking-widest"
              onClick={(e) => {
                e.preventDefault();
                // Add message logic here
              }}
            >
              Message <MessageSquare size={12} />
            </button>
        </div>
      </div>
    </Link>
  );
}