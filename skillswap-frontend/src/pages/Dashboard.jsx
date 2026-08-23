import {
  GraduationCap,
  ArrowLeftRight,
  Users,
  Trophy,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import StatCard from "../components/dashboard/StatCard";
import SkillsPanel from "../components/dashboard/SkillsPanel";
import SkillMatchBanner from "../components/dashboard/SkillMatchBanner";
import MatchFinder from "../components/dashboard/MatchFinder";
import LearningActivity from "../components/dashboard/LearningActivity";
import RecommendedMatches from "../components/dashboard/RecommendedMatches";

export default function Dashboard() {
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
                xl:grid-cols-[minmax(0,1fr)_310px]
              "
            >

              <ProfileSummary />

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                <StatCard
                  icon={GraduationCap}
                  value="12"
                  label="Skills Added"
                  iconClass="bg-purple-50 text-purple-600"
                />

                <StatCard
                  icon={ArrowLeftRight}
                  value="8"
                  label="Active Swaps"
                  iconClass="bg-emerald-50 text-emerald-600"
                />

                <StatCard
                  icon={Users}
                  value="36"
                  label="Successful Exchanges"
                  iconClass="bg-blue-50 text-blue-600"
                />

                <StatCard
                  icon={Trophy}
                  value="4.8"
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