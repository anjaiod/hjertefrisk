"use client";

import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface AnsweredQueryHistory {
  id: number;
  createdAt: string;
  filledInByName: string | null;
}

export function QuestionnaireList({ patientId }: { patientId: number }) {
  const [forms, setForms] = useState<AnsweredQueryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!patientId) return;

    apiClient
      .get<AnsweredQueryHistory[]>(
        `/api/patients/${patientId}/response-history`,
      )
      .then((data) => {
        setForms(data.slice(0, 3));
      })
      .catch(() => {
        console.error("Kunne ikke hente spørreskjema");
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-2">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Tidligere spørreskjema
      </h3>

      {loading && (
        <p className="text-sm text-slate-500">
          Laster tidligere besvarelser...
        </p>
      )}

      {!loading && forms.length === 0 && (
        <p className="text-sm text-slate-500">Ingen tidligere besvarelser</p>
      )}

      <div className="flex flex-col gap-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-slate-50 transition"
          >
            <div className="flex flex-col">
              <span className="text-slate-700">
                Besvart {formatFullDate(form.createdAt)}
              </span>
              <span className="text-xs text-slate-400">
                Fylt inn av {form.filledInByName ?? "deg selv"}
              </span>
            </div>

            <Button
              onClick={() =>
                router.push(
                  `/pasientDashboard/pasientTidligereBevarelser?open=${form.id}`,
                )
              }
            >
              Åpne
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
