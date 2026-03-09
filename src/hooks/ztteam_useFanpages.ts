"use client";

import { useState, useEffect, useCallback } from "react";

/** Interface cho dữ liệu Fanpage */
export interface ZTTeamFanpage {
  id: string;
  url: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  status: string;
  createdAt: string;
}

/** Interface cho kết quả scrape */
export interface ZTTeamScrapeData {
  name: string;
  description: string | null;
  imageUrl: string | null;
  url: string;
}

export function ztteam_useFanpages() {
  const [ztteam_fanpages, setZTTeamFanpages] = useState<ZTTeamFanpage[]>([]);
  const [ztteam_loading, setZTTeamLoading] = useState(true);
  const [ztteam_error, setZTTeamError] = useState<string | null>(null);

  /** Fetch tất cả fanpage từ API */
  const ztteam_fetchFanpages = useCallback(async () => {
    try {
      setZTTeamLoading(true);
      const res = await fetch("/api/ztteam-fanpage");
      const data = await res.json();

      if (data.success) {
        setZTTeamFanpages(data.data);
      } else {
        setZTTeamError(data.error);
      }
    } catch {
      setZTTeamError("Failed to fetch fanpages");
    } finally {
      setZTTeamLoading(false);
    }
  }, []);

  /** Scrape thông tin từ Facebook URL */
  const ztteam_scrapePage = async (
    url: string
  ): Promise<ZTTeamScrapeData | null> => {
    try {
      setZTTeamError(null);
      const res = await fetch("/api/ztteam-fanpage/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (data.success) {
        return data.data;
      }
      setZTTeamError(data.error);
      return null;
    } catch {
      setZTTeamError("Failed to scrape page info");
      return null;
    }
  };

  /** Thêm fanpage mới */
  const ztteam_addFanpage = async (
    pageData: Omit<ZTTeamFanpage, "id" | "status" | "createdAt">
  ): Promise<boolean> => {
    try {
      setZTTeamError(null);
      const res = await fetch("/api/ztteam-fanpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });
      const data = await res.json();

      if (data.success) {
        await ztteam_fetchFanpages();
        return true;
      }
      setZTTeamError(data.error);
      return false;
    } catch {
      setZTTeamError("Failed to add fanpage");
      return false;
    }
  };

  /** Xóa fanpage */
  const ztteam_deleteFanpage = async (id: string): Promise<boolean> => {
    try {
      setZTTeamError(null);
      const res = await fetch(`/api/ztteam-fanpage?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        await ztteam_fetchFanpages();
        return true;
      }
      setZTTeamError(data.error);
      return false;
    } catch {
      setZTTeamError("Failed to delete fanpage");
      return false;
    }
  };

  useEffect(() => {
    ztteam_fetchFanpages();
  }, [ztteam_fetchFanpages]);

  return {
    ztteam_fanpages,
    ztteam_loading,
    ztteam_error,
    ztteam_scrapePage,
    ztteam_addFanpage,
    ztteam_deleteFanpage,
    ztteam_fetchFanpages,
    setZTTeamError,
  };
}
