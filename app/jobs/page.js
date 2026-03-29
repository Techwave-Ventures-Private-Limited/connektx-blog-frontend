"use client";
import { useEffect, useState } from "react";
import { jobApi } from "@/lib/jobApi";
import { Search } from "lucide-react";
import AppHeader from "@/components/appheader/AppHeader";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    level: "",
    page: 1,
    limit: 10
  });

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
    fetchJobs();
  }, [filters]);

  // Styles
  const inputStyle =
    "w-full bg-black border border-white/10 p-3 rounded-sm outline-none focus:border-white/30 text-white text-sm";
  const selectStyle = inputStyle;

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10 max-w-6xl mx-auto">

      <AppHeader description="Discover opportunities from founders & companies" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="flex items-center gap-2 border border-white/10 px-3">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            className="bg-transparent outline-none text-sm w-full py-3"
            placeholder="Search roles, skills..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value, page: 1 })
            }
          />
        </div>

        <input
          className={inputStyle}
          placeholder="Location"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value, page: 1 })
          }
        />

        <select
          className={selectStyle}
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
          className={selectStyle}
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
        <p className="text-slate-500 text-sm">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500 text-sm">No jobs found</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-10">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="px-4 py-2 border border-white/10 disabled:opacity-30"
        >
          Prev
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="px-4 py-2 border border-white/10"
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

  return (
    <a
      href={`/jobs/${job.slug}`}
      className="block border border-white/10 p-5 hover:border-white/30 transition-all"
    >
      <div className="flex justify-between items-start gap-4">

        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>

          <p className="text-sm text-slate-400 mt-1">
            {job.company?.name || "Company"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {job.locations?.join(", ")} • {job.locationType}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {job.skills?.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 border border-white/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p>{job.type}</p>
          <p className="mt-1">{formatSalary(job.salaryRange)}</p>
        </div>
      </div>
    </a>
  );
}
