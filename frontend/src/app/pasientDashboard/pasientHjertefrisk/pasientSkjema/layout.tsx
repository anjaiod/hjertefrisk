import type { ReactNode } from "react";
import { RequirePatient } from "@/components/auth/RequireRole";

export default function PasientSkjemaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RequirePatient>{children}</RequirePatient>;
}
