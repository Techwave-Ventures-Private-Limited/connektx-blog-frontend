"use client";

export default function ExperienceVerifyDialog({
  open,
  onClose,
  user,
  experienceId,
  setExperienceId,
  workEmail,
  setWorkEmail,
  workOtp,
  setWorkOtp,
  otpSent,
  onSendOtp,
  onVerifyOtp,
  verifying,
}) {
  if (!open) return null;

  const inputClass =
    "w-full bg-black border border-white/10 p-3 rounded-sm outline-none focus:border-white/30 text-white text-sm";

  return (
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
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          {Array.isArray(user?.experience) && user.experience.length > 0 ? (
            <select
              className={inputClass}
              value={experienceId}
              onChange={(e) => setExperienceId(e.target.value)}
            >
              <option value="">Select experience</option>
              {user.experience.map((exp) => (
                <option key={exp?._id} value={exp?._id}>
                  {exp?.role || "Role"} @ {exp?.name || "Company"}
                  {exp?.isVerified ? " (Verified)" : ""}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-slate-500">
              No experience found. Please add experience in your profile first.
            </p>
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
              onClick={onSendOtp}
              disabled={verifying || !experienceId}
              className="px-4 py-2 border border-white/10 text-xs uppercase tracking-widest"
            >
              {verifying ? "Sending..." : "Send OTP"}
            </button>
            {otpSent && (
              <button
                type="button"
                onClick={onVerifyOtp}
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
  );
}
