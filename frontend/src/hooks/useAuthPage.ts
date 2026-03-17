"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { loginWithPassword, registerUser } from "@/services/authService";
import type { RegisterRole } from "@/types/Auth";

export function useAuthPage() {
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [activeRegisterRole, setActiveRegisterRole] =
    useState<RegisterRole>("patient");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] =
    useState<string | null>(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const loginState = useMemo(
    () => ({
      email: loginEmail,
      password: loginPassword,
      errorMessage: loginErrorMessage,
      isLoading: isLoginLoading,
    }),
    [loginEmail, loginPassword, loginErrorMessage, isLoginLoading],
  );

  const registerState = useMemo(
    () => ({
      role: activeRegisterRole,
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      errorMessage: registerErrorMessage,
      successMessage: registerSuccessMessage,
      isLoading: isRegisterLoading,
    }),
    [
      activeRegisterRole,
      registerName,
      registerEmail,
      registerPassword,
      registerErrorMessage,
      registerSuccessMessage,
      isRegisterLoading,
    ],
  );

  const handleLoginSubmit = async () => {
    setLoginErrorMessage(null);
    setIsLoginLoading(true);

    try {
      await loginWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      router.push("/dashboard");
    } catch (error) {
      setLoginErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke logge inn.",
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setRegisterErrorMessage(null);
    setRegisterSuccessMessage(null);
    setIsRegisterLoading(true);

    try {
      await registerUser({
        role: activeRegisterRole,
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setRegisterSuccessMessage(
        "Bruker opprettet i både Supabase og lokal database.",
      );
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error) {
      setRegisterErrorMessage(
        error instanceof Error
          ? error.message
          : "Kunne ikke opprette bruker.",
      );
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return {
    loginState,
    registerState,
    setLoginEmail,
    setLoginPassword,
    setActiveRegisterRole,
    setRegisterName,
    setRegisterEmail,
    setRegisterPassword,
    handleLoginSubmit,
    handleRegisterSubmit,
  };
}
