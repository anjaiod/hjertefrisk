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
  gender: string;
  errorMessage: string | null;
  successMessage: string | null;
  isLoading: boolean;
  onRoleChange: (role: RegisterRole) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function RegisterForm({
  role,
  name,
  email,
  password,
  gender,
  errorMessage,
  successMessage,
  isLoading,
  onRoleChange,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onGenderChange,
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

        {role === "patient" && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="register-gender"
              className="text-sm font-medium text-slate-700"
            >
              Kjønn
            </label>
            <select
              id="register-gender"
              value={gender}
              onChange={(e) => onGenderChange(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-sky"
            >
              <option value="">Velg kjønn</option>
              <option value="Mann">Mann</option>
              <option value="Kvinne">Kvinne</option>
            </select>
          </div>
        )}

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
