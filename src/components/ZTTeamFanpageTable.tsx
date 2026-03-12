"use client";

import { useState } from "react";
import { ZTTeamFanpage } from "@/hooks/ztteam_useFanpages";

interface ZTTeamFanpageTableProps {
  ztteam_fanpages: ZTTeamFanpage[];
  ztteam_loading: boolean;
  ztteam_onDelete: (id: string) => void;
  ztteam_onRefresh: (id: string) => Promise<boolean>;
}

/**
 * Mở Facebook page
 * iPhone: dùng universal link https://www.facebook.com/ → iOS tự mở app FB nếu có cài
 * Desktop: mở tab mới
 */
function ztteam_handleOpenPage(fanpage: ZTTeamFanpage) {
  /**
   * Trên iPhone, Safari tự detect universal link của Facebook
   * Chỉ cần dùng window.location.href thay vì window.open
   * Safari sẽ tự mở app FB nếu đã cài, nếu không thì mở web
   */
  const isMobile =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    /** Dùng location.href — iOS universal link sẽ tự bắt và mở app FB */
    window.location.href = fanpage.url;
  } else {
    /** Desktop: mở tab mới */
    window.open(fanpage.url, "_blank", "noopener,noreferrer");
  }
}

export default function ZTTeamFanpageTable({
  ztteam_fanpages,
  ztteam_loading,
  ztteam_onDelete,
  ztteam_onRefresh,
}: ZTTeamFanpageTableProps) {
  const [ztteam_refreshingId, ztteam_setRefreshingId] = useState<string | null>(
    null,
  );

  /** Xử lý refresh fanpage */
  const handleRefresh = async (id: string) => {
    ztteam_setRefreshingId(id);
    await ztteam_onRefresh(id);
    ztteam_setRefreshingId(null);
  };

  /** Loading state */
  if (ztteam_loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          <span>Loading fanpages...</span>
        </div>
      </div>
    );
  }

  /** Empty state */
  if (ztteam_fanpages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
          language
        </span>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
          No fanpages yet
        </h3>
        <p className="text-slate-400 dark:text-slate-500">
          Click &quot;New Fanpage&quot; to add your first page
        </p>
      </div>
    );
  }

  return (
    <>
      {/** === DESKTOP TABLE === */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Recent Fanpages
          </h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-3 font-medium">Page Name</th>
              <th className="px-6 py-3 font-medium">URL</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ztteam_fanpages.map((fanpage) => (
              <tr
                key={fanpage.id}
                className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/** Page Name + Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {fanpage.imageUrl ? (
                      <img
                        src={fanpage.imageUrl}
                        alt={fanpage.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">
                          language
                        </span>
                      </div>
                    )}
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {fanpage.name}
                    </p>
                  </div>
                </td>

                {/** URL */}
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-400 dark:text-slate-500 truncate max-w-[250px]">
                    {fanpage.url}
                  </p>
                </td>

                {/** Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      fanpage.status === "active"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        fanpage.status === "active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    ></span>
                    {fanpage.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                {/** Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {/** Refresh */}
                    <button
                      onClick={() => handleRefresh(fanpage.id)}
                      disabled={ztteam_refreshingId === fanpage.id}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                      title="Refresh page info"
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          ztteam_refreshingId === fanpage.id
                            ? "animate-spin"
                            : ""
                        }`}
                      >
                        sync
                      </span>
                    </button>

                    {/** View */}
                    <button
                      onClick={() => ztteam_handleOpenPage(fanpage)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Open Facebook page"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>

                    {/** Delete */}
                    <button
                      onClick={() => ztteam_onDelete(fanpage.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Delete fanpage"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/** === MOBILE CARDS === */}
      <div className="sm:hidden space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 px-1">
          Recent Fanpages
        </h3>

        {ztteam_fanpages.map((fanpage) => (
          <div
            key={fanpage.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
          >
            {/** Header */}
            <div className="flex items-center gap-3 mb-3">
              {fanpage.imageUrl ? (
                <img
                  src={fanpage.imageUrl}
                  alt={fanpage.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    language
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {fanpage.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {fanpage.url}
                </p>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  fanpage.status === "active"
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                }`}
              ></span>
            </div>

            {/** Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
              {/** Refresh */}
              <button
                onClick={() => handleRefresh(fanpage.id)}
                disabled={ztteam_refreshingId === fanpage.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-blue-500 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    ztteam_refreshingId === fanpage.id ? "animate-spin" : ""
                  }`}
                >
                  sync
                </span>
                Refresh
              </button>

              {/** View — dùng thẻ <a> thay vì button để iOS handle universal link */}
              <a
                href={fanpage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  visibility
                </span>
                View
              </a>

              {/** Delete */}
              <button
                onClick={() => ztteam_onDelete(fanpage.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  delete
                </span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
