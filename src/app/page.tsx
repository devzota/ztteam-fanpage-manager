"use client";

import { useState } from "react";
import { ztteam_useFanpages } from "@/hooks/ztteam_useFanpages";
import ZTTeamSidebar from "@/components/ZTTeamSidebar";
import ZTTeamHeader from "@/components/ZTTeamHeader";
import ZTTeamStatsGrid from "@/components/ZTTeamStatsGrid";
import ZTTeamFanpageTable from "@/components/ZTTeamFanpageTable";
import ZTTeamAddFanpageModal from "@/components/ZTTeamAddFanpageModal";

/** Trang chính - Dashboard */
export default function ZTTeamHomePage() {
  const {
    ztteam_fanpages,
    ztteam_loading,
    ztteam_error,
    ztteam_scrapePage,
    ztteam_addFanpage,
    ztteam_deleteFanpage,
    setZTTeamError,
  } = ztteam_useFanpages();

  const [ztteam_modalOpen, setZTTeamModalOpen] = useState(false);
  const [ztteam_sidebarOpen, setZTTeamSidebarOpen] = useState(false);

  const ztteam_handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this fanpage?")) {
      await ztteam_deleteFanpage(id);
    }
  };

  return (
    <div className="flex min-h-screen">
      <ZTTeamSidebar
        ztteam_isOpen={ztteam_sidebarOpen}
        ztteam_onClose={() => setZTTeamSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <ZTTeamHeader ztteam_onMenuClick={() => setZTTeamSidebarOpen(true)} />

        <div className="p-4 sm:p-8 space-y-4 sm:space-y-8 overflow-y-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Welcome back! Here&apos;s what&apos;s happening across your pages today.
            </p>
          </div>

          {ztteam_error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg flex items-center justify-between">
              <p className="text-sm text-rose-600 dark:text-rose-400">{ztteam_error}</p>
              <button
                onClick={() => setZTTeamError(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}

          <ZTTeamStatsGrid ztteam_fanpages={ztteam_fanpages} />

          <ZTTeamFanpageTable
            ztteam_fanpages={ztteam_fanpages}
            ztteam_loading={ztteam_loading}
            ztteam_onAddClick={() => setZTTeamModalOpen(true)}
            ztteam_onDelete={ztteam_handleDelete}
          />
        </div>
      </main>

      <ZTTeamAddFanpageModal
        ztteam_isOpen={ztteam_modalOpen}
        ztteam_onClose={() => setZTTeamModalOpen(false)}
        ztteam_onScrape={ztteam_scrapePage}
        ztteam_onSave={ztteam_addFanpage}
      />
    </div>
  );
}
