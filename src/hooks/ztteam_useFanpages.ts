"use client";

import { useState, useEffect, useCallback } from "react";

/** Interface Fanpage */
export interface ZTTeamFanpage {
  id: string;
  url: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  pageId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Interface dữ liệu scrape */
export interface ZTTeamScrapeData {
  name: string;
  description: string | null;
  imageUrl: string | null;
  pageId: string | null;
  url: string;
}

/** Custom hook quản lý fanpages */
export function ztteam_useFanpages() {
  const [ztteam_fanpages, ztteam_setFanpages] = useState<ZTTeamFanpage[]>([]);
  const [ztteam_loading, ztteam_setLoading] = useState(true);
  const [ztteam_error, ztteam_setError] = useState<string | null>(null);

  /** Lấy danh sách fanpages */
  const ztteam_fetchFanpages = useCallback(async () => {
    try {
      ztteam_setLoading(true);
      ztteam_setError(null);

      const res = await fetch("/api/ztteam-fanpage");
      const data = await res.json();

      if (data.success) {
        ztteam_setFanpages(data.data);
      } else {
        ztteam_setError(data.error || "Failed to fetch fanpages");
      }
    } catch {
      ztteam_setError("Network error. Please try again.");
    } finally {
      ztteam_setLoading(false);
    }
  }, []);

  /** Scrape thông tin fanpage từ URL */
  const ztteam_scrapePage = async (
    url: string,
  ): Promise<ZTTeamScrapeData | null> => {
    try {
      ztteam_setError(null);

      const res = await fetch("/api/ztteam-fanpage/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.success) {
        return data.data;
      } else {
        ztteam_setError(data.error || "Failed to scrape page info");
        return null;
      }
    } catch {
      ztteam_setError("Failed to fetch page info. Please check the URL.");
      return null;
    }
  };

  /** Thêm fanpage mới */
  const ztteam_addFanpage = async (
    pageData: Omit<ZTTeamScrapeData, ""> & { category?: string },
  ): Promise<boolean> => {
    try {
      ztteam_setError(null);

      const res = await fetch("/api/ztteam-fanpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      const data = await res.json();

      if (data.success) {
        await ztteam_fetchFanpages();
        return true;
      } else {
        ztteam_setError(data.error || "Failed to add fanpage");
        return false;
      }
    } catch {
      ztteam_setError("Network error. Please try again.");
      return false;
    }
  };

  /** Scrape lại (refresh) thông tin fanpage */
  const ztteam_refreshFanpage = async (id: string): Promise<boolean> => {
    try {
      ztteam_setError(null);

      const res = await fetch("/api/ztteam-fanpage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        await ztteam_fetchFanpages();
        return true;
      } else {
        ztteam_setError(data.error || "Failed to refresh fanpage");
        return false;
      }
    } catch {
      ztteam_setError("Network error. Please try again.");
      return false;
    }
  };

  /** Xóa fanpage */
  const ztteam_deleteFanpage = async (id: string): Promise<boolean> => {
    try {
      ztteam_setError(null);

      const res = await fetch(`/api/ztteam-fanpage?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        await ztteam_fetchFanpages();
        return true;
      } else {
        ztteam_setError(data.error || "Failed to delete fanpage");
        return false;
      }
    } catch {
      ztteam_setError("Network error. Please try again.");
      return false;
    }
  };

  /** Fetch khi mount */
  useEffect(() => {
    ztteam_fetchFanpages();
  }, [ztteam_fetchFanpages]);

  return {
    ztteam_fanpages,
    ztteam_loading,
    ztteam_error,
    ztteam_setError,
    ztteam_fetchFanpages,
    ztteam_scrapePage,
    ztteam_addFanpage,
    ztteam_refreshFanpage,
    ztteam_deleteFanpage,
  };
}
