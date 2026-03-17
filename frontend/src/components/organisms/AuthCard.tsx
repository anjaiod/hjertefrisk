"use client";

import { LoginForm } from "@/components/organisms/LoginForm";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import { useAuthPage } from "@/hooks/useAuthPage";

export function AuthCard() {
  const {
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

      <div className="my-6 h-px bg-slate-200" />

      <RegisterForm
        role={registerState.role}
        name={registerState.name}
        email={registerState.email}
        password={registerState.password}
        errorMessage={registerState.errorMessage}
        successMessage={registerState.successMessage}
        isLoading={registerState.isLoading}
        onRoleChange={setActiveRegisterRole}
        onNameChange={setRegisterName}
        onEmailChange={setRegisterEmail}
        onPasswordChange={setRegisterPassword}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
}
