"use client";

import Link from "next/link";

interface ZTTeamSidebarProps {
  ztteam_isOpen: boolean;
  ztteam_onClose: () => void;
}

/** Sidebar Navigation - responsive với mobile overlay */
export default function ZTTeamSidebar({ ztteam_isOpen, ztteam_onClose }: ZTTeamSidebarProps) {
  return (
    <>
      {ztteam_isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={ztteam_onClose}
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transform transition-transform duration-300 ease-in-out ${
          ztteam_isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-none">
                Fanpage
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                Professional Admin
              </p>
            </div>
          </div>
          <button
            onClick={ztteam_onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold"
            href="/"
            onClick={ztteam_onClose}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="/"
            onClick={ztteam_onClose}
          >
            <span className="material-symbols-outlined">flag</span>
            <span className="text-sm font-medium">Fanpage List</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="/"
            onClick={ztteam_onClose}
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-sm font-medium">Messages</span>
            <span className="ml-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
              12
            </span>
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="/"
            onClick={ztteam_onClose}
          >
            <span className="material-symbols-outlined">monitoring</span>
            <span className="text-sm font-medium">Analytics</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="/"
            onClick={ztteam_onClose}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
              Storage Usage
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">6.5GB of 10GB used</p>
          </div>
        </div>
      </aside>
    </>
  );
}
