"use client";

import { useEffect, useState } from "react";
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
  responses: ResponseHistoryItem[];
}

export function LatestQuestionnaire({
  patientId,
  onClose,
}: {
  patientId: number;
  onClose?: () => void;
}) {
  const [entry, setEntry] = useState<AnsweredQueryHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<AnsweredQueryHistory[]>(
        `/api/patients/${patientId}/response-history`,
      )
      .then((data) => setEntry(data[0] ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [patientId]);

  const date = entry
    ? new Date(entry.createdAt).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Siste Hjertefrisk-skjema
          </span>
          {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading ? (
          <p className="text-xs text-gray-400">Laster...</p>
        ) : !entry ? (
          <p className="text-xs text-gray-400">Ingen besvarelser funnet.</p>
        ) : (
          <div className="space-y-3">
            {entry.responses.map((r) => {
              const answer =
                r.answerText ??
                (r.numberValue != null ? String(r.numberValue) : "–");
              return (
                <div key={r.questionId} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 leading-snug">
                    {r.questionText}
                  </span>
                  <span className="text-xs font-medium text-gray-800">
                    {answer}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
