"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/appheader/AppHeader";
import WhatsAppFab from "@/components/WhatsAppFab";
import { jobApi } from "@/lib/jobApi";
import { applicationApi } from "@/lib/applicationApi";

export default function JobApplyPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const questions = useMemo(() => {
    if (!job?.screeningQuestions || !Array.isArray(job.screeningQuestions)) {
      return [];
    }
    return job.screeningQuestions;
  }, [job]);

  const handleAnswerChange = (index, value) => {
    setScreeningAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!job?._id) {
      setError("Job not found.");
      return;
    }

    if (job.applyMethod === "External") {
      setError("This job requires applying on an external website.");
      return;
    }

    if (!resumeFile && !resumeLink) {
      setError("Please upload your resume or provide a resume link.");
      return;
    }

    setSubmitting(true);

    try {
      const answersPayload = questions.map((q, idx) => ({
        question: q,
        answer: screeningAnswers[idx] || "",
      }));

      if (resumeFile) {
        const formData = new FormData();
        formData.append("jobId", job._id);
        formData.append("resume", resumeFile);
        if (coverLetter) formData.append("coverLetter", coverLetter);
        if (email) formData.append("email", email);
        if (phoneNumber) formData.append("phoneNumber", phoneNumber);
        if (answersPayload.length > 0) {
          formData.append("screeningAnswers", JSON.stringify(answersPayload));
        }

        await applicationApi.applyForJob(formData);
      } else {
        await applicationApi.applyForJob({
          jobId: job._id,
          resume: resumeLink,
          coverLetter,
          email,
          phoneNumber,
          screeningAnswers: answersPayload,
        });
      }

      setSuccess("Application submitted successfully.");
      setCoverLetter("");
      setEmail("");
      setPhoneNumber("");
      setResumeFile(null);
      setResumeLink("");
      setScreeningAnswers({});
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to submit application.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

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

  const inputClass =
    "w-full bg-black border border-white/10 p-3 rounded-sm outline-none focus:border-white/30 text-white text-sm";

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10 max-w-4xl mx-auto">
      <AppHeader description="Apply with your resume and details" />

      <div className="border border-white/10 p-5 mb-8">
        <h1 className="text-xl font-bold">{job.title}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {job.company?.name} • {job.locations?.join(", ")} •{" "}
          {job.locationType}
        </p>
        {job.applyMethod === "External" && (
          <div className="mt-4 text-sm text-yellow-400">
            This job requires external application.{" "}
            {job.externalApplyLink && (
              <a
                href={job.externalApplyLink}
                target="_blank"
                className="underline"
              >
                Open link
              </a>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
            Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            className={inputClass}
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-slate-500 mt-2">
            Or provide a resume link below
          </p>
          <input
            type="url"
            placeholder="https://..."
            className={`${inputClass} mt-2`}
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            className={inputClass}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
            Cover Letter
          </label>
          <textarea
            rows={6}
            className={inputClass}
            placeholder="Write a short note to the recruiter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-slate-500">
              Screening Questions
            </h2>
            {questions.map((q, idx) => (
              <div key={idx}>
                <label className="block text-sm mb-2">{q}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={screeningAnswers[idx] || ""}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400 border border-red-400/30 p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-400 border border-green-400/30 p-3">
            {success}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || job.applyMethod === "External"}
            className="bg-white text-black px-6 py-3 text-sm font-bold disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/jobs/${job.slug}`)}
            className="px-4 py-3 text-sm border border-white/10"
          >
            Back to Job
          </button>
        </div>
      </form>

      <WhatsAppFab />
    </div>
  );
}
