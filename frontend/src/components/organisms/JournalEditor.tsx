"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type {
  JournalNoteDto,
  JournalNoteType,
  CreateJournalNoteDto,
  UpdateJournalNoteDto,
} from "@/types";
import { RichTextEditor } from "@/components/molecules/RichTextEditor";
import { NoteTypeTag } from "@/components/atoms/NoteTypeTag";
import { getTemplates } from "@/lib/journalTemplates";

const NOTE_TYPES: { value: JournalNoteType; label: string }[] = [
  { value: "Konsultasjon", label: "Konsultasjon" },
  { value: "JournalNotat", label: "Journal notat" },
  { value: "Henvisning", label: "Henvisning" },
  { value: "Epikrise", label: "Epikrise" },
];

function typeLabel(type: JournalNoteType) {
  return NOTE_TYPES.find((t) => t.value === type)?.label ?? type;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type JournalEditorProps = {
  note: JournalNoteDto | null;
  patientId: number;
  initialType?: JournalNoteType;
  onSaved: (note: JournalNoteDto) => void;
  onApproved: (note: JournalNoteDto) => void;
  onCancel: () => void;
};

export function JournalEditor({
  note,
  patientId,
  initialType,
  onSaved,
  onApproved,
  onCancel,
}: JournalEditorProps) {
  const [type] = useState<JournalNoteType>(
    note?.type ?? initialType ?? "JournalNotat",
  );
  const [content, setContent] = useState(note?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedNoteRef = useRef<JournalNoteDto | null>(note);
  const savingRef = useRef(false);
  // New notes are only persisted on explicit save — auto-save is disabled until then
  const isNewNoteRef = useRef(note === null);

  const templates = getTemplates(type);

  useEffect(() => {
    savedNoteRef.current = note;
  }, [note]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!templateDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(e.target as Node)
      ) {
        setTemplateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [templateDropdownOpen]);

  const handleSave = useCallback(
    async (isAutoSave = false): Promise<JournalNoteDto | null> => {
      // Prevent concurrent saves
      if (savingRef.current) return savedNoteRef.current;

      const title = typeLabel(type);
      setAutoSaveStatus("saving");
      if (!isAutoSave) setSaving(true);
      savingRef.current = true;

      try {
        let saved: JournalNoteDto;
        const currentNote = savedNoteRef.current;
        if (currentNote) {
          const dto: UpdateJournalNoteDto = {
            type,
            title,
            content,
            isPrivate: false,
          };
          saved = await apiClient.put<JournalNoteDto>(
            `/api/Journalnsoats/${currentNote.journalnotatId}`,
            dto,
          );
        } else {
          const dto: CreateJournalNoteDto = {
            patientId,
            type,
            title,
            content,
            isPrivate: false,
          };
          saved = await apiClient.post<JournalNoteDto>(
            "/api/Journalnsoats",
            dto,
          );
        }
        savedNoteRef.current = saved;
        setAutoSaveStatus("saved");
        // Notify parent only on explicit save or when updating an existing note
        if (!isAutoSave || !isNewNoteRef.current) {
          onSaved(saved);
        }
        return saved;
      } catch {
        setAutoSaveStatus("unsaved");
        return null;
      } finally {
        setSaving(false);
        savingRef.current = false;
      }
    },
    [patientId, type, content, onSaved],
  );

  const handleApprove = useCallback(async () => {
    setApproving(true);
    try {
      const saved = await handleSave(false);
      if (!saved) return;
      const approved = await apiClient.post<JournalNoteDto>(
        `/api/Journalnsoats/${saved.journalnotatId}/sign`,
      );
      onApproved(approved);
    } catch {
      alert("Kunne ikke godkjenne notatet.");
    } finally {
      setApproving(false);
    }
  }, [handleSave, onApproved]);

  function handleContentChange(html: string) {
    setContent(html);
    setAutoSaveStatus("unsaved");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => handleSave(true), 1500);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <NoteTypeTag type={type} />
          {templates.length > 0 && (
            <div className="relative" ref={templateDropdownRef}>
              <button
                type="button"
                onClick={() => setTemplateDropdownOpen((o) => !o)}
                className="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Velg mal
              </button>
              {templateDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 min-w-52">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setContent(tpl.content);
                        setAutoSaveStatus("unsaved");
                        setTemplateDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={async () => {
              await handleSave(false);
              onCancel();
            }}
            disabled={saving || approving}
            className="px-3 py-1.5 text-sm text-brand-navy rounded border border-brand-navy hover:bg-brand-sky-button disabled:opacity-50 transition-colors font-medium"
          >
            Lagre
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={saving || approving}
            className="px-4 py-1.5 text-sm bg-brand-navy text-white rounded hover:bg-brand-navy-light disabled:opacity-50 transition-colors font-medium"
          >
            Godkjenn
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          disabled={false}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
        <div>
          {note?.signedAt && (
            <span className="text-brand-mint-text font-medium">
              Godkjent {formatDateTime(note.signedAt)}
            </span>
          )}
        </div>
        <span>
          {isNewNoteRef.current
            ? "Lagres når du trykker Lagre"
            : autoSaveStatus === "saving"
              ? "Lagrer..."
              : autoSaveStatus === "saved"
                ? "Lagres automatisk"
                : "Endringer ikke lagret"}
        </span>
      </div>
    </div>
  );
}
