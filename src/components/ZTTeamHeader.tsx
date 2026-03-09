"use client";

import { useRouter } from "next/navigation";

interface ZTTeamHeaderProps {
  ztteam_onMenuClick: () => void;
}

/** Header với search bar, hamburger menu mobile, logout */
export default function ZTTeamHeader({ ztteam_onMenuClick }: ZTTeamHeaderProps) {
  const router = useRouter();

  const ztteam_handleLogout = async () => {
    await fetch("/api/ztteam-auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={ztteam_onMenuClick}
          className="lg:hidden size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500"
              placeholder="Search pages, messages, or reports..."
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="sm:hidden size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">Admin</p>
            <p className="text-[10px] text-slate-500 font-medium">Admin Account</p>
          </div>
          <button
            onClick={ztteam_handleLogout}
            className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
