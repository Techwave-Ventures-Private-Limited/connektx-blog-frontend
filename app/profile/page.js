"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { userApi } from "@/lib/userApi";
import { appApi } from "@/lib/appApi";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfileIdentityCard from "@/components/profile/ProfileIdentityCard";
import OnboardingDetailsGrid from "@/components/profile/OnboardingDetailsGrid";
import {
  Briefcase,
  GraduationCap,
  User,
  Info,
  Sparkles,
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import ExperienceList from "@/components/profile/ExperienceList";
import EducationList from "@/components/profile/EducationList";
import { formatDateRange } from "@/components/profile/historyUtils";

const emptyProfile = {
  name: "",
  headline: "",
  category: "",
  address: "",
};

const emptyAbout = {
  bio: "",
  skills: "",
  location: "",
  phone: "",
  website: "",
};

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// formatDateRange shared in components/profile/historyUtils.js

export default function SelfProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [isEditingOnboarding, setIsEditingOnboarding] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);

  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [aboutForm, setAboutForm] = useState(emptyAbout);
  const [onboardingFields, setOnboardingFields] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [experienceItems, setExperienceItems] = useState([]);

  const username = useMemo(() => Cookies.get("username"), []);

  const refreshUser = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (username) {
        data = await userApi.getProfileByUsername(username);
      } else {
        const selfData = await userApi.getSelf();
        const selfUser = selfData?.body || selfData?.user;
        if (selfUser?.username) {
          data = await userApi.getProfileByUsername(selfUser.username);
        } else {
          data = selfData;
        }
      }
      const fetchedUser = data?.body || data?.user || null;
      setUser(fetchedUser);

      const profileDefaults = {
        name: fetchedUser?.name || "",
        headline: fetchedUser?.headline || "",
        category: fetchedUser?.category || "",
        address: fetchedUser?.address || "",
      };
      setProfileForm(profileDefaults);

      const aboutDefaults = {
        bio: fetchedUser?.bio || "",
        skills: Array.isArray(fetchedUser?.about?.skills)
          ? fetchedUser.about.skills.join(", ")
          : Array.isArray(fetchedUser?.skills)
          ? fetchedUser.skills.join(", ")
          : "",
        location: fetchedUser?.about?.location || fetchedUser?.location || "",
        phone: fetchedUser?.about?.phone || fetchedUser?.phone || "",
        website: fetchedUser?.about?.website || fetchedUser?.website || "",
      };
      setAboutForm(aboutDefaults);

      const onboardingDetails = fetchedUser?.onboardingDetails || {};
      const onboardingList = Object.entries(onboardingDetails).map(
        ([key, value]) => ({
          key,
          value: value ?? "",
        })
      );
      setOnboardingFields(onboardingList);

      const educationList = Array.isArray(fetchedUser?.education)
        ? fetchedUser.education.map((edu) => ({
            id: edu?._id,
            institution: edu?.school || edu?.name || "",
            field: edu?.fos || "",
            degree: edu?.degree || "",
            current: Boolean(edu?.current),
            startDate: toDateInput(edu?.startDate),
            endDate: edu?.current ? "" : toDateInput(edu?.endDate),
          }))
        : [];
      setEducationItems(educationList);

      const experienceList = Array.isArray(fetchedUser?.experience)
        ? fetchedUser.experience.map((exp) => ({
            id: exp?._id,
            company: exp?.name || "",
            position: exp?.role || "",
            description: exp?.desc || "",
            current: Boolean(exp?.current),
            startDate: toDateInput(exp?.startDate),
            endDate: exp?.current ? "" : toDateInput(exp?.endDate),
          }))
        : [];
      setExperienceItems(experienceList);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({
        name: profileForm.name,
        headline: profileForm.headline,
        category: profileForm.category,
        address: profileForm.address,
      });
      setIsEditingProfile(false);
      await refreshUser();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      const skills = aboutForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await userApi.updateProfile({
        bio: aboutForm.bio,
        skills,
        location: aboutForm.location,
        phone: aboutForm.phone,
        website: aboutForm.website,
      });
      setIsEditingAbout(false);
      await refreshUser();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update about section."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOnboarding = async () => {
    setSaving(true);
    try {
      const details = onboardingFields.reduce((acc, item) => {
        if (item.key.trim()) acc[item.key.trim()] = item.value;
        return acc;
      }, {});

      await appApi.saveOnboarding(details, user?.type || "User");
      setIsEditingOnboarding(false);
      await refreshUser();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update onboarding profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEducation = async () => {
    setSaving(true);
    try {
      await userApi.updateEducation(
        educationItems.map((edu) => ({
          id: edu.id,
          institution: edu.institution,
          field: edu.field,
          degree: edu.degree,
          current: edu.current,
          startDate: edu.startDate,
          endDate: edu.current ? "Present" : edu.endDate,
        }))
      );
      setIsEditingEducation(false);
      await refreshUser();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update education."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExperience = async () => {
    setSaving(true);
    try {
      await userApi.updateExperience(
        experienceItems.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          description: exp.description,
          current: exp.current,
          startDate: exp.startDate,
          endDate: exp.current ? "Present" : exp.endDate,
        }))
      );
      setIsEditingExperience(false);
      await refreshUser();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update experience."
      );
    } finally {
      setSaving(false);
    }
  };

  const addOnboardingField = () => {
    setOnboardingFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const addEducationItem = () => {
    setEducationItems((prev) => [
      ...prev,
      {
        id: undefined,
        institution: "",
        field: "",
        degree: "",
        current: false,
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const addExperienceItem = () => {
    setExperienceItems((prev) => [
      ...prev,
      {
        id: undefined,
        company: "",
        position: "",
        description: "",
        current: false,
        startDate: "",
        endDate: "",
      },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading your profile
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <p className="text-slate-400">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <ProfileBanner bannerImage={user.bannerImage} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative -mt-20 lg:-mt-28 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <ProfileIdentityCard
              user={user}
              badge={<Sparkles className="w-5 h-5 text-white" />}
              metaItems={[
                user.address ? { label: user.address } : null,
                user.website
                  ? {
                      label: user.website,
                      href: user.website,
                    }
                  : null,
              ].filter(Boolean)}
              footer={(
                <div className="mt-6 text-xs text-slate-500">
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}
          </div>

          <div className="lg:w-2/3 space-y-8 pt-2 lg:pt-24">
            <EditableSection
              title="Onboarding Profile"
              icon={<Sparkles className="w-4 h-4" />}
              isEditing={isEditingOnboarding}
              onEdit={() => setIsEditingOnboarding(true)}
              onCancel={() => {
                setIsEditingOnboarding(false);
                setOnboardingFields(
                  Object.entries(user.onboardingDetails || {}).map(
                    ([key, value]) => ({
                      key,
                      value: value ?? "",
                    })
                  )
                );
              }}
              onSave={handleSaveOnboarding}
              saving={saving}
            >
              {isEditingOnboarding ? (
                <div className="space-y-3">
                  {onboardingFields.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Add fields to describe your role.
                    </p>
                  )}
                  {onboardingFields.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={item.key}
                        onChange={(e) =>
                          setOnboardingFields((prev) =>
                            prev.map((field, i) =>
                              i === index ? { ...field, key: e.target.value } : field
                            )
                          )
                        }
                        placeholder="Field"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                      />
                      <input
                        value={item.value}
                        onChange={(e) =>
                          setOnboardingFields((prev) =>
                            prev.map((field, i) =>
                              i === index ? { ...field, value: e.target.value } : field
                            )
                          )
                        }
                        placeholder="Value"
                        className="w-full md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOnboardingField}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300"
                  >
                    <Plus className="w-4 h-4" /> Add Field
                  </button>
                </div>
              ) : (
                <OnboardingDetailsGrid details={user.onboardingDetails} />
              )}
            </EditableSection>

            <EditableSection
              title="Profile"
              icon={<User className="w-4 h-4" />}
              isEditing={isEditingProfile}
              onEdit={() => setIsEditingProfile(true)}
              onCancel={() => {
                setIsEditingProfile(false);
                setProfileForm({
                  name: user.name || "",
                  headline: user.headline || "",
                  category: user.category || "",
                  address: user.address || "",
                });
              }}
              onSave={handleSaveProfile}
              saving={saving}
            >
              {isEditingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabeledInput
                    label="Name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <LabeledInput
                    label="Headline"
                    value={profileForm.headline}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        headline: e.target.value,
                      }))
                    }
                  />
                  <LabeledInput
                    label="Category"
                    value={profileForm.category}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                  <LabeledInput
                    label="Address"
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Name" value={user.name} />
                  <InfoRow label="Headline" value={user.headline} />
                  <InfoRow label="Category" value={user.category} />
                  <InfoRow label="Address" value={user.address} />
                </div>
              )}
            </EditableSection>

            <EditableSection
              title="About"
              icon={<Info className="w-4 h-4" />}
              isEditing={isEditingAbout}
              onEdit={() => setIsEditingAbout(true)}
              onCancel={() => {
                setIsEditingAbout(false);
                setAboutForm({
                  bio: user.bio || "",
                  skills: Array.isArray(user?.about?.skills)
                    ? user.about.skills.join(", ")
                    : "",
                  location: user?.about?.location || "",
                  phone: user?.about?.phone || "",
                  website: user?.about?.website || "",
                });
              }}
              onSave={handleSaveAbout}
              saving={saving}
            >
              {isEditingAbout ? (
                <div className="space-y-4">
                  <LabeledTextarea
                    label="Bio"
                    value={aboutForm.bio}
                    onChange={(e) =>
                      setAboutForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabeledInput
                      label="Skills (comma separated)"
                      value={aboutForm.skills}
                      onChange={(e) =>
                        setAboutForm((prev) => ({
                          ...prev,
                          skills: e.target.value,
                        }))
                      }
                    />
                    <LabeledInput
                      label="Location"
                      value={aboutForm.location}
                      onChange={(e) =>
                        setAboutForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                    <LabeledInput
                      label="Phone"
                      value={aboutForm.phone}
                      onChange={(e) =>
                        setAboutForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                    <LabeledInput
                      label="Website"
                      value={aboutForm.website}
                      onChange={(e) =>
                        setAboutForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    {user.bio || "No bio added yet."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow
                      label="Skills"
                      value={(user?.about?.skills || []).join(", ")}
                    />
                    <InfoRow label="Location" value={user?.about?.location} />
                    <InfoRow label="Phone" value={user?.about?.phone} />
                    <InfoRow label="Website" value={user?.about?.website} />
                  </div>
                </div>
              )}
            </EditableSection>

            <EditableSection
              title="Experience"
              icon={<Briefcase className="w-4 h-4" />}
              isEditing={isEditingExperience}
              onEdit={() => setIsEditingExperience(true)}
              onCancel={() => {
                setIsEditingExperience(false);
                setExperienceItems(
                  Array.isArray(user?.experience)
                    ? user.experience.map((exp) => ({
                        id: exp?._id,
                        company: exp?.name || "",
                        position: exp?.role || "",
                        description: exp?.desc || "",
                        current: Boolean(exp?.current),
                        startDate: toDateInput(exp?.startDate),
                        endDate: exp?.current ? "" : toDateInput(exp?.endDate),
                      }))
                    : []
                );
              }}
              onSave={handleSaveExperience}
              saving={saving}
            >
              {isEditingExperience ? (
                <div className="space-y-4">
                  {experienceItems.length === 0 && (
                    <p className="text-sm text-slate-400">Add your first role.</p>
                  )}
                  {experienceItems.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Role #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setExperienceItems((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="text-xs text-red-300 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <LabeledInput
                          label="Company"
                          value={exp.company}
                          onChange={(e) =>
                            setExperienceItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, company: e.target.value } : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="Position"
                          value={exp.position}
                          onChange={(e) =>
                            setExperienceItems((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, position: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="Start Date"
                          type="date"
                          value={exp.startDate}
                          onChange={(e) =>
                            setExperienceItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, startDate: e.target.value } : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="End Date"
                          type="date"
                          value={exp.endDate}
                          onChange={(e) =>
                            setExperienceItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, endDate: e.target.value } : item
                              )
                            )
                          }
                          disabled={exp.current}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            setExperienceItems((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, current: e.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        Currently working here
                      </label>
                      <LabeledTextarea
                        label="Description"
                        value={exp.description}
                        onChange={(e) =>
                          setExperienceItems((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, description: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExperienceItem}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300"
                  >
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>
              ) : (
                <ExperienceList items={user.experience} />
              )}
            </EditableSection>

            <EditableSection
              title="Education"
              icon={<GraduationCap className="w-4 h-4" />}
              isEditing={isEditingEducation}
              onEdit={() => setIsEditingEducation(true)}
              onCancel={() => {
                setIsEditingEducation(false);
                setEducationItems(
                  Array.isArray(user?.education)
                    ? user.education.map((edu) => ({
                        id: edu?._id,
                        institution: edu?.school || edu?.name || "",
                        field: edu?.fos || "",
                        degree: edu?.degree || "",
                        current: Boolean(edu?.current),
                        startDate: toDateInput(edu?.startDate),
                        endDate: edu?.current ? "" : toDateInput(edu?.endDate),
                      }))
                    : []
                );
              }}
              onSave={handleSaveEducation}
              saving={saving}
            >
              {isEditingEducation ? (
                <div className="space-y-4">
                  {educationItems.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Add your first education entry.
                    </p>
                  )}
                  {educationItems.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Entry #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setEducationItems((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="text-xs text-red-300 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <LabeledInput
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, institution: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, degree: e.target.value } : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="Field of Study"
                          value={edu.field}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, field: e.target.value } : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="Start Date"
                          type="date"
                          value={edu.startDate}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, startDate: e.target.value } : item
                              )
                            )
                          }
                        />
                        <LabeledInput
                          label="End Date"
                          type="date"
                          value={edu.endDate}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, endDate: e.target.value } : item
                              )
                            )
                          }
                          disabled={edu.current}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) =>
                            setEducationItems((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, current: e.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        Currently studying here
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEducationItem}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300"
                  >
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
              ) : (
                <EducationList items={user.education} />
              )}
            </EditableSection>
          </div>
        </div>
      </div>
    </div>
  );
}
function EditableSection({
  title,
  icon,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  saving,
  children,
}) {
  return (
    <section className="bg-slate-950/40 border border-white/5 rounded-[2rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
          {icon}
          {title}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500 text-black text-xs font-bold uppercase tracking-widest"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <label className="text-xs text-slate-400 uppercase tracking-widest">
      <span className="block mb-2">{label}</span>
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

function LabeledTextarea({ label, ...props }) {
  return (
    <label className="text-xs text-slate-400 uppercase tracking-widest">
      <span className="block mb-2">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-200">{value || "---"}</p>
    </div>
  );
}
