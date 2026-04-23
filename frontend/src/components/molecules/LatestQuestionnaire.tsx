"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

interface LatestResponseItem {
  questionId: number;
  displayOrder: number;
  questionText: string;
  answerText?: string | null;
  numberValue?: number | null;
  answeredAt?: string | null;
  answeredQueryId?: number | null;
  filledInByName?: string | null;
}

export function LatestQuestionnaire({
  patientId,
  onClose,
}: {
  patientId: number;
  onClose?: () => void;
}) {
  const [entries, setEntries] = useState<LatestResponseItem[] | null>(null);
  const [queries, setQueries] = useState<{ id: number; name: string }[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load available queries
    apiClient
      .get<{ id: number; name: string }[]>(`/api/Query`)
      .then((data) => {
        setQueries(data ?? []);
        if (data && data.length && !data.find((q) => q.id === selectedQueryId)) {
          setSelectedQueryId(data[0].id);
        }
      })
      .catch(() => setQueries([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<LatestResponseItem[]>(
        `/api/patients/${patientId}/queries/${selectedQueryId}/latest-responses`,
      )
      .then((data) => setEntries(data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [patientId, selectedQueryId]);
  const date = entries && entries.length
    ? new Date(Math.max(...entries.map(e => e.answeredAt ? new Date(e.answeredAt).getTime() : 0))).toLocaleDateString("nb-NO", {
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Siste Hjertefrisk-skjema
            </span>
            <select
              className="text-xs text-gray-600 border rounded px-2 py-0.5"
              value={selectedQueryId}
              onChange={(e) => setSelectedQueryId(Number(e.target.value))}
            >
              {queries.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
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
        ) : !entries || entries.length === 0 ? (
          <p className="text-xs text-gray-400">Ingen besvarelser funnet.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((r) => {
              const answer =
                r.answerText ?? (r.numberValue != null ? String(r.numberValue) : "–");
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
