"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AuthTestPage() {
  const router = useRouter();
  const { user, session, isLoading, error } = useAuth();

  const userMetadata = useMemo(() => {
    if (!user) return null;
    return JSON.stringify(user.user_metadata ?? {}, null, 2);
  }, [user]);

  const appMetadata = useMemo(() => {
    if (!user) return null;
    return JSON.stringify(user.app_metadata ?? {}, null, 2);
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-navy">Auth test</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enkel testside for å se informasjon om innlogget bruker.
        </p>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-600">Laster brukerdata...</p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {!isLoading && !user ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            Ingen innlogget bruker funnet.
          </div>
        ) : null}

        {user ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard label="User ID" value={user.id} />
              <InfoCard label="Email" value={user.email ?? "(mangler)"} />
              <InfoCard
                label="Email bekreftet"
                value={user.email_confirmed_at ? "Ja" : "Nei"}
              />
              <InfoCard
                label="Sist innlogget"
                value={user.last_sign_in_at ?? "(ukjent)"}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <JsonCard title="user_metadata" value={userMetadata ?? "{}"} />
              <JsonCard title="app_metadata" value={appMetadata ?? "{}"} />
            </div>

            <JsonCard
              title="session"
              value={JSON.stringify(session ?? {}, null, 2)}
            />

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Logg ut
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-all text-sm text-slate-800">{value}</p>
    </div>
  );
}

function JsonCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <pre className="mt-2 max-h-72 overflow-auto rounded bg-slate-100 p-3 text-xs text-slate-800">
        {value}
      </pre>
    </div>
  );
}
