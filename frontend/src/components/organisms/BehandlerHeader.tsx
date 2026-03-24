"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../atoms/SearchBar";
import { useUser } from "@/context/UserContext";
import { signOut } from "@/services/authService";

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold text-brand-navy hover:bg-brand-mist/40 hover:text-brand-navy hover:shadow-sm transition-colors cursor-pointer"
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </a>
  );
}

export function BehandlerHeader() {
  const { logout } = useUser();
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const dashboardHref = patientId
    ? `/dashboard?patientId=${encodeURIComponent(patientId)}`
    : "/dashboard";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // ignore sign-out errors; still clear local state
    } finally {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      <nav className="flex items-center gap-1">
        <NavLink
          href="/pasientvisning"
          label="Pasientliste"
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
        <NavLink
          href="/innboks"
          label="Innboks"
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <NavLink
          href="/innstillinger"
          label="Innstillinger"
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
      </nav>

      <div className="flex items-center gap-3">

        <button
          onClick={() => (window.location.href = dashboardHref)}
          className="bg-brand-navy hover:bg-brand-navy-light transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          aria-label="Hjem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>
        </button>

        <button
          onClick={handleLogout}
          className="bg-brand-navy hover:bg-brand-navy-light transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          aria-label="Logg ut"
          title="Logg ut"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 19V5a2 2 0 00-2-2h-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
