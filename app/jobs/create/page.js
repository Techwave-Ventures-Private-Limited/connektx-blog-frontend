"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/appheader/AppHeader";
import WhatsAppFab from "@/components/WhatsAppFab";
import { jobApi } from "@/lib/jobApi";
import { userApi } from "@/lib/userApi";
import { experienceApi } from "@/lib/experienceApi";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationsInput, setLocationsInput] = useState("");
  const [locationType, setLocationType] = useState("On-site");
  const [openings, setOpenings] = useState(1);
  const [type, setType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [skillsInput, setSkillsInput] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("INR");
  const [salaryPeriod, setSalaryPeriod] = useState("Yearly");
  const [salaryDisclosed, setSalaryDisclosed] = useState(true);
  const [applyMethod, setApplyMethod] = useState("EasyApply");
  const [externalApplyLink, setExternalApplyLink] = useState("");
  const [experienceId, setExperienceId] = useState("");
  const [customStages, setCustomStages] = useState([
    { name: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [workEmail, setWorkEmail] = useState("");
  const [workOtp, setWorkOtp] = useState("");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [selectedExperienceLabel, setSelectedExperienceLabel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full bg-black border border-white/10 p-3 rounded-sm outline-none focus:border-white/30 text-white text-sm";

  const parseList = (value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleStageChange = (index, field, value) => {
    setCustomStages((prev) =>
      prev.map((stage, i) =>
        i === index ? { ...stage, [field]: value } : stage
      )
    );
  };

  const addStage = () =>
    setCustomStages((prev) => [...prev, { name: "", description: "" }]);

  const removeStage = (index) =>
    setCustomStages((prev) => prev.filter((_, i) => i !== index));

  const fetchSelf = async () => {
    try {
      setUserLoading(true);
      const selfData = await userApi.getSelf();
      const fetchedUser = selfData?.body || selfData?.user || selfData || null;
      setUser(fetchedUser);

      const verifiedExperience = Array.isArray(fetchedUser?.experience)
        ? fetchedUser.experience.find((exp) => exp?.isVerified)
        : null;
      if (verifiedExperience?._id) {
        setExperienceId(verifiedExperience._id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchSelf();
  }, []);

  const hasVerifiedExperience = Array.isArray(user?.experience)
    ? user.experience.some((exp) => exp?.isVerified)
    : false;
  const canPostJob = user?.type === "Company" || hasVerifiedExperience;

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    if (!experienceId || !workEmail) {
      setError("Experience ID and work email are required.");
      return;
    }
    setVerifying(true);
    try {
      await experienceApi.sendWorkOtp({ email: workEmail, experienceId });
      setOtpSent(true);
      setSuccess("OTP sent to your work email.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to send OTP.";
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");
    if (!experienceId || !workEmail || !workOtp) {
      setError("Experience ID, work email, and OTP are required.");
      return;
    }
    setVerifying(true);
    try {
      await experienceApi.verifyWorkOtp({
        email: workEmail,
        otp: workOtp,
        experienceId,
      });
      setSuccess("Experience verified successfully.");
      setOtpSent(false);
      setWorkOtp("");
      await fetchSelf();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to verify OTP.";
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const locations = parseList(locationsInput);
    if (!title || !description || locations.length === 0) {
      setError("Title, Description, and at least one Location are required.");
      return;
    }

    const skills = parseList(skillsInput);
    const requirements = parseList(requirementsInput);

    const cleanedStages = customStages
      .map((s) => ({
        name: s.name.trim(),
        description: s.description.trim(),
      }))
      .filter((s) => s.name);

    const salaryRange =
      salaryMin || salaryMax || salaryCurrency || salaryPeriod
        ? {
            min: salaryMin ? Number(salaryMin) : undefined,
            max: salaryMax ? Number(salaryMax) : undefined,
            currency: salaryCurrency || "INR",
            isDisclosed: Boolean(salaryDisclosed),
            period: salaryPeriod,
          }
        : undefined;

    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        locations,
        locationType,
        openings: Number(openings) || 1,
        type,
        experienceLevel,
        salaryRange,
        skills,
        requirements,
        experienceId: experienceId || undefined,
        applyMethod,
        externalApplyLink: applyMethod === "External" ? externalApplyLink : undefined,
        customStages: cleanedStages.length > 0 ? cleanedStages : undefined,
      };

      const res = await jobApi.createJob(payload);
      setSuccess("Job posted successfully.");

      const createdSlug = res?.data?.slug;
      if (createdSlug) {
        router.push(`/jobs/${createdSlug}`);
      } else {
        router.push("/jobs");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create job.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <AppHeader description="Post a job for builders and explorers" />

      <div className="border border-white/10 p-4 mb-8">
        <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Posting As
        </h2>
        {userLoading ? (
          <p className="text-sm text-slate-400">Loading recruiter info...</p>
        ) : user ? (
          <div className="space-y-1 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Name:</span> {user.name || "---"}
            </p>
            <p>
              <span className="text-slate-500">Email:</span>{" "}
              {user.email || "---"}
            </p>
            <p>
              <span className="text-slate-500">Account Type:</span>{" "}
              {user.type || "User"}
            </p>
            {user.headline && (
              <p>
                <span className="text-slate-500">Headline:</span>{" "}
                {user.headline}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            Unable to load recruiter info.
          </p>
        )}
      </div>

      {!canPostJob && (
        <div className="border border-white/10 p-4 mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-1">
              Verify Experience to Post
            </h3>
            <p className="text-xs text-slate-500">
              Only verified work experience can post jobs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowVerifyDialog(true)}
            className="px-4 py-2 bg-white text-black text-xs uppercase tracking-widest"
          >
            Verify Now
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Job Title
            </label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Engineer"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Openings
            </label>
            <input
              type="number"
              min="1"
              className={inputClass}
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
            Description
          </label>
          <textarea
            rows={6}
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role, responsibilities, and impact..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Locations (comma separated)
            </label>
            <input
              className={inputClass}
              value={locationsInput}
              onChange={(e) => setLocationsInput(e.target.value)}
              placeholder="Pune, Bangalore"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Location Type
            </label>
            <select
              className={inputClass}
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Job Type
            </label>
            <select
              className={inputClass}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Experience Level
            </label>
            <select
              className={inputClass}
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Fresher">Fresher</option>
              <option value="Entry Level (1-2 years)">
                Entry Level (1-2 years)
              </option>
              <option value="Mid Level (3-5 years)">
                Mid Level (3-5 years)
              </option>
              <option value="Senior level (5+ years)">
                Senior level (5+ years)
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Skills (comma separated)
            </label>
            <input
              className={inputClass}
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, AWS"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Requirements (comma separated)
            </label>
            <input
              className={inputClass}
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="3+ years experience, portfolio"
            />
          </div>
        </div>

        <div className="border border-white/10 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-slate-500">
              Salary Range
            </h3>
            <label className="text-xs text-slate-500 flex items-center gap-2">
              <input
                type="checkbox"
                checked={salaryDisclosed}
                onChange={(e) => setSalaryDisclosed(e.target.checked)}
              />
              Disclosed
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              className={inputClass}
              placeholder="Min"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
            <input
              type="number"
              className={inputClass}
              placeholder="Max"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Currency"
              value={salaryCurrency}
              onChange={(e) => setSalaryCurrency(e.target.value)}
            />
            <select
              className={inputClass}
              value={salaryPeriod}
              onChange={(e) => setSalaryPeriod(e.target.value)}
            >
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="border border-white/10 p-4 space-y-4">
          <h3 className="text-sm uppercase tracking-widest text-slate-500">
            Application Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className={inputClass}
              value={applyMethod}
              onChange={(e) => setApplyMethod(e.target.value)}
            >
              <option value="EasyApply">Easy Apply</option>
              <option value="External">External</option>
            </select>
            <input
              className={inputClass}
              placeholder="External apply link"
              value={externalApplyLink}
              onChange={(e) => setExternalApplyLink(e.target.value)}
              disabled={applyMethod !== "External"}
            />
          </div>
        </div>

        <div className="border border-white/10 p-4 space-y-4">
          <h3 className="text-sm uppercase tracking-widest text-slate-500">
            Hiring Workflow (optional)
          </h3>
          <p className="text-xs text-slate-500">
            Add custom stages like Assessment, Interview 1, Final Round.
          </p>

          <div className="space-y-3">
            {customStages.map((stage, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  className={`${inputClass} md:col-span-2`}
                  placeholder="Stage name"
                  value={stage.name}
                  onChange={(e) =>
                    handleStageChange(index, "name", e.target.value)
                  }
                />
                <input
                  className={`${inputClass} md:col-span-3`}
                  placeholder="Description (optional)"
                  value={stage.description}
                  onChange={(e) =>
                    handleStageChange(index, "description", e.target.value)
                  }
                />
                {customStages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStage(index)}
                    className="text-xs text-slate-400 hover:text-white md:col-span-5"
                  >
                    Remove stage
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStage}
            className="text-xs border border-white/10 px-3 py-2"
          >
            Add Stage
          </button>
        </div>

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
            disabled={submitting || !canPostJob}
            className="bg-white text-black px-6 py-3 text-sm font-bold disabled:opacity-40"
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/jobs")}
            className="px-4 py-3 text-sm border border-white/10"
          >
            Cancel
          </button>
        </div>
      </form>

      {showVerifyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg bg-black border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-500">
                  Verify Experience
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Use your official work email to verify your experience.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVerifyDialog(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                {Array.isArray(user?.experience) && user.experience.length > 0 ? (
                  user.experience.map((exp) => (
                    <div
                      key={exp?._id}
                      className="flex items-center justify-between border border-white/10 p-3"
                    >
                      <div className="text-sm">
                        <p className="text-slate-200">
                          {exp?.role || "Role"} @ {exp?.name || "Company"}
                        </p>
                        {exp?.isVerified && (
                          <p className="text-xs text-green-400">Verified</p>
                        )}
                      </div>
                      {exp?.isVerified ? (
                        <button
                          type="button"
                          className="px-3 py-1 text-xs border border-white/10 text-slate-400"
                          disabled
                        >
                          Verified
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setExperienceId(exp?._id || "");
                            setSelectedExperienceLabel(
                              `${exp?.role || "Role"} @ ${
                                exp?.name || "Company"
                              }`
                            );
                          }}
                          className="px-3 py-1 text-xs bg-white text-black"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No experience found. Please add experience in your profile
                    first.
                  </p>
                )}
              </div>

              {experienceId && (
                <div className="text-xs text-slate-400">
                  Selected: {selectedExperienceLabel}
                </div>
              )}

              <input
                type="email"
                className={inputClass}
                placeholder="Work email (official)"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                disabled={!experienceId}
              />
              {otpSent && (
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter OTP"
                  value={workOtp}
                  onChange={(e) => setWorkOtp(e.target.value)}
                />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={verifying || !experienceId}
                  className="px-4 py-2 border border-white/10 text-xs uppercase tracking-widest"
                >
                  {verifying ? "Sending..." : "Send OTP"}
                </button>
                {otpSent && (
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifying}
                    className="px-4 py-2 bg-white text-black text-xs uppercase tracking-widest"
                  >
                    {verifying ? "Verifying..." : "Verify OTP"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <WhatsAppFab />
    </div>
  );
}
