"use client";
import { useEffect, useState } from "react";
import { experienceApi } from "@/lib/experienceApi";

export default function ExperienceVerifyDialog({
  open,
  onClose,
  user,
  experienceId,
  setExperienceId,
  onVerified,
}) {
  if (!open) return null;

  const inputClass =
    "w-full bg-black border border-white/10 p-3 rounded-sm outline-none focus:border-white/30 text-white text-sm";

  const [workEmail, setWorkEmail] = useState("");
  const [workOtp, setWorkOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setWorkEmail("");
    setWorkOtp("");
    setOtpSent(false);
    setVerifying(false);
    setLocalError("");
    setShowSuccess(false);
  }, [open]);

  const handleSendOtp = async () => {
    setLocalError("");
    if (!experienceId || !workEmail) {
      setLocalError("Experience and work email are required.");
      return;
    }
    setVerifying(true);
    try {
      await experienceApi.sendWorkOtp({ email: workEmail, experienceId });
      setOtpSent(true);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to send OTP.";
      setLocalError(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLocalError("");
    if (!experienceId || !workEmail || !workOtp) {
      setLocalError("Experience, work email, and OTP are required.");
      return;
    }
    setVerifying(true);
    try {
      await experienceApi.verifyWorkOtp({
        email: workEmail,
        otp: workOtp,
        experienceId,
      });
      setShowSuccess(true);
      if (onVerified) {
        await onVerified();
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to verify OTP.";
      setLocalError(message);
    } finally {
      setVerifying(false);
    }
  };

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
          {showSuccess && (
            <div className="border border-green-400/30 text-green-400 text-sm px-4 py-3">
              Experience verified successfully.
            </div>
          )}

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

          {localError && (
            <div className="text-sm text-red-400 border border-red-400/30 p-3">
              {localError}
            </div>
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
  );
}
