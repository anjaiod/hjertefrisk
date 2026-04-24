"use client";

import type { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

type NavItem = {
  label: string;
  href?: string;
  //onClick?: () => void;
  active?: boolean;
  icon: ReactNode;
};

function Item({ item }: { item: NavItem }) {
  const classes = [
    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all cursor-pointer",
    item.active
      ? "bg-brand-sky/20 text-brand-navy"
      : "text-slate-700 hover:bg-brand-mist/40 hover:text-brand-navy hover:shadow-sm",
  ].join(" ");

  if (!item.href) {
    return (
      <button className={classes}>
        <span className="w-5 h-5">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  }

  return (
    <a href={item.href} className={classes}>
      <span className="w-5 h-5">{item.icon}</span>
      <span>{item.label}</span>
    </a>
  );
}

export function PatientSidebarNav({
  patientName = "Pasient",
  activePath = "/",
}: {
  patientName?: string;
  activePath?: string;
}) {
  const { user } = useUser();
  const resolvedPatientName =
    user?.role === "pasient" ? user.name : patientName;

  const items: NavItem[] = [
    {
      label: "Dashboard",
      href: "/pasientDashboard",
      active: activePath === "/pasientDashboard",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Innboks",
      href: "/pasientDashboard/pasientInnboks",
      active: activePath === "/pasientDashboard/pasientInnboks",
      //onClick: () => setInboxOpen(true),
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Hjertefrisk",
      href: "/pasientDashboard/pasientHjertefrisk",
      active: activePath === "/pasientDashboard/pasientHjertefrisk",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      label: "Tidligere besvarelser",
      href: "/pasientDashboard/pasientTidligereBevarelser",
      active: activePath === "/pasientDashboard/pasientTidligereBevarelser",
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-brand-sky/30 bg-gradient-to-b from-white to-brand-mist/10 p-6 md:flex">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="space-y-0.5">
          <p className="font-bold text-brand-navy">{resolvedPatientName}</p>
          <p className="text-sm text-slate-600">Innlogget som pasient</p>
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-brand-sky to-transparent" />

      <nav className="flex flex-col space-y-2">
        {items.map((item) => (
          <Item key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}
