"use client";

import { LoginForm } from "@/components/organisms/LoginForm";
import { useAuthPage } from "@/hooks/useAuthPage";

export function AuthCard() {
  const {
    loginState,
    setLoginEmail,
    setLoginPassword,
    handleLoginSubmit,
  } = useAuthPage();

  return (
    <div className="w-full max-w-md rounded-xl border border-brand-mist/30 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-navy">Logg inn</h1>
      <p className="mt-2 text-sm text-slate-600">
        Logg inn med e-post og passord for å åpne Hjertefrisk.
      </p>

      <LoginForm
        email={loginState.email}
        password={loginState.password}
        errorMessage={loginState.errorMessage}
        isLoading={loginState.isLoading}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLoginSubmit}
      />
    </div>
  );
}
