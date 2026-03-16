"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type RegisterRole = "patient" | "personnel";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function Page() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [activeRegisterRole, setActiveRegisterRole] =
    useState<RegisterRole>("patient");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] = useState<
    string | null
  >(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<
    string | null
  >(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const createLocalUser = async (
    role: RegisterRole,
    userId: string,
    name: string,
    email: string,
  ) => {
    const endpoint = role === "patient" ? "/api/Patients" : "/api/Personnel";

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supabaseUserId: userId,
        name,
        email,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Kunne ikke opprette lokal bruker.");
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginErrorMessage(null);
    setIsLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setIsLoginLoading(false);

    if (error) {
      setLoginErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterErrorMessage(null);
    setRegisterSuccessMessage(null);
    setIsRegisterLoading(true);

    const email = registerEmail.trim();
    const name = registerName.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: registerPassword,
      options: {
        data: {
          role: activeRegisterRole,
          fullName: name,
        },
      },
    });

    if (error) {
      setIsRegisterLoading(false);
      setRegisterErrorMessage(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setIsRegisterLoading(false);
      setRegisterErrorMessage(
        "Brukeren ble opprettet i Supabase, men mangler bruker-ID for lokal lagring.",
      );
      return;
    }

    try {
      await createLocalUser(activeRegisterRole, userId, name, email);
    } catch (localError) {
      setIsRegisterLoading(false);
      setRegisterErrorMessage(
        localError instanceof Error
          ? localError.message
          : "Kunne ikke lagre bruker lokalt.",
      );
      return;
    }

    setIsRegisterLoading(false);
    setRegisterSuccessMessage(
      "Bruker opprettet i både Supabase og lokal database.",
    );
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-brand-mist/30 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-navy">Logg inn</h1>
        <p className="mt-2 text-sm text-slate-600">
          Logg inn med e-post og passord for å åpne Hjertefrisk.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-post
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Passord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-navy"
            />
          </div>

          {loginErrorMessage ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {loginErrorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full rounded-lg bg-brand-navy px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoginLoading ? "Logger inn..." : "Logg inn"}
          </button>
        </form>

        <div className="my-6 h-px bg-slate-200" />

        <h2 className="text-lg font-semibold text-brand-navy">Opprett bruker</h2>
        <p className="mt-1 text-sm text-slate-600">
          Velg type bruker og opprett konto.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveRegisterRole("patient")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              activeRegisterRole === "patient"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600"
            }`}
          >
            Opprett pasient
          </button>
          <button
            type="button"
            onClick={() => setActiveRegisterRole("personnel")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              activeRegisterRole === "personnel"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600"
            }`}
          >
            Opprett personell
          </button>
        </div>

        <form onSubmit={handleRegister} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="register-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Navn
            </label>
            <input
              id="register-name"
              type="text"
              required
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              E-post
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Passord
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-navy"
            />
          </div>

          {registerErrorMessage ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {registerErrorMessage}
            </p>
          ) : null}

          {registerSuccessMessage ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {registerSuccessMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isRegisterLoading}
            className="w-full rounded-lg bg-brand-teal px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegisterLoading ? "Oppretter bruker..." : "Opprett bruker"}
          </button>
        </form>
      </div>
    </main>
  );
}
