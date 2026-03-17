"use client";

import { FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { AuthField } from "@/components/molecules/AuthField";
import { AuthMessage } from "@/components/molecules/AuthMessage";
import { AuthRoleTabs } from "@/components/molecules/AuthRoleTabs";
import type { RegisterRole } from "@/types/Auth";

type RegisterFormProps = {
  role: RegisterRole;
  name: string;
  email: string;
  password: string;
  errorMessage: string | null;
  successMessage: string | null;
  isLoading: boolean;
  onRoleChange: (role: RegisterRole) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function RegisterForm({
  role,
  name,
  email,
  password,
  errorMessage,
  successMessage,
  isLoading,
  onRoleChange,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: RegisterFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-brand-navy">Opprett bruker</h2>
      <p className="mt-1 text-sm text-slate-600">
        Velg type bruker og opprett konto.
      </p>

      <AuthRoleTabs activeRole={role} onChange={onRoleChange} />

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <AuthField
          id="register-name"
          label="Navn"
          required
          value={name}
          onChange={onNameChange}
        />

        <AuthField
          id="register-email"
          label="E-post"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={onEmailChange}
        />

        <AuthField
          id="register-password"
          label="Passord"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={onPasswordChange}
        />

        {errorMessage ? <AuthMessage message={errorMessage} tone="error" /> : null}
        {successMessage ? (
          <AuthMessage message={successMessage} tone="success" />
        ) : null}

        <Button type="submit" variant="confirm" disabled={isLoading} fullWidth>
          {isLoading ? "Oppretter bruker..." : "Opprett bruker"}
        </Button>
      </form>
    </>
  );
}
