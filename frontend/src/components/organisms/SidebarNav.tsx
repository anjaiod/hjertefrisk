type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  icon: React.ReactNode;
};

function Item({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={[
        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all",
        item.active
          ? "bg-brand-sky/20 text-brand-navy"
          : "text-slate-700 hover:bg-brand-mist/40 hover:text-brand-navy hover:shadow-sm",
      ].join(" ")}
    >
      <span className="w-5 h-5">{item.icon}</span>
      <span>{item.label}</span>
    </a>
  );
}

export function SidebarNav({
  clinicName = "Poliklinikk LUP",
  userName = "Lege Legesen",
  profileImage,
  activePath = "/",
}: {
  clinicName?: string;
  userName?: string;
  profileImage?: string;
  activePath?: string;
}) {
  const primaryItems: NavItem[] = [
    {
      label: "Pasientoversikt",
      href: "#",
      active: activePath === "/#",
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Innstillinger",
      href: "/innstillinger",
      active: activePath === "/innstillinger",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: activePath === "/dashboard",
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
      label: "Hjertefrisk",
      href: "/hjertefrisk",
      active: activePath === "/hjertefrisk",
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
      label: "Blodprøver",
      href: "/blodproever",
      active: activePath === "/blodproever",
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
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      label: "Målinger",
      href: "/maalinger",
      active: activePath === "/maalinger",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: "Legemidler",
      href: "/legemidler",
      active: activePath === "/legemidler",
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-brand-sky/30 bg-gradient-to-b from-white to-brand-mist/10 p-6 md:flex">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <img
          src={
            profileImage ??
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt="Profile"
          className="h-14 w-14 rounded-full border-2 border-brand-sky bg-brand-mist object-cover"
        />
        <div className="space-y-0.5">
          <p className="font-bold text-brand-navy">{userName}</p>
          <p className="text-sm text-slate-600">{clinicName}</p>
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-brand-sky to-transparent" />

      <nav className="flex flex-col space-y-2">
        {primaryItems.map((item) => (
          <Item key={item.href} item={item} />
        ))}

        <div className="my-2 h-px bg-gradient-to-r from-transparent via-brand-sky to-transparent" />

        {secondaryItems.map((item) => (
          <Item key={item.href} item={item} />
        ))}
      </nav>
    </aside>
  );
}
