"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jobApi } from "@/lib/jobApi";
import { userApi } from "@/lib/userApi";
import { Search, MapPin, Clock, Briefcase, TrendingUp } from "lucide-react";
import AppHeader from "@/components/appheader/AppHeader";
import WhatsAppFab from "@/components/WhatsAppFab";
import AuthWall from "@/components/AuthWall";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showWall, setShowWall] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    level: "",
    page: 1,
    limit: 10
  });

  // Check profile completion
  const checkProfileCompletion = async () => {
    try {
      const token = Cookies.get("user_token");
      if (!token) {
        // Not logged in - no wall, just show jobs
        setShowWall(false);
        return;
      }

      // Fetch user profile to get completion from backend
      const userData = await userApi.getSelf();
      const user = userData?.body || userData?.user;

      if (user) {
        // Use backend-calculated profile completion
        const completion = user.profileCompletion || 0;
        setProfileCompletion(completion);
        setShowWall(completion < 70);
      }
    } catch (err) {
      console.error("Profile check failed:", err);
      setShowWall(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobApi.getJobs(filters);
      setJobs(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProfileCompletion();
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters]);


  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12 max-w-7xl mx-auto relative">

      {/* Profile Completion Wall */}
      {showWall && (
        <AuthWall
          profileCompletion={profileCompletion}
          title="Complete Your Profile"
          message="To access job listings, please complete at least 70% of your profile."
        />
      )}

      <AppHeader description="Discover opportunities from founders & companies" />

      {/* Stats Bar */}
      <div className="mb-8 flex items-center gap-6 text-xs text-slate-500">
        <span>{jobs.length} Jobs Available</span>
        <span>•</span>
        <span>Updated Daily</span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 rounded-lg hover:border-white/20 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            className="bg-transparent outline-none text-sm w-full py-3.5"
            placeholder="Search roles, skills..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value, page: 1 })
            }
          />
        </div>

        <input
          className="bg-white/5 border border-white/10 px-4 py-3.5 rounded-lg outline-none focus:border-white/30 text-white text-sm hover:border-white/20 transition-colors"
          placeholder="Location"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value, page: 1 })
          }
        />

        <select
          className="bg-white/5 border border-white/10 px-4 py-3.5 rounded-lg outline-none focus:border-white/30 text-white text-sm hover:border-white/20 transition-colors"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value, page: 1 })
          }
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          className="bg-white/5 border border-white/10 px-4 py-3.5 rounded-lg outline-none focus:border-white/30 text-white text-sm hover:border-white/20 transition-colors"
          value={filters.level}
          onChange={(e) =>
            setFilters({ ...filters, level: e.target.value, page: 1 })
          }
        >
          <option value="">All Levels</option>
          <option value="Fresher">Fresher</option>
          <option value="Entry Level (1-2 years)">Entry</option>
          <option value="Mid Level (3-5 years)">Mid</option>
          <option value="Senior level (5+ years)">Senior</option>
        </select>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white mb-4"></div>
          <p className="text-slate-500 text-sm">Loading opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Briefcase className="w-12 h-12 text-slate-700 mb-4" />
          <p className="text-slate-500 text-sm">No jobs found</p>
          <p className="text-slate-600 text-xs mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-12">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="px-6 py-2.5 border border-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-sm"
        >
          Previous
        </button>

        <span className="text-xs text-slate-500">Page {filters.page}</span>

        <button
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="px-6 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm"
        >
          Next
        </button>
      </div>

      <WhatsAppFab />
    </div>
  );
}

/* ================= JOB CARD ================= */

function JobCard({ job }) {

  // Salary formatter
  const formatSalary = (salary) => {
    if (!salary || !salary.isDisclosed) return "Not Disclosed";

    const min = salary.min ? `₹${salary.min}` : "";
    const max = salary.max ? ` - ₹${salary.max}` : "";
    const period = salary.period === "Monthly" ? "/month" : "/year";

    return `${min}${max} ${period}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const days = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <a
      href={`/jobs/${job.slug}`}
      className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/30 hover:bg-white/[0.07] transition-all group"
    >
      <div className="flex justify-between items-start gap-6">

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-lg font-semibold group-hover:text-white transition-colors">{job.title}</h3>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                {job.company?.name || "Company"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.locations?.join(", ")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {job.type}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {job.experienceLevel || "Any"}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {job.skills?.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills?.length > 5 && (
              <span className="text-[11px] px-2.5 py-1 text-slate-500">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-white mb-1">
            {formatSalary(job.salaryRange)}
          </div>
          <div className="text-xs text-slate-500">
            {getTimeAgo(job.createdAt)}
          </div>
        </div>
      </div>
    </a>
  );
}
