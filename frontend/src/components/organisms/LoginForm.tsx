"use client";

import { FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { AuthField } from "@/components/molecules/AuthField";
import { AuthMessage } from "@/components/molecules/AuthMessage";

type LoginFormProps = {
  email: string;
  password: string;
  errorMessage: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function LoginForm({
  email,
  password,
  errorMessage,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <AuthField
        id="email"
        label="E-post"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={onEmailChange}
      />

      <AuthField
        id="password"
        label="Passord"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={onPasswordChange}
      />

      {errorMessage ? (
        <AuthMessage message={errorMessage} tone="error" />
      ) : null}

      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading ? "Logger inn..." : "Logg inn"}
      </Button>
    </form>
  );
}
