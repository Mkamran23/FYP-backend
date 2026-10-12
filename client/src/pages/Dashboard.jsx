import { GraduationCap, ArrowLeftRight, Users, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../auth/AuthContext";
import { reviewService } from "../services/reviewService";
import { swapRequestService } from "../services/swapRequestService";
import { recentProfiles } from "../services/recentProfiles";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import StatCard from "../components/dashboard/StatCard";
import SkillsPanel from "../components/dashboard/SkillsPanel";
import SkillMatchBanner from "../components/dashboard/SkillMatchBanner";
import MatchFinder from "../components/dashboard/MatchFinder";
import LearningActivity from "../components/dashboard/LearningActivity";
import RecommendedMatches from "../components/dashboard/RecommendedMatches";
import RecentlyViewedProfiles from "../components/dashboard/RecentlyViewedProfiles";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [trustScore, setTrustScore] = useState(null);
  const [swapCounts, setSwapCounts] = useState({
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [viewedProfiles, setViewedProfiles] = useState(() =>
    recentProfiles.get(user?.id),
  );
  useEffect(() => {
    if (!user?.id || !token) return;
    reviewService
      .getForUser(user.id, token)
      .then((data) =>
        setTrustScore(data.summary.count ? data.summary.trustScore : null),
      )
      .catch(() => setTrustScore(null));
  }, [user?.id, token]);
  useEffect(() => {
    if (!token) return;
    swapRequestService
      .getMine(token)
      .then(({ requests }) =>
        setSwapCounts({
          active: requests.filter((request) => request.status === "accepted")
            .length,
          pending: requests.filter((request) => request.status === "pending")
            .length,
          completed: requests.filter(
            (request) => request.status === "completed",
          ).length,
        }),
      )
      .catch(() => setSwapCounts({ active: 0, pending: 0, completed: 0 }));
    setViewedProfiles(recentProfiles.get(user?.id));
  }, [token, user?.id]);
  return (
    <DashboardLayout>
      <div className="p-2 sm:p-3 lg:p-4">
        <div
          className="
            grid
            grid-cols-1
            gap-3
            xl:grid-cols-[minmax(0,1fr)_200px]
          "
        >
          {/* MAIN */}

          <div className="min-w-0 space-y-3">
            {/* Profile + Stats */}

            <div
              className="
                grid
                grid-cols-1
                gap-2
                lg:grid-cols-[minmax(0,1fr)_300px]
                xl:grid-cols-[minmax(0,1fr)_365px]
              "
            >
              <ProfileSummary />

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatCard
                  icon={GraduationCap}
                  value={swapCounts.pending}
                  label="Pending Requests"
                  iconClass="bg-purple-50 text-purple-600"
                />

                <StatCard
                  icon={ArrowLeftRight}
                  value={swapCounts.active}
                  label="Active Swaps"
                  iconClass="bg-emerald-50 text-emerald-600"
                />

                <StatCard
                  icon={Users}
                  value={swapCounts.completed}
                  label="Completed Exchanges"
                  iconClass="bg-blue-50 text-blue-600"
                />

                <StatCard
                  icon={Trophy}
                  value={trustScore === null ? "—" : `${trustScore}/100`}
                  label="Trust Score"
                  iconClass="bg-red-50 text-red-500"
                />
              </div>
            </div>

            {/* Skills */}

            <SkillsPanel />

            {/* Banner */}

            <SkillMatchBanner />

            {/* Recommended */}

            <RecommendedMatches />

            <RecentlyViewedProfiles profiles={viewedProfiles} />

            {/* Mobile-only right sidebar content naturally appears
                below because of the parent grid */}

            <div className="space-y-3 xl:hidden">
              <MatchFinder />

              <LearningActivity />
            </div>
          </div>

          {/* DESKTOP RIGHT SIDEBAR */}

          <aside className="hidden space-y-3 xl:block">
            <MatchFinder />

            <LearningActivity />
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
