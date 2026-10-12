import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";
import LiveActivityNotifications from "../common/LiveActivityNotifications";
import { ActivityCountsProvider } from "../../context/ActivityCountsContext";

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ActivityCountsProvider>
      <div className="flex h-screen overflow-hidden bg-[#f5f8fc]">
        <LiveActivityNotifications />

        {/* Desktop Sidebar */}

        <Sidebar />

        {/* Mobile Sidebar */}

        <MobileSidebar
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Content */}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ActivityCountsProvider>
  );
}
