"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { loginWithPassword } from "@/services/authService";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { apiClient } from "@/lib/apiClient";

export function useAuthPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const loginState = useMemo(
    () => ({
      email: loginEmail,
      password: loginPassword,
      errorMessage: loginErrorMessage,
      isLoading: isLoginLoading,
    }),
    [loginEmail, loginPassword, loginErrorMessage, isLoginLoading],
  );

  const handleLoginSubmit = async () => {
    setLoginErrorMessage(null);
    setIsLoginLoading(true);
    try {
      await loginWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      // Hent brukerinfo fra Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Fant ikke brukerinfo etter innlogging.");
      // Finn rolle fra user_metadata
      const role =
        user.user_metadata?.role === "personnel" ? "personell" : "pasient";

      // Slå opp navn i lokal database (foretrukket), fallback til Supabase metadata
      try {
        if (role === "personell") {
          const local = await apiClient.get<{
            id: number;
            supabaseUserId: string;
            name: string;
            email: string;
          }>(`/api/Personnel/by-supabase/${user.id}`);

          setUser({
            id: String(local.id),
            supabaseUserId: user.id,
            name: local.name,
            email: local.email,
            role,
          });
        } else {
          const local = await apiClient.get<{
            id: number;
            supabaseUserId: string;
            name: string;
            email: string;
          }>(`/api/Patients/by-supabase/${user.id}`);

          setUser({
            id: String(local.id),
            supabaseUserId: user.id,
            name: local.name,
            email: local.email,
            role,
          });
        }
      } catch {
        const fallbackName =
          user.user_metadata?.fullName || user.email || "Bruker";
        setUser({
          id: user.id,
          supabaseUserId: user.id,
          name: fallbackName,
          email: user.email ?? "",
          role,
        });
      }

      // Ruting basert på rolle
      if (role === "personell") {
        router.push("/pasientvisning");
      } else {
        router.push("/pasientDashboard");
      }
    } catch (error) {
      setLoginErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke logge inn.",
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  return {
    loginState,
    setLoginEmail,
    setLoginPassword,
    handleLoginSubmit,
  };
}
