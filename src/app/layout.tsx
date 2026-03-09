import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "material-symbols/outlined.css";
import "@/styles/globals.css";

/** Google Font - Plus Jakarta Sans */
const ztteam_font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ZTTeam Fanpage Manager",
  description: "Professional Fanpage Management Dashboard",
};

export default function ZTTeamRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${ztteam_font.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
