type NavItem = { label: string; href: string; active?: boolean };

function Item({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={[
        "block rounded-xl px-3 py-2 text-sm font-medium transition",
        item.active
          ? "bg-brand-mist/40 text-brand-navy"
          : "text-slate-700 hover:bg-brand-mist/30 hover:text-brand-navy",
      ].join(" ")}
    >
      {item.label}
    </a>
  );
}

export function SidebarNav({
  clinicName = "Poliklinikk LUP",
  userName = "Lege Legesen",
  profileImage,
}: {
  clinicName?: string;
  userName?: string;
  profileImage?: string;
}) {
  const primaryItems: NavItem[] = [
    { label: "Pasientoversikt", href: "#" },
    { label: "Innstillinger", href: "#" },
  ];

  const secondaryItems: NavItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Hjertefrisk", href: "/hjertefrisk" },
    { label: "Blodprøver", href: "/blodproever" },
    { label: "Målinger", href: "/maalinger" },
    { label: "Legemidler", href: "/legemidler" },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-brand-mist bg-white p-6 md:flex">
      <div className="flex items-center gap-3">
        <img
          src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
          alt="Profile"
          className="h-12 w-12 rounded-full bg-brand-mist object-cover"
        />
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Innlogget som</p>
          <p className="font-medium text-slate-900">{userName}</p>
          <p className="text-sm text-slate-600">{clinicName}</p>
        </div>
      </div>

      <div className="my-6 h-px bg-brand-mist" />

      <nav className="flex flex-col space-y-2">
        {primaryItems.map((item) => (
          <Item key={item.href} item={item} />
        ))}
        
        <div className="h-px bg-slate-200" />
        
        {secondaryItems.map((item) => (
          <Item key={item.href} item={item} />
        ))}
      </nav>
    </aside>
  );
}