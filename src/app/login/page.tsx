"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Trang đăng nhập Admin */
export default function ZTTeamLoginPage() {
  const router = useRouter();
  const [ztteam_username, setZTTeamUsername] = useState("");
  const [ztteam_password, setZTTeamPassword] = useState("");
  const [ztteam_error, setZTTeamError] = useState<string | null>(null);
  const [ztteam_loading, setZTTeamLoading] = useState(false);

  const ztteam_handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setZTTeamLoading(true);
    setZTTeamError(null);

    try {
      const res = await fetch("/api/ztteam-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: ztteam_username,
          password: ztteam_password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setZTTeamError(data.error);
      }
    } catch {
      setZTTeamError("Login failed. Please try again.");
    } finally {
      setZTTeamLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm px-4">
      <div className="text-center mb-8">
        <div className="size-14 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-3xl">hub</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Fanpage Manager
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sign in to your admin account
        </p>
      </div>

      <form
        onSubmit={ztteam_handleLogin}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5"
      >
        {ztteam_error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-500 text-lg">error</span>
            <p className="text-sm text-rose-600 dark:text-rose-400">{ztteam_error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Username
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              person
            </span>
            <input
              type="text"
              value={ztteam_username}
              onChange={(e) => setZTTeamUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              lock
            </span>
            <input
              type="password"
              value={ztteam_password}
              onChange={(e) => setZTTeamPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={ztteam_loading}
          className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          {ztteam_loading ? (
            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-lg">login</span>
          )}
          Sign In
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
        ZTTeam Fanpage Manager v1.0
      </p>
    </div>
  );
}
