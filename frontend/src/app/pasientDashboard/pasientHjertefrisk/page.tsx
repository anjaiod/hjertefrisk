"use client";

import { useState } from "react";
import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import { Button } from "../../../components/atoms/Button";
import QuestionnaireHistory from "../../../components/molecules/QuestionnaireHistory";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user: localUser } = useUser();

  const openId = searchParams.get("open");

  const [tab, setTab] = useState<"ny" | "historikk">(
    openId ? "historikk" : "ny",
  );

  const patientId = localUser ? Number.parseInt(localUser.id, 10) : null;

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientHjertefrisk" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("ny")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === "ny"
                  ? "bg-brand-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Nytt skjema
            </button>

            <button
              onClick={() => setTab("historikk")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === "historikk"
                  ? "bg-brand-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tidligere besvarelser
            </button>
          </div>

          {tab === "ny" && (
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={() =>
                  router.push(
                    "/pasientDashboard/pasientHjertefrisk/pasientSkjema",
                  )
                }
              >
                Fyll inn nytt hjertefrisk-skjema
              </Button>
            </div>
          )}

          {tab === "historikk" &&
            (patientId && Number.isFinite(patientId) ? (
              <QuestionnaireHistory
                patientId={patientId}
                initialOpenId={openId ? Number(openId) : null}
              />
            ) : (
              <p className="text-slate-500 text-sm">Ingen pasient funnet.</p>
            ))}
        </main>
      </div>
    </div>
  );
}
