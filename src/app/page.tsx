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
    ztteam_setError,
    ztteam_scrapePage,
    ztteam_addFanpage,
    ztteam_refreshFanpage,
    ztteam_deleteFanpage,
  } = ztteam_useFanpages();

  const [ztteam_modalOpen, setZTTeamModalOpen] = useState(false);
  const [ztteam_sidebarOpen, setZTTeamSidebarOpen] = useState(false);

  /** Xử lý delete fanpage */
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this fanpage?")) {
      await ztteam_deleteFanpage(id);
    }
  };

  /** Đóng modal */
  const handleCloseModal = () => {
    setZTTeamModalOpen(false);
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
          {/** Title + Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Dashboard Overview
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Welcome back! Here&apos;s what&apos;s happening across your
                pages today.
              </p>
            </div>
            <button
              onClick={() => setZTTeamModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-primary/25"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">New Fanpage</span>
            </button>
          </div>

          {/** Error Banner */}
          {ztteam_error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg flex items-center justify-between">
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {ztteam_error}
              </p>
              <button
                onClick={() => ztteam_setError(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}

          {/** Stats Grid */}
          <ZTTeamStatsGrid ztteam_fanpages={ztteam_fanpages} />

          {/** Fanpage Table */}
          <ZTTeamFanpageTable
            ztteam_fanpages={ztteam_fanpages}
            ztteam_loading={ztteam_loading}
            ztteam_onDelete={handleDelete}
            ztteam_onRefresh={ztteam_refreshFanpage}
          />
        </div>
      </main>

      {/** Add Fanpage Modal */}
      <ZTTeamAddFanpageModal
        ztteam_isOpen={ztteam_modalOpen}
        ztteam_onClose={handleCloseModal}
        ztteam_onScrape={ztteam_scrapePage}
        ztteam_onSave={ztteam_addFanpage}
      />
    </div>
  );
}
