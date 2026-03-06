import { userApi } from '@/lib/userApi';
import { notFound } from 'next/navigation';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Globe,
  Zap
} from 'lucide-react';

// 1. DYNAMIC SEO & METADATA
export async function generateMetadata({ params }) {
  const { username } = await params;
  try {
    const data = await userApi.getProfileByUsername(username);
    const user = data.body;
    return {
      title: `${user.name} (@${username}) | Connektx`,
      description: user.headline || user.bio || `Connect with ${user.name} on Connektx.`,
      openGraph: {
        images: [user.profileImage || '/default-avatar.png'],
      },
    };
  } catch (e) {
    return { title: 'Profile' };
  }
}

export default async function ProfilePage({ params }) {
  const { username } = await params;
  let user;

  try {
    const data = await userApi.getProfileByUsername(username);
    user = data.body;
  } catch (error) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      {/* BANNER SECTION */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        {user.bannerImage && (
          <img src={user.bannerImage} className="w-full h-full object-cover" alt="Banner" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 lg:-mt-32 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-slate-950/50 backdrop-blur-2xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              <div className="relative inline-block mb-6">
                <img 
                  src={user.profileImage || '/default-avatar.png'} 
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2rem] object-cover border-4 border-[#07090e] shadow-xl"
                  alt={user.name}
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-[#07090e]">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              <h1 className="text-3xl font-black tracking-tighter mb-1">{user.name}</h1>
              <p className="text-blue-400 font-bold text-sm mb-4">@{user.username}</p>
              
              {user.headline && (
                <p className="text-slate-200 font-medium text-lg leading-snug mb-4">{user.headline}</p>
              )}

              <div className="space-y-3 text-sm text-slate-400 mb-6">
                {user.address && <div className="flex items-center gap-2"><MapPin size={16}/> {user.address}</div>}
                {user.website && <div className="flex items-center gap-2"><Globe size={16}/> <a href={user.website} className="text-blue-400 hover:underline">{user.website}</a></div>}
                <div className="flex items-center gap-2"><Calendar size={16}/> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5">
                <StatBox label="Followers" value={user.followerCount} />
                <StatBox label="Following" value={user.followingCount} />
                <StatBox label="Streak" value={user.streak} />
              </div>

              <button className="w-full mt-6 bg-white text-black py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                Follow
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN CONTENT */}
          <div className="lg:w-2/3 space-y-8 pt-4 lg:pt-36">
            
            {/* ONBOARDING DETAILS (The "Role" Identity) */}
            <section>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Onboarding Profile</h3>
              <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 text-blue-500/10 font-black text-6xl uppercase italic select-none">
                    {user.type}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {Object.entries(user.onboardingDetails || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="text-lg font-bold text-white leading-tight">{value || '---'}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* BIO */}
            {user.bio && (
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">About</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{user.bio}</p>
              </section>
            )}

            {/* EXPERIENCE & EDUCATION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <HistoryList 
                  title="Experience" 
                  icon={<Briefcase size={18}/>} 
                  items={user.experience} 
               />
               <HistoryList 
                  title="Education" 
                  icon={<GraduationCap size={18}/>} 
                  items={user.education} 
               />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-black">{value}</p>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

function HistoryList({ title, icon, items }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-4">
        {items && items.length > 0 ? items.map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <p className="font-bold text-slate-100">{item.title || item.degree}</p>
            <p className="text-xs text-blue-400">{item.company || item.school}</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{item.duration}</p>
          </div>
        )) : (
          <p className="text-sm text-slate-600 italic">No {title.toLowerCase()} recorded.</p>
        )}
      </div>
    </div>
  );
}