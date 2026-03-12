"use client";

import { useState } from "react";
import { ZTTeamScrapeData } from "@/hooks/ztteam_useFanpages";

interface ZTTeamAddFanpageModalProps {
  ztteam_isOpen: boolean;
  ztteam_onClose: () => void;
  ztteam_onScrape: (url: string) => Promise<ZTTeamScrapeData | null>;
  ztteam_onSave: (data: {
    url: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    pageId: string | null;
    category: string | null;
  }) => Promise<boolean>;
}

/** Modal thêm fanpage - responsive */
export default function ZTTeamAddFanpageModal({
  ztteam_isOpen,
  ztteam_onClose,
  ztteam_onScrape,
  ztteam_onSave,
}: ZTTeamAddFanpageModalProps) {
  const [ztteam_url, setZTTeamUrl] = useState("");
  const [ztteam_scraping, setZTTeamScraping] = useState(false);
  const [ztteam_saving, setZTTeamSaving] = useState(false);
  const [ztteam_preview, setZTTeamPreview] = useState<ZTTeamScrapeData | null>(
    null,
  );
  const [ztteam_error, setZTTeamError] = useState<string | null>(null);

  const ztteam_handleScrape = async () => {
    if (!ztteam_url.trim()) return;
    setZTTeamScraping(true);
    setZTTeamError(null);
    setZTTeamPreview(null);
    const data = await ztteam_onScrape(ztteam_url.trim());
    if (data) {
      setZTTeamPreview(data);
    } else {
      setZTTeamError("Failed to fetch page info. Please check the URL.");
    }
    setZTTeamScraping(false);
  };

  const ztteam_handleSave = async () => {
    if (!ztteam_preview) return;
    setZTTeamSaving(true);
    const success = await ztteam_onSave({
      url: ztteam_preview.url,
      name: ztteam_preview.name,
      description: ztteam_preview.description,
      imageUrl: ztteam_preview.imageUrl,
      pageId: ztteam_preview.pageId,
      category: null,
    });
    if (success) {
      setZTTeamUrl("");
      setZTTeamPreview(null);
      setZTTeamError(null);
      ztteam_onClose();
    }
    setZTTeamSaving(false);
  };

  const ztteam_handleClose = () => {
    setZTTeamUrl("");
    setZTTeamPreview(null);
    setZTTeamError(null);
    ztteam_onClose();
  };

  if (!ztteam_isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={ztteam_handleClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full sm:max-w-lg sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="text-lg font-bold">Add New Fanpage</h3>
          <button
            onClick={ztteam_handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Facebook Page URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={ztteam_url}
                onChange={(e) => setZTTeamUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ztteam_handleScrape()}
                placeholder="https://www.facebook.com/PageName"
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              />
              <button
                onClick={ztteam_handleScrape}
                disabled={ztteam_scraping || !ztteam_url.trim()}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {ztteam_scraping ? (
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-lg">
                    search
                  </span>
                )}
                Fetch
              </button>
            </div>
          </div>

          {ztteam_error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {ztteam_error}
              </p>
            </div>
          )}

          {ztteam_preview && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                {ztteam_preview.imageUrl ? (
                  <img
                    src={ztteam_preview.imageUrl}
                    alt={ztteam_preview.name}
                    className="size-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      flag
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {ztteam_preview.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {ztteam_preview.url}
                  </p>
                </div>
              </div>
              {ztteam_preview.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {ztteam_preview.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                <p className="text-xs font-semibold">
                  Page info fetched successfully
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
          <button
            onClick={ztteam_handleClose}
            className="px-4 py-2.5 sm:py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={ztteam_handleSave}
            disabled={!ztteam_preview || ztteam_saving}
            className="px-4 py-2.5 sm:py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {ztteam_saving ? (
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            Save Fanpage
          </button>
        </div>
      </div>
    </div>
  );
}
