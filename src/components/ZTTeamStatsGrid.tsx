"use client";

import { ZTTeamFanpage } from "@/hooks/ztteam_useFanpages";

interface ZTTeamStatsGridProps {
  ztteam_fanpages: ZTTeamFanpage[];
}

/** Dashboard stats overview - responsive 4 cards */
export default function ZTTeamStatsGrid({ ztteam_fanpages }: ZTTeamStatsGridProps) {
  const ztteam_totalPages = ztteam_fanpages.length;
  const ztteam_activePages = ztteam_fanpages.filter((p) => p.status === "active").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="size-10 sm:size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl sm:text-2xl">pages</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">Total Fanpages</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{ztteam_totalPages}</h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="size-10 sm:size-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl sm:text-2xl">group</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">Active Pages</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{ztteam_activePages}</h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="size-10 sm:size-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl sm:text-2xl">bolt</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">Avg. Engagement</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">4.52%</h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="size-10 sm:size-12 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl sm:text-2xl">mail</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">New Messages</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">128</h3>
      </div>
    </div>
  );
}
