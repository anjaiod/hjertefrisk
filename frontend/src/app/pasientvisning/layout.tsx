import type { ReactNode } from "react";
import { SidebarNav } from "@/components/organisms/SidebarNav";
import { BehandlerHeader } from "@/components/organisms/BehandlerHeader";
import { RequirePersonnel } from "@/components/auth/RequireRole";

export default function PasientvisningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequirePersonnel>
      <div className="flex">
        <SidebarNav />

        <div className="flex min-h-screen flex-1 flex-col">
          <BehandlerHeader />
          <main className="flex-1 bg-slate-50 p-8">{children}</main>
        </div>
      </div>
    </RequirePersonnel>
  );
}
