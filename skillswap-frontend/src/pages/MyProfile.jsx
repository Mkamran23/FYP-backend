import { Camera, Check, MapPin, Save, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { fetchSkillCatalog } from "../store/skillsSlice";

function SkillSelector({ title, selectedIds, catalog, onToggle }) {
  const groupedSkills = useMemo(() => catalog.reduce((groups, skill) => {
    const category = skill.category || "Other";
    groups[category] = [...(groups[category] || []), skill];
    return groups;
  }, {}), [catalog]);

  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">Select up to 20 skills from the catalog.</p>
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="mt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const selected = selectedIds.includes(skill._id);
              return <button key={skill._id} type="button" onClick={() => onToggle(skill._id)} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"}`}>
                {selected && <Check size={14} />}{skill.name}
              </button>;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function MyProfile() {
  const dispatch = useDispatch();
  const { user, updateProfile, uploadProfilePhoto } = useAuth();
  const { catalog, status: catalogStatus, error: catalogError } = useSelector((state) => state.skills);
  const [form, setForm] = useState(() => ({
    name: user?.name || "", bio: user?.bio || "", location: user?.location || "",
    skillsToTeach: user?.skillsToTeach?.map((skill) => skill.id) || [],
    skillsToLearn: user?.skillsToLearn?.map((skill) => skill.id) || [],
  }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => { if (catalogStatus === "idle") dispatch(fetchSkillCatalog()); }, [catalogStatus, dispatch]);

  const toggleSkill = (field, skillId) => {
    const selected = form[field];
    if (selected.includes(skillId)) {
      setForm((current) => ({ ...current, [field]: current[field].filter((id) => id !== skillId) }));
      return;
    }
    if (selected.length >= 20) {
      setError("You can select up to 20 skills in each list.");
      return;
    }
    setError("");
    setForm((current) => ({ ...current, [field]: [...current[field], skillId] }));
  };

  const handlePhotoChange = async (event) => {
    const photo = event.target.files?.[0];
    if (!photo) return;
    setError(""); setSuccess(""); setIsUploadingPhoto(true);
    try { await uploadProfilePhoto(photo); setSuccess("Profile photo uploaded successfully."); }
    catch (uploadError) { setError(uploadError.message || "Unable to upload your profile photo."); }
    finally { setIsUploadingPhoto(false); event.target.value = ""; }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); setSuccess(""); setIsSaving(true);
    try { await updateProfile(form); setSuccess("Your profile has been saved."); }
    catch (submissionError) { setError(submissionError.message || "Unable to save your profile."); }
    finally { setIsSaving(false); }
  };

  return <DashboardLayout><div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
    <div className="mb-6"><p className="text-sm font-semibold text-blue-600">My profile</p><h1 className="mt-1 text-2xl font-bold text-slate-800">Manage your skills</h1><p className="mt-2 text-sm text-slate-500">Choose what you can teach and what you want to learn.</p></div>
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}
      <section className="flex items-center gap-4 border-b border-slate-100 pb-5"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-700">{user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase() || "?"}</div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700"><Camera size={16} />{isUploadingPhoto ? "Uploading..." : "Upload photo"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={isUploadingPhoto} onChange={handlePhotoChange} className="sr-only" /></label></section>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><UserRound size={16} />Display name</span><input required maxLength={50} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} />Location</span><input maxLength={100} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="e.g. Karachi, Pakistan" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label></div>
      <label className="block"><span className="mb-2 block text-sm font-semibold">Bio</span><textarea maxLength={500} rows={4} value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><span className="block text-right text-xs text-slate-400">{form.bio.length}/500</span></label>
      {catalogStatus === "loading" && <p className="text-sm text-slate-500">Loading skill catalog...</p>}
      {catalogError && <p role="alert" className="text-sm text-red-600">{catalogError}</p>}
      {catalogStatus === "succeeded" && <div className="grid gap-5 lg:grid-cols-2"><SkillSelector title="Skills to Teach" selectedIds={form.skillsToTeach} catalog={catalog} onToggle={(id) => toggleSkill("skillsToTeach", id)} /><SkillSelector title="Skills to Learn" selectedIds={form.skillsToLearn} catalog={catalog} onToggle={(id) => toggleSkill("skillsToLearn", id)} /></div>}
      <div className="flex justify-end border-t border-slate-100 pt-5"><button type="submit" disabled={isSaving || catalogStatus === "loading"} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save size={16} />{isSaving ? "Saving..." : "Save profile"}</button></div>
    </form>
  </div></DashboardLayout>;
}
