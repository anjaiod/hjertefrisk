"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type {
  JournalNoteDto,
  JournalNoteType,
  CreateJournalNoteDto,
  UpdateJournalNoteDto,
  CategoryDto,
  QueryDto,
  MeasurementResultDto,
} from "@/types";
import { RichTextEditor } from "@/components/molecules/RichTextEditor";
import { NoteTypeTag } from "@/components/atoms/NoteTypeTag";
import { getTemplates } from "@/lib/journalTemplates";
import {
  tagVariantFromCategoryScore,
  sleepTagVariant,
  tagTextFromVariant,
} from "@/lib/riskUtils";

const NOTE_TYPES: { value: JournalNoteType; label: string }[] = [
  { value: "Konsultasjon", label: "Konsultasjon" },
  { value: "JournalNotat", label: "Journal notat" },
  { value: "Henvisning", label: "Henvisning" },
  { value: "Epikrise", label: "Epikrise" },
];

const HJERTEFRISK_TEMPLATE_IDS = new Set([
  "hjertefrisk-kardiometabolsk",
  "hjertefrisk-oppstart-antipsykotika",
]);

// measurementId → label used in the template <li> fields
const MEASUREMENT_LABELS: Record<number, string> = {
  1: "Vekt (kg)",
  2: "Høyde (cm)",
  3: "Livvidde (cm)",
  4: "HbA1c (mmol/mol)",
  6: "Totalkolesterol (mmol/l)",
  7: "LDL-kolesterol (mmol/l)",
  8: "HDL-kolesterol (mmol/l)",
  9: "Triglyserider (mmol/l)",
  10: "KMI (kg/m²)",
  11: "Blodtrykk (mmHg)",
  12: "Blodtrykk (mmHg)",
};

// categoryId → label used in the template <li> fields
const CATEGORY_RISK_LABELS: Record<number, string> = {
  6: "Status", // Røyking
  7: "Fysisk aktivitet", // Fysisk aktivitet
  8: "Kosthold", // Kosthold
  9: "KMI (kg/m²)", // Overvekt/kroppsdata
  15: "HbA1c (mmol/mol)", // Glukoseregulering
  16: "LDL-kolesterol (mmol/l)", // Blodlipider
};

type PersonnelMeasureResult = {
  personnelMeasureId: number;
  categoryId: number | null;
  categoryScore: number;
  title: string | null;
};

function typeLabel(type: JournalNoteType) {
  return NOTE_TYPES.find((t) => t.value === type)?.label ?? type;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}.${mm}.${yy}`;
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

function injectIntoHtml(
  html: string,
  measurements: MeasurementResultDto[],
  categoryScores: Record<number, number>,
  categories: CategoryDto[],
  personnelMeasures: PersonnelMeasureResult[],
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const measureById: Record<number, number> = {};
  const measureDateById: Record<number, string> = {};
  for (const m of measurements) {
    measureById[m.measurementId] = m.result;
    measureDateById[m.measurementId] = formatDate(m.registeredAt);
  }

  // Combine BT systolisk/diastolisk into one string
  const btValue =
    measureById[11] != null && measureById[12] != null
      ? `${measureById[11]}/${measureById[12]}`
      : (measureById[11] ?? measureById[12] ?? null);
  const btDate = measureDateById[11] ?? measureDateById[12] ?? null;

  // Build categoryId → riskText map
  const riskByCategoryId: Record<number, string> = {};
  const measuresByCategory: Record<number, PersonnelMeasureResult[]> = {};
  for (const m of personnelMeasures) {
    if (!m.categoryId) continue;
    measuresByCategory[m.categoryId] ??= [];
    measuresByCategory[m.categoryId].push(m);
  }

  for (const cat of categories) {
    const score = categoryScores[cat.categoryId];
    if (score == null) continue;

    // Sleep uses title-based logic
    const catNameLower = cat.name.toLowerCase().trim();
    if (catNameLower === "søvn") {
      const measures = measuresByCategory[cat.categoryId] ?? [];
      const variant = sleepTagVariant(measures);
      if (variant)
        riskByCategoryId[cat.categoryId] = tagTextFromVariant(variant);
      continue;
    }

    const variant = tagVariantFromCategoryScore(cat.name, score);
    if (variant) riskByCategoryId[cat.categoryId] = tagTextFromVariant(variant);
  }

  // Inject into <li> elements by matching label text
  const listItems = doc.querySelectorAll("li");
  for (const li of listItems) {
    const strong = li.querySelector("strong");
    if (!strong) continue;
    const label = strong.textContent?.replace(/:$/, "").trim() ?? "";

    // Try measurements first
    let injected = false;
    if (
      (label === "Blodtrykk (mmHg)" || label === "BT (mmHg)") &&
      btValue != null
    ) {
      injectValue(li, String(btValue), btDate);
      injected = true;
    } else {
      for (const [idStr, measureLabel] of Object.entries(MEASUREMENT_LABELS)) {
        const id = Number(idStr);
        if (id === 11 || id === 12) continue; // handled above as BT
        if (label === measureLabel && measureById[id] != null) {
          injectValue(li, String(measureById[id]), measureDateById[id] ?? null);
          injected = true;
          break;
        }
      }
    }

    if (injected) continue;

    // Try risk levels
    for (const [catIdStr, riskLabel] of Object.entries(CATEGORY_RISK_LABELS)) {
      const catId = Number(catIdStr);
      if (label === riskLabel && riskByCategoryId[catId]) {
        appendRisk(li, riskByCategoryId[catId]);
        break;
      }
    }
  }

  return doc.body.innerHTML;
}

function injectAfterLabel(li: Element, html: string) {
  const hint = li.querySelector("span");
  if (hint) {
    // Replace hint text with the actual value — cleaner than appending after it
    hint.outerHTML = html;
  } else {
    const p = li.querySelector("p");
    if (p) {
      p.insertAdjacentHTML("beforeend", html);
    } else {
      const strong = li.querySelector("strong");
      if (strong) {
        strong.insertAdjacentHTML("afterend", html);
      } else {
        li.insertAdjacentHTML("beforeend", html);
      }
    }
  }
}

function injectValue(li: Element, value: string, date: string | null) {
  const text = date ? `${value} [${date}]` : value;
  injectAfterLabel(
    li,
    ` <span style="color:var(--color-brand-navy-light)">${text}</span>`,
  );
}

function appendRisk(li: Element, riskText: string) {
  injectAfterLabel(
    li,
    ` <span style="color:var(--color-brand-navy-light)">RISIKO: ${riskText.toUpperCase()}</span>`,
  );
}

type JournalEditorProps = {
  note: JournalNoteDto | null;
  patientId: number;
  initialType?: JournalNoteType;
  compact?: boolean;
  hjertefriskOpen?: boolean;
  onToggleHjertefrisk?: () => void;
  onSaved: (note: JournalNoteDto) => void;
  onApproved: (note: JournalNoteDto) => void;
  onCancel: () => void;
};

export function JournalEditor({
  note,
  patientId,
  initialType,
  compact = false,
  hjertefriskOpen = false,
  onToggleHjertefrisk,
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
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [filling, setFilling] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const savedNoteRef = useRef<JournalNoteDto | null>(note);
  const savingRef = useRef(false);
  // New notes are only persisted on explicit save — auto-save is disabled until then
  const isNewNoteRef = useRef(note === null);

  const templates = getTemplates(type);
  const isHjertefriskTemplate =
    activeTemplateId !== null && HJERTEFRISK_TEMPLATE_IDS.has(activeTemplateId);

  useEffect(() => {
    savedNoteRef.current = note;
  }, [note]);

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

  const handleFillValues = useCallback(async () => {
    setFilling(true);
    try {
      const [allMeasurements, query, categories] = await Promise.all([
        apiClient.get<MeasurementResultDto[]>(
          `/api/patients/${patientId}/all-measurements`,
        ),
        apiClient.get<QueryDto>("/api/Query/by-name/Helseskjema"),
        apiClient.get<CategoryDto[]>("/api/Categories"),
      ]);

      // Deduplicate: keep latest result per measurement ID
      const latestById: Record<number, MeasurementResultDto> = {};
      for (const m of allMeasurements) {
        const existing = latestById[m.measurementId];
        if (
          !existing ||
          new Date(m.registeredAt) > new Date(existing.registeredAt)
        ) {
          latestById[m.measurementId] = m;
        }
      }
      const measurements = Object.values(latestById);

      const evaluation = await apiClient.post<{
        personnelMeasures: PersonnelMeasureResult[];
        categoryScores: Record<number, number>;
      }>("/api/measures/evaluate", {
        patientId,
        queryId: query.id,
        languageCode: "no",
      });

      const updated = injectIntoHtml(
        content,
        measurements,
        evaluation.categoryScores,
        categories,
        evaluation.personnelMeasures,
      );

      setContent(updated);
      setAutoSaveStatus("unsaved");
    } catch {
      alert("Kunne ikke hente pasientdata.");
    } finally {
      setFilling(false);
    }
  }, [patientId, content]);

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
  }

  const templateDropdown =
    templates.length > 0 ? (
      <div className="relative" ref={templateDropdownRef}>
        <button
          type="button"
          onClick={() => setTemplateDropdownOpen((o) => !o)}
          className="px-2.5 py-1 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          Mal
        </button>
        {templateDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 min-w-52">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setContent(tpl.content);
                  setActiveTemplateId(tpl.id);
                  setAutoSaveStatus("unsaved");
                  setTemplateDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        )}
      </div>
    ) : null;

  const fillButton = (
    <button
      type="button"
      onClick={handleFillValues}
      disabled={filling || !isHjertefriskTemplate}
      className={`px-2.5 py-1 text-sm border rounded transition-colors whitespace-nowrap ${
        isHjertefriskTemplate
          ? "text-brand-navy border-brand-navy hover:bg-brand-sky-button disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          : "invisible"
      }`}
    >
      {filling ? "Henter..." : "Hent verdier"}
    </button>
  );

  const hjertefriskButton = onToggleHjertefrisk ? (
    <button
      type="button"
      onClick={onToggleHjertefrisk}
      className={`px-2.5 py-1 text-sm rounded border transition-colors whitespace-nowrap ${
        hjertefriskOpen
          ? "bg-brand-teal text-white border-brand-teal cursor-pointer"
          : "text-gray-500 border-gray-200 hover:bg-gray-50 cursor-pointer"
      }`}
    >
      Siste besvarelse
    </button>
  ) : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col border-b border-gray-200">
        {compact ? (
          <>
            {/* Compact: two rows */}
            <div className="flex items-center justify-between gap-2 px-4 py-2">
              <NoteTypeTag type={type} className="whitespace-nowrap shrink-0" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-2.5 py-1 text-sm text-gray-600 hover:text-gray-900 rounded border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
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
                  className="px-2.5 py-1 text-sm text-brand-navy rounded border border-brand-navy hover:bg-brand-sky-button disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                >
                  Lagre
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={saving || approving}
                  className="px-2.5 py-1 text-sm bg-brand-navy text-white rounded hover:bg-brand-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                >
                  Godkjenn
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 border-t border-gray-100">
              {hjertefriskButton}
              {templateDropdown}
              {fillButton}
            </div>
          </>
        ) : (
          /* Wide: single row */
          <div className="flex items-center justify-between px-4 py-2 gap-3">
            <NoteTypeTag type={type} className="whitespace-nowrap" />
            {hjertefriskButton}
            <div className="flex items-center gap-1.5 flex-1">
              {templateDropdown}
              {fillButton}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onCancel}
                className="px-2.5 py-1 text-sm text-gray-600 hover:text-gray-900 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
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
                className="px-2.5 py-1 text-sm text-brand-navy rounded border border-brand-navy hover:bg-brand-sky-button disabled:opacity-50 transition-colors font-medium"
              >
                Lagre
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={saving || approving}
                className="px-2.5 py-1 text-sm bg-brand-navy text-white rounded hover:bg-brand-navy-light disabled:opacity-50 transition-colors font-medium"
              >
                Godkjenn
              </button>
            </div>
          </div>
        )}
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
          {autoSaveStatus === "saving"
            ? "Lagrer..."
            : autoSaveStatus === "unsaved"
              ? "Endringer ikke lagret"
              : savedNoteRef.current
                ? "Lagret"
                : "Lagres når du trykker Lagre"}
        </span>
      </div>
    </div>
  );
}
