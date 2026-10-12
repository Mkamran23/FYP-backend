import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { userService } from "../services/userService";
import { reviewService } from "../services/reviewService";
import { adminService } from "../services/adminService";
import { recentProfiles } from "../services/recentProfiles";

function Skills({ title, skills, className }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill.id}
              className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}
            >
              {skill.name}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">No skills selected.</p>
        )}
      </div>
    </section>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    let active = true;
    userService
      .getPublicProfile(id, token)
      .then((data) => {
        if (active) {
          setMember(data.user);
          recentProfiles.add(user?.id, data.user);
        }
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.message || "Unable to load this member profile.",
          );
      });
    reviewService
      .getForUser(id, token)
      .then((data) => {
        if (active) setReviewData(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [id, token, user?.id]);

  const reportMember = async () => {
    const reason = window.prompt("Why are you reporting this member?");
    if (!reason?.trim()) return;
    try {
      await adminService.reportUser(
        { reportedUserId: id, contentType: "user", reason },
        token,
      );
      setReportMessage("Report submitted for moderator review.");
    } catch (requestError) {
      setReportMessage(requestError.message || "Unable to submit report.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to matches
          </Link>
          <button
            type="button"
            onClick={reportMember}
            className="text-xs font-semibold text-red-600"
          >
            Report member
          </button>
        </div>
        {reportMessage && (
          <p
            role="status"
            className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-700"
          >
            {reportMessage}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {!member && !error && (
          <p className="mt-4 text-sm text-slate-500">
            Loading member profile...
          </p>
        )}
        {member && (
          <div className="mt-4 space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    {member.name}
                  </h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin size={14} />
                    {member.location || "Location not set"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {member.bio || "This member has not added a bio yet."}
                  </p>
                  {reviewData && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <p className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        <Star size={15} fill="currentColor" />
                        Trust Score:{" "}
                        {reviewData.summary.count
                          ? `${reviewData.summary.trustScore}/100`
                          : "No ratings yet"}
                      </p>
                      {reviewData.summary.count > 0 && (
                        <p className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                          <Star size={15} fill="currentColor" />
                          {reviewData.summary.average}/5 (
                          {reviewData.summary.count} reviews)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
            <div className="grid gap-5 sm:grid-cols-2">
              <Skills
                title="Skills they teach"
                skills={member.skillsToTeach}
                className="bg-emerald-50 text-emerald-700"
              />
              <Skills
                title="Skills they want to learn"
                skills={member.skillsToLearn}
                className="bg-indigo-50 text-indigo-700"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
