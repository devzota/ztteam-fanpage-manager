"use client";

import { ZTTeamFanpage } from "@/hooks/ztteam_useFanpages";

interface ZTTeamFanpageTableProps {
  ztteam_fanpages: ZTTeamFanpage[];
  ztteam_loading: boolean;
  ztteam_onAddClick: () => void;
  ztteam_onDelete: (id: string) => void;
}

/** Bảng danh sách fanpage - responsive */
export default function ZTTeamFanpageTable({
  ztteam_fanpages,
  ztteam_loading,
  ztteam_onAddClick,
  ztteam_onDelete,
}: ZTTeamFanpageTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold">Recent Fanpages</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={ztteam_onAddClick}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Fanpage
          </button>
        </div>
      </div>

      {/** Desktop: Table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Fanpage Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {ztteam_loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                  <p className="mt-2 text-sm">Loading fanpages...</p>
                </td>
              </tr>
            ) : ztteam_fanpages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">flag</span>
                  <p className="mt-2 text-sm">No fanpages yet. Click &quot;New Fanpage&quot; to add one.</p>
                </td>
              </tr>
            ) : (
              ztteam_fanpages.map((ztteam_page) => (
                <tr
                  key={ztteam_page.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {ztteam_page.imageUrl ? (
                        <img
                          src={ztteam_page.imageUrl}
                          alt={ztteam_page.name}
                          className="size-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">flag</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold">{ztteam_page.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{ztteam_page.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                      {ztteam_page.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${ztteam_page.status === "active" ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}></span>
                      <span className={`text-sm font-medium ${ztteam_page.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                        {ztteam_page.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                    <a href={ztteam_page.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </a>
                    <button onClick={() => ztteam_onDelete(ztteam_page.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/** Mobile: Card view */}
      <div className="sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
        {ztteam_loading ? (
          <div className="px-4 py-12 text-center text-slate-500">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            <p className="mt-2 text-sm">Loading fanpages...</p>
          </div>
        ) : ztteam_fanpages.length === 0 ? (
          <div className="px-4 py-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">flag</span>
            <p className="mt-2 text-sm">No fanpages yet. Tap &quot;New Fanpage&quot; to add one.</p>
          </div>
        ) : (
          ztteam_fanpages.map((ztteam_page) => (
            <div key={ztteam_page.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                {ztteam_page.imageUrl ? (
                  <img
                    src={ztteam_page.imageUrl}
                    alt={ztteam_page.name}
                    className="size-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">flag</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{ztteam_page.name}</p>
                  <p className="text-xs text-slate-500 truncate">{ztteam_page.url}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                    {ztteam_page.category || "Uncategorized"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${ztteam_page.status === "active" ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}></span>
                    <span className={`text-xs font-medium ${ztteam_page.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {ztteam_page.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a href={ztteam_page.url} target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </a>
                  <button onClick={() => ztteam_onDelete(ztteam_page.id)} className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-slate-500">
          Showing {ztteam_fanpages.length} {ztteam_fanpages.length === 1 ? "entry" : "entries"}
        </p>
      </div>
    </div>
  );
}
