import type { ReactNode } from "react";
import { RequirePatient } from "@/components/auth/RequireRole";

export default function PasientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RequirePatient>{children}</RequirePatient>;
}
