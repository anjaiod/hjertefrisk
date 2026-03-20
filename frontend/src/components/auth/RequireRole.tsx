"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, type UserRole } from "@/context/UserContext";

type RequireRoleProps = {
  allow: UserRole;
  redirectTo: string;
  children: ReactNode;
};

export function RequireRole({ allow, redirectTo, children }: RequireRoleProps) {
  const router = useRouter();
  const { user, isAuthReady } = useUser();

  useEffect(() => {
    if (!isAuthReady) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.role !== allow) {
      router.replace(redirectTo);
    }
  }, [allow, isAuthReady, redirectTo, router, user]);

  if (!isAuthReady) return null;
  if (!user) return null;
  if (user.role !== allow) return null;

  return children;
}

export function RequirePersonnel({ children }: { children: ReactNode }) {
  return (
    <RequireRole allow="personell" redirectTo="/pasientDashboard">
      {children}
    </RequireRole>
  );
}

export function RequirePatient({ children }: { children: ReactNode }) {
  return (
    <RequireRole allow="pasient" redirectTo="/pasientvisning">
      {children}
    </RequireRole>
  );
}
