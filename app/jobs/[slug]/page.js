"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jobApi } from "@/lib/jobApi";
import WhatsAppFab from "@/components/WhatsAppFab";
import AppHeader from "@/components/appheader/AppHeader";
import FeatureGate from "@/components/subscription/FeatureGate";

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

      {/* HEADER */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-2xl font-bold">{job.title}</h1>

        <p className="text-slate-400 mt-2">
          {job.company?.name} • {job.locations?.join(", ")} • {job.locationType}
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-400">
          <span>{job.type}</span>
          <span>{job.experienceLevel}</span>
          <span>{formatSalary(job.salaryRange)}</span>
          <span>{job.openings} openings</span>
        </div>
      </div>

      {/* APPLY BUTTON */}
      <FeatureGate featureKey="job_applications">
        <div className="mb-10">
          {job.applyMethod === "External" ? (
            <a
              href={job.externalApplyLink}
              target="_blank"
              className="bg-white text-black px-6 py-3 text-sm font-bold"
            >
              Apply Now
            </a>
          ) : (
            <a
              href={`/jobs/${job.slug}/apply`}
              className="bg-white text-black px-6 py-3 text-sm font-bold"
            >
              Easy Apply
            </a>
          )}
        </div>
      </FeatureGate>

      {/* DESCRIPTION */}
      <Section title="About the Role">
        <p className="text-sm text-slate-300 whitespace-pre-line">
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
                className="text-xs border border-white/10 px-3 py-1"
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
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i}>{req}</li>
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
                  className="border border-white/10 p-3 text-sm"
                >
                  <p className="font-medium">{step.stepName}</p>
                  {step.description && (
                    <p className="text-slate-500 text-xs mt-1">
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
          <p className="text-sm text-slate-300">
            {job.company.about || "No company description available"}
          </p>

          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              className="text-xs text-blue-400 mt-2 inline-block"
            >
              Visit Website
            </a>
          )}
        </Section>
      )}

      {/* RECRUITER */}
      {job.postedBy && (
        <Section title="Posted By">
          <div className="flex items-center gap-3">
            <img
              src={job.postedBy.profileImage}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm">{job.postedBy.name}</p>
              <p className="text-xs text-slate-500">
                {job.postedBy.headline}
              </p>
            </div>
          </div>
        </Section>
      )}

      <WhatsAppFab />
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
