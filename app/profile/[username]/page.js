import { userApi } from '@/lib/userApi';
import { notFound } from 'next/navigation';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Globe,
  Zap
} from 'lucide-react';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileIdentityCard from '@/components/profile/ProfileIdentityCard';
import OnboardingDetailsGrid from '@/components/profile/OnboardingDetailsGrid';
import ExperienceList from '@/components/profile/ExperienceList';
import EducationList from '@/components/profile/EducationList';

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
        images: [user.profileImage || '/images/default-avatar.png'],
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
      <ProfileBanner bannerImage={user.bannerImage} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 lg:-mt-32 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:w-1/3 space-y-6">
            <ProfileIdentityCard
              user={user}
              badge={<Zap className="w-5 h-5 text-white fill-white" />}
              metaItems={[
                user.address
                  ? {
                      icon: <MapPin size={16} />,
                      label: user.address,
                    }
                  : null,
                user.website
                  ? {
                      icon: <Globe size={16} />,
                      label: user.website,
                      href: user.website,
                    }
                  : null,
                {
                  icon: <Calendar size={16} />,
                  label: `Joined ${new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}`,
                },
              ].filter(Boolean)}
              actionSlot={(
                <button className="w-full mt-6 bg-white text-black py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                  Follow
                </button>
              )}
            />
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
                 <div className="relative z-10">
                    <OnboardingDetailsGrid details={user.onboardingDetails} />
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
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Briefcase size={18} /> Experience
                </h3>
                <ExperienceList items={user.experience} />
              </section>
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <GraduationCap size={18} /> Education
                </h3>
                <EducationList items={user.education} />
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// History lists are shared in components/profile/ExperienceList and EducationList.
