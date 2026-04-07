"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import HealthQuestionnaire from "@/components/organisms/HealthQuestionnaire";
import QuestionnaireHistory from "@/components/molecules/QuestionnaireHistory";

export default function Page() {
  const searchParams = useSearchParams();
  const patientIdStr = searchParams.get("patientId");
  const patientId = patientIdStr ? parseInt(patientIdStr, 10) : null;

  const openId = searchParams.get("open");
  const [tab, setTab] = useState<"ny" | "historikk">(
    openId ? "historikk" : "ny",
  );

  if (!patientId || !Number.isFinite(patientId)) {
    return (
      <div className="p-8">
        <p className="text-amber-600">Ingen pasient valgt.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-4 px-8 pt-6">
          <button
            onClick={() => setTab("ny")}
            className={`pb-4 px-2 text-sm font-medium transition border-b-2 ${
              tab === "ny"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Nytt skjema
          </button>

          <button
            onClick={() => setTab("historikk")}
            className={`pb-4 px-2 text-sm font-medium transition border-b-2 ${
              tab === "historikk"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Tidligere besvarelser
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        {tab === "ny" && <HealthQuestionnaire patientId={patientId} />}

        {tab === "historikk" && (
          <QuestionnaireHistory
            patientId={patientId}
            initialOpenId={openId ? Number(openId) : null}
          />
        )}
      </div>
    </div>
  );
}
