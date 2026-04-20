"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jobApi } from "@/lib/jobApi";
import WhatsAppFab from "@/components/WhatsAppFab";
import AppHeader from "@/components/appheader/AppHeader";
import FeatureGate from "@/components/subscription/FeatureGate";
import { MapPin, Clock, Briefcase, Users, TrendingUp, ExternalLink, ArrowLeft } from "lucide-react";

export default function JobDetailPage() {
  const { slug } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await jobApi.getJobBySlug(slug);
      setJob(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <p className="text-slate-500">Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <p className="text-slate-500">Job not found</p>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary || !salary.isDisclosed) return "Not Disclosed";

    const min = salary.min ? `₹${salary.min}` : "";
    const max = salary.max ? ` - ₹${salary.max}` : "";
    const period = salary.period === "Monthly" ? "/month" : "/year";

    return `${min}${max} ${period}`;
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <AppHeader description="Job details and application info" />

      {/* Back Button */}
      <a
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </a>

      {/* HEADER */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{job.title}</h1>

            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">{job.company?.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.locations?.join(", ")}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {job.type}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {job.experienceLevel}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {job.openings} openings
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
              Salary
            </div>
            <div className="text-xl font-bold text-white">
              {formatSalary(job.salaryRange)}
            </div>
          </div>
        </div>

        {/* Location Type Badge */}
        <div className="inline-block bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs">
          {job.locationType}
        </div>
      </div>

      {/* APPLY BUTTON */}
      <FeatureGate featureKey="job_applications">
        <div className="mb-8">
          {job.applyMethod === "External" ? (
            <a
              href={job.externalApplyLink}
              target="_blank"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <a
              href={`/jobs/${job.slug}/apply`}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Easy Apply
            </a>
          )}
        </div>
      </FeatureGate>

      <div className="space-y-6">
        {/* DESCRIPTION */}
        <Section title="About the Role">
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </Section>

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <Section title="Skills Required">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* REQUIREMENTS */}
        {job.requirements?.length > 0 && (
          <Section title="Requirements">
            <ul className="space-y-2.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* HIRING WORKFLOW */}
        {job.hiringWorkflow?.length > 0 && (
          <Section title="Hiring Process">
            <div className="space-y-3">
              {job.hiringWorkflow
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="font-medium">{step.stepName}</p>
                    </div>
                    {step.description && (
                      <p className="text-slate-400 text-xs ml-9">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* COMPANY */}
        {job.company && (
          <Section title="About Company">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {job.company.about || "No company description available"}
              </p>

              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Section>
        )}

        {/* RECRUITER */}
        {job.postedBy && (
          <Section title="Posted By">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
              <img
                src={job.postedBy.profileImage}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-white/20"
              />
              <div>
                <p className="text-sm font-medium">{job.postedBy.name}</p>
                <p className="text-xs text-slate-400">
                  {job.postedBy.headline}
                </p>
              </div>
            </div>
          </Section>
        )}
      </div>

      <WhatsAppFab />
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-medium">
        {title}
      </h2>
      {children}
    </div>
  );
}
