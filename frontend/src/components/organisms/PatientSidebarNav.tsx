type NavItem = {
  label: string;
  href?: string;
  //onClick?: () => void;
  active?: boolean;
  icon: React.ReactNode;
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
  const items: NavItem[] = [
    {
      // should become a pop-up?
      label: "Varslinger",
      //onClick: () => setNotificationsOpen(true),
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
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.17V11a6 6 0 10-12 0v3.17c0 .53-.21 1.04-.6 1.43L4 17h5m6 0a3 3 0 11-6 0"
          />
        </svg>
      ),
    },
    {
      label: "Innboks",
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
      href: "/pasientSkjema",
      active: activePath === "/pasientSkjema",
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
      label: "Vitalia",
      href: "/pasientDashboard/pasientVitalia",
      active: activePath === "/pasientDashboard/pasientVitalia",
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
            d="M12 12a4 4 0 100-8 4 4 0 000 8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 20a8 8 0 0116 0"
          />
        </svg>
      ),
    },
    {
      label: "Innstillinger",
      href: "/pasientDashboard/pasientInnstillinger",
      active: activePath === "/pasientDashboard/pasientInnstillinger",
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

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-brand-sky/30 bg-gradient-to-b from-white to-brand-mist/10 p-6 md:flex">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="space-y-0.5">
          <p className="font-bold text-brand-navy">{patientName}</p>
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
