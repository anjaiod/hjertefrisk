"use client";

import { useSearchParams } from "next/navigation";
import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import QuestionnaireHistory from "../../../components/molecules/QuestionnaireHistory";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const searchParams = useSearchParams();
  const openId = searchParams.get("open");

  const { user: localUser } = useUser();
  const patientId = localUser ? Number.parseInt(localUser.id, 10) : null;

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientTidligereBevarelser" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="p-6">
          <h1 className="text-2xl font-bold text-brand-navy mb-6">
            Tidligere besvarelser
          </h1>

          {patientId && Number.isFinite(patientId) ? (
            <QuestionnaireHistory
              patientId={patientId}
              initialOpenId={openId ? Number(openId) : null}
              patientLabel="deg selv"
            />
          ) : (
            <p className="text-slate-500 text-sm">Ingen pasient funnet.</p>
          )}
        </main>
      </div>
    </div>
  );
}
