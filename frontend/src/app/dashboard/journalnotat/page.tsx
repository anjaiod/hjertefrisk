"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import type { JournalNoteDto, JournalNoteType } from "@/types";
import { JournalNoteListItem } from "@/components/molecules/JournalNoteListItem";
import { JournalDetail } from "@/components/organisms/JournalDetail";
import { JournalEditor } from "@/components/organisms/JournalEditor";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FilterType = "Alle" | JournalNoteType;

const FILTER_TABS: FilterType[] = [
  "Alle",
  "JournalNotat",
  "Konsultasjon",
  "Henvisning",
];
const FILTER_LABELS: Record<FilterType, string> = {
  Alle: "Alle",
  JournalNotat: "Journal",
  Konsultasjon: "Kons.",
  Henvisning: "Henvis.",
};

function groupByPeriod(
  notes: JournalNoteDto[],
): { label: string; notes: JournalNoteDto[] }[] {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = notes.filter((n) => new Date(n.createdAt) >= thisWeekStart);
  const thisMonth = notes.filter(
    (n) =>
      new Date(n.createdAt) >= thisMonthStart &&
      new Date(n.createdAt) < thisWeekStart,
  );
  const older = notes.filter((n) => new Date(n.createdAt) < thisMonthStart);

  const groups = [];
  if (thisWeek.length) groups.push({ label: "Denne uken", notes: thisWeek });
  if (thisMonth.length)
    groups.push({ label: "Denne måneden", notes: thisMonth });
  if (older.length) groups.push({ label: "Tidligere", notes: older });
  return groups;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JournalnotatPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const patientId = Number(searchParams.get("patientId"));

  const [notes, setNotes] = useState<JournalNoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("Alle");
  const [selectedNote, setSelectedNote] = useState<JournalNoteDto | null>(null);
  // null = new note, JournalNoteDto = editing existing note
  const [editingNote, setEditingNote] = useState<JournalNoteDto | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<JournalNoteDto | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newNoteType, setNewNoteType] =
    useState<JournalNoteType>("JournalNotat");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!user || !patientId) return;
    setLoading(true);
    apiClient
      .get<JournalNoteDto[]>(`/api/Journalnsoats?patientId=${patientId}`)
      .then((data) => {
        setNotes(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, patientId]);

  const filteredNotes =
    filter === "Alle" ? notes : notes.filter((n) => n.type === filter);
  const grouped = groupByPeriod(filteredNotes);

  function handleNewNote(type: JournalNoteType) {
    setNewNoteType(type);
    setEditingNote(null);
    setSelectedNote(null);
    setEditorOpen(true);
    setDropdownOpen(false);
  }

  function handleSaved(saved: JournalNoteDto) {
    setNotes((prev) => {
      const exists = prev.find(
        (n) => n.journalnotatId === saved.journalnotatId,
      );
      if (exists)
        return prev.map((n) =>
          n.journalnotatId === saved.journalnotatId ? saved : n,
        );
      return [saved, ...prev];
    });
    setEditingNote(saved);
    // Only set selectedNote on the first save of a new note
    setSelectedNote((prev) => (prev === null ? saved : prev));
  }

  function handleCancelEdit() {
    setEditorOpen(false);
    setEditingNote(null);
    if (!selectedNote && notes.length > 0) setSelectedNote(notes[0]);
  }

  async function confirmDelete() {
    if (!noteToDelete) return;
    try {
      await apiClient.delete(
        `/api/Journalnsoats/${noteToDelete.journalnotatId}`,
      );
      const updated = notes.filter(
        (n) => n.journalnotatId !== noteToDelete.journalnotatId,
      );
      setNotes(updated);
      setSelectedNote(updated[0] ?? null);
      setEditorOpen(false);
    } catch {
      alert("Kunne ikke slette notatet.");
    } finally {
      setNoteToDelete(null);
    }
  }

  if (!patientId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Ingen pasient valgt.
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full gap-4 print:block">
        {/* Note list */}
        <aside className="w-80 shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-brand-sky-lighter overflow-hidden print:hidden">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Notater
              </span>
              <span className="text-xs text-gray-400">
                {notes.length} notater
              </span>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy-light rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Opprett notat
                <svg
                  className="w-3 h-3 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  {[
                    {
                      type: "JournalNotat" as JournalNoteType,
                      label: "Journal notat",
                      desc: "Generell journalføring",
                      dot: "bg-brand-navy-light",
                    },
                    {
                      type: "Konsultasjon" as JournalNoteType,
                      label: "Konsultasjon",
                      desc: "Notat fra pasientmøte",
                      dot: "bg-brand-mint-text",
                    },
                    {
                      type: "Henvisning" as JournalNoteType,
                      label: "Henvisning",
                      desc: "Henvisning til spesialist",
                      dot: "bg-brand-sun-text",
                    },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleNewNote(item.type)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                    >
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${item.dot}`}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex border-b border-gray-100 text-xs">
            {FILTER_TABS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-center transition-colors ${
                  filter === f
                    ? "text-brand-navy border-b-2 border-brand-navy font-medium"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Note list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-xs text-gray-400 py-8">
                Laster...
              </div>
            ) : grouped.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-8">
                Ingen notater
              </div>
            ) : (
              grouped.map((group) => (
                <div key={group.label}>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {group.label}
                  </div>
                  {group.notes.map((note) => (
                    <JournalNoteListItem
                      key={note.journalnotatId}
                      note={note}
                      isSelected={
                        selectedNote?.journalnotatId === note.journalnotatId &&
                        !editorOpen
                      }
                      onClick={() => setSelectedNote(note)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Note detail — hidden when editor is open without a note selected */}
        {(!editorOpen || selectedNote) && (
          <section className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-brand-sky-lighter overflow-hidden print:flex print:border-none">
            {selectedNote ? (
              <JournalDetail
                note={selectedNote}
                onEdit={() => {
                  setEditingNote(selectedNote);
                  setSelectedNote(null);
                  setEditorOpen(true);
                }}
                onDelete={() => setNoteToDelete(selectedNote)}
                onClose={() => setSelectedNote(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                <svg
                  className="w-10 h-10 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">Velg et notat eller opprett et nytt</p>
              </div>
            )}
          </section>
        )}

        {/* Editor — takes full width when no note is being read */}
        {editorOpen && (
          <section
            className={`flex flex-col bg-white rounded-xl shadow-sm border border-brand-sky-lighter overflow-hidden print:hidden ${
              selectedNote ? "w-full lg:w-96 xl:w-[480px] shrink-0" : "flex-1"
            }`}
          >
            <JournalEditor
              note={editingNote}
              patientId={patientId}
              initialType={editingNote === null ? newNoteType : undefined}
              onSaved={handleSaved}
              onApproved={(approved) => {
                handleSaved(approved);
                handleCancelEdit();
              }}
              onCancel={handleCancelEdit}
            />
          </section>
        )}
      </div>

      {noteToDelete && (
        <ConfirmModal
          title="Slett notat"
          message="Er du sikker på at du vil slette? Dette kan ikke angres."
          confirmLabel="Slett"
          cancelLabel="Avbryt"
          onConfirm={confirmDelete}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </>
  );
}
