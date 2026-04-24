"use client";

import { useEffect, useState, useRef } from "react";
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
            <div className="relative" ref={/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ (null as any)}>
              {/* Custom dropdown to allow styling of list items (cursor pointer) */}
              <CustomQuerySelect
                queries={queries}
                selectedId={selectedQueryId}
                onChange={(id) => setSelectedQueryId(id)}
              />
            </div>
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

function CustomQuerySelect({
  queries,
  selectedId,
  onChange,
}: {
  queries: { id: number; name: string }[];
  selectedId: number;
  onChange: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = queries.find((q) => q.id === selectedId);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="text-xs text-gray-600 border rounded px-2 py-0.5 cursor-pointer flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected ? selected.name : "Velg..."}</span>
        <svg
          className="w-3 h-3 ml-1 text-gray-500"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 8l4 4 4-4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 z-10 w-56 bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto"
        >
          {queries.map((q) => (
            <li key={q.id} role="option">
              <button
                type="button"
                onClick={() => {
                  onChange(q.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs ${q.id === selectedId ? "bg-gray-100" : "hover:bg-gray-50"} cursor-pointer`}
              >
                {q.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
