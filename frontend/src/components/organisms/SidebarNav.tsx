"use client";
import { useUser } from "@/context/UserContext";
import { useState, type ReactNode, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { VarslingModal } from "../molecules/VarslingModal";
import { fetchNotifications } from "@/lib/notifications";
import { apiClient } from "@/lib/apiClient";
import type { PatientDto } from "@/types";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  icon: ReactNode;
  onClick?: () => void;
  showDot?: boolean;
};

function Item({
  item,
  onClick,
  showDot,
}: {
  item: NavItem;
  onClick?: () => void;
  showDot?: boolean;
}) {
  onClick = onClick ?? item.onClick;
  showDot = showDot ?? item.showDot;
  const base =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all";

  const state = item.active
    ? "bg-brand-sky/20 text-brand-navy"
    : "text-slate-700 hover:bg-brand-mist/40 hover:text-brand-navy hover:shadow-sm";

  const content = (
    <>
      <span className="w-5 h-5">{item.icon}</span>
      <span className="flex items-center gap-2">
        {item.label}
        {showDot && <span className="w-2 h-2 rounded-full bg-red-500" />}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full cursor-pointer ${base} ${state}`}>
        {content}
      </button>
    );
  }

  return (
    <a href={item.href} className={`${base} ${state}`}>
      {content}
    </a>
  );
}

export function SidebarNav({
  clinicName = "Poliklinikk LUP",
  userName,
  profileImage,
  activePath = "/",
}: {
  clinicName?: string;
  userName?: string;
  profileImage?: string;
  activePath?: string;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = activePath === "/" ? (pathname ?? "/") : activePath;

  const [showVarsling, setShowVarsling] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [patient, setPatient] = useState<PatientDto | null>(null);

  const patientId = searchParams?.get("patientId");
  const hasSelectedPatient = Boolean(patientId && patientId.trim() !== "");
  const withPatientId = (href: string) => {
    if (!patientId) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}patientId=${encodeURIComponent(patientId)}`;
  };

  const isActive = (href: string) =>
    currentPath === href || currentPath.startsWith(`${href}/`);

  const primaryItems: NavItem[] = [
    {
      label: "Dashboard",
      href: withPatientId("/dashboard"),
      active: currentPath === "/dashboard",
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
      label: "Varslinger",
      href: "#",
      onClick: () => setShowVarsling(true),
      showDot: hasUnread,
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      label: "Journalnotat",
      href: withPatientId("/dashboard/journalnotat"),
      active: isActive("/dashboard/journalnotat"),
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: "Hjertefrisk",
      href: withPatientId("/dashboard/behandlerSkjema"),
      active: isActive("/dashboard/behandlerSkjema"),
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
      label: "Hurtigskjema",
      href: withPatientId("/dashboard/hurtigskjema"),
      active: isActive("/dashboard/hurtigskjema"),
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await fetchNotifications();
        const forPatient = patientId
          ? all.some((n) => n.patientId === Number(patientId) && !n.read)
          : false;
        if (mounted) setHasUnread(forPatient);
      } catch (e) {
        console.error("Failed to fetch notifications for sidebar", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!patientId) {
        if (mounted) setPatient(null);
        return;
      }
      try {
        const data = await apiClient.get<PatientDto>(`/api/patients/${encodeURIComponent(patientId)}`);
        if (mounted) setPatient(data);
      } catch (e) {
        console.error("Failed to fetch patient for sidebar", e);
      }
    })();
    return () => { mounted = false; };
  }, [patientId]);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-brand-sky/30 bg-linear-to-b from-white to-brand-mist/10 p-6 md:flex">
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
          <img
            src={
              profileImage ??
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt="Profile"
            className="h-14 w-14 rounded-full border-2 border-brand-sky bg-brand-mist object-cover"
          />
          <div>
            <p className="font-bold text-brand-navy">
              {user?.name ?? userName ?? "Bruker"}
            </p>
            <p className="text-sm text-slate-600">{clinicName}</p>
          </div>
        </div>

        {hasSelectedPatient && (
          <>
            <div className="my-6 h-px bg-linear-to-r from-transparent via-brand-sky to-transparent" />

            {patient && (
              <div className="mb-4 rounded-xl border border-brand-sky/30 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Valgt pasient</p>
                <p className="mt-0.5 font-bold text-brand-navy truncate">{patient.name}</p>
              </div>
            )}

            <nav className="flex flex-col space-y-2">
              {primaryItems.map((item) => (
                <Item key={item.label} item={item} />
              ))}

              {secondaryItems.map((item) => (
                <Item key={item.href} item={item} />
              ))}
            </nav>
          </>
        )}
      </aside>

      {showVarsling && (
        <VarslingModal
          onClose={() => setShowVarsling(false)}
          patientId={Number(patientId)}
          onAllRead={() => setHasUnread(false)}
        />
      )}
    </>
  );
}
