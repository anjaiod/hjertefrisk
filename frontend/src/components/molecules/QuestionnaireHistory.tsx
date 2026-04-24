"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

interface ResponseHistoryItem {
  questionId: number;
  questionText: string;
  answerText?: string | null;
  numberValue?: number | null;
}

interface AnsweredQueryHistory {
  id: number;
  createdAt: string;
  filledInByName: string | null;
  responses: ResponseHistoryItem[];
}

export default function QuestionnaireHistory({
  patientId,
  initialOpenId,
  patientLabel = "pasienten selv",
}: {
  patientId: number;
  initialOpenId?: number | null;
  patientLabel?: string;
}) {
  const [history, setHistory] = useState<AnsweredQueryHistory[]>([]);
  const [loading, setLoading] = useState(!!patientId);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!patientId) return;

    apiClient
      .get<AnsweredQueryHistory[]>(
        `/api/patients/${patientId}/response-history`,
      )
      .then((data) => {
        setHistory(data);
        if (data.length > 0) {
          if (initialOpenId != null) {
            const found = data.find((h) => h.id === initialOpenId);

            if (found) {
              setExpandedId(found.id);
              return;
            }
          }
          setExpandedId(data[0].id);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Kunne ikke laste historikk");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patientId, initialOpenId]);

  if (loading)
    return <p className="text-slate-500 text-sm">Laster historikk...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (history.length === 0)
    return (
      <p className="text-slate-500 text-sm">
        Ingen tidligere besvarelser funnet.
      </p>
    );

  return (
    <div className="space-y-3">
      {history.map((entry) => {
        const isOpen = expandedId === entry.id;
        const date = new Date(entry.createdAt).toLocaleDateString("nb-NO", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const filledBy = entry.filledInByName ?? patientLabel ?? "ukjent";
        return (
          <div
            key={entry.id}
            className="rounded-lg border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors"
          >
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer"
              onClick={() => setExpandedId(isOpen ? null : entry.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-800">{date}</span>
                <span className="text-xs text-slate-400">
                  Fylt inn av {filledBy}
                </span>
              </div>
              <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                {entry.responses.map((r) => {
                  const answer =
                    r.answerText ??
                    (r.numberValue != null ? String(r.numberValue) : "–");
                  return (
                    <div key={r.questionId} className="flex flex-col">
                      <span className="text-xs text-slate-500">
                        {r.questionText}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {answer}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
