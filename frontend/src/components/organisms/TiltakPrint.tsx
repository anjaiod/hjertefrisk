"use client";

import { useRouter } from "next/navigation";
import type { QuickMeasureResultDto } from "@/types";

interface TiltakPrintProps {
  measures: QuickMeasureResultDto[];
  patientId: number;
}

function splitBullets(text: string): string[] {
  const parts = text
    .split(/(?:^|\s)-\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}

function BulletText({ text }: { text: string }) {
  const parts = splitBullets(text);
  if (parts.length <= 1) {
    return <p className="text-gray-800 text-sm leading-relaxed">{text}</p>;
  }
  return (
    <ul className="list-disc pl-5 space-y-1 text-gray-800 text-sm leading-relaxed">
      {parts.map((part, i) => (
        <li key={i}>{part}</li>
      ))}
    </ul>
  );
}

function buildBulletHtml(text: string): string {
  const parts = splitBullets(text);
  if (parts.length <= 1) {
    return `<p class="measure-text">${text}</p>`;
  }
  const items = parts.map((p) => `<li>${p}</li>`).join("\n      ");
  return `<ul class="measure-list">\n      ${items}\n    </ul>`;
}

function groupByCategory(
  measures: QuickMeasureResultDto[],
): { category: string; items: QuickMeasureResultDto[] }[] {
  const map = new Map<string, QuickMeasureResultDto[]>();
  for (const m of measures) {
    const key = m.categoryName ?? "Generelt";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

export default function TiltakPrint({ measures, patientId }: TiltakPrintProps) {
  const router = useRouter();
  const missingData = measures.filter((m) => m.isMissingData);
  const actionable = measures.filter((m) => !m.isMissingData);
  const sorted = [...actionable].sort((a, b) => b.priority - a.priority);
  const groups = groupByCategory(sorted);
  const missingGroups = groupByCategory(missingData);

  const dateStr = new Date().toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const missingHtml =
      missingGroups.length === 0
        ? ""
        : `
  <div class="missing-section">
    <div class="missing-label">Kategorier uten svar</div>
    ${missingGroups
      .map(
        ({ category }) => `
    <div class="missing-item">
      <span class="missing-category">${category}</span>
      <span class="missing-tag">— manglende data</span>
    </div>`,
      )
      .join("\n")}
  </div>`;

    const groupsHtml =
      sorted.length === 0 && missingGroups.length === 0
        ? `<p class="empty">Ingen tiltak ble generert basert på svarene i skjemaet.</p>`
        : groups
            .map(
              ({ category, items }) => `
  <div class="category-group">
    <div class="category-title">${category}</div>
    ${items
      .map(
        (m) => `
    <div class="measure">
      ${m.title ? `<div class="measure-title">${m.title}</div>` : ""}
      ${m.fallbackText ? buildBulletHtml(m.fallbackText) : ""}
      ${m.resourceUrl ? `<p class="measure-url-label">Les mer: <a href="${m.resourceUrl}" class="measure-url">${m.resourceUrl}</a></p>` : ""}
    </div>`,
      )
      .join("\n")}
  </div>`,
            )
            .join("\n") + missingHtml;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="nb">
<head>
  <meta charset="UTF-8" />
  <title>Tiltak – Pasient ${patientId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      color: #1a1a2e;
      background: #fff;
      padding: 18mm 20mm 14mm;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 3px solid #1a3a5c;
      padding-bottom: 5mm;
      margin-bottom: 7mm;
    }
    .header-title { font-size: 20pt; font-weight: bold; color: #1a3a5c; }
    .header-sub { font-size: 9pt; color: #555; margin-top: 1mm; }
    .header-meta { text-align: right; font-size: 9pt; color: #555; line-height: 1.6; }
    .section-label {
      font-size: 9pt;
      font-weight: bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #1a3a5c;
      margin-bottom: 4mm;
    }
    .category-group { margin-bottom: 6mm; page-break-inside: avoid; }
    .category-title {
      font-size: 11pt;
      font-weight: bold;
      color: #1a3a5c;
      text-transform: capitalize;
      border-bottom: 1px solid #c8d8e8;
      padding-bottom: 1.5mm;
      margin-bottom: 3mm;
    }
    .measure {
      background: #f7f9fc;
      border-left: 4px solid #1a3a5c;
      border-radius: 3px;
      padding: 3mm 5mm;
      margin-bottom: 3mm;
      page-break-inside: avoid;
    }
    .measure-title { font-weight: bold; font-size: 11pt; color: #1a3a5c; margin-bottom: 1.5mm; }
    .measure-text { font-size: 11pt; color: #333; line-height: 1.5; }
    .measure-list { font-size: 11pt; color: #333; line-height: 1.6; padding-left: 18px; }
    .measure-list li { margin-bottom: 1mm; }
    .measure-url-label { font-size: 9pt; color: #555; margin-top: 2mm; }
    .measure-url { color: #1a56db; }
    .footer {
      border-top: 1px solid #ccc;
      margin-top: 8mm;
      padding-top: 3mm;
      font-size: 8pt;
      color: #888;
      display: flex;
      justify-content: space-between;
    }
    .empty { color: #888; font-style: italic; }
    .missing-section { margin-top: 6mm; }
    .missing-label {
      font-size: 9pt;
      font-weight: bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 3mm;
    }
    .missing-item {
      background: #f5f5f5;
      border-left: 4px solid #ccc;
      border-radius: 3px;
      padding: 2mm 5mm;
      margin-bottom: 2mm;
    }
    .missing-category { font-size: 10pt; color: #777; text-transform: capitalize; }
    .missing-tag { font-size: 9pt; color: #aaa; font-style: italic; margin-left: 4px; }
    @media print {
      body { padding: 10mm 12mm; }
      .category-group { break-inside: avoid; }
      .measure { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="header-title">Hjertefrisk</div>
      <div class="header-sub">Tiltaksplan</div>
    </div>
    <div class="header-meta">
      Pasient-ID: ${patientId}<br/>
      Dato: ${dateStr}
    </div>
  </div>
  <div class="section-label">Anbefalte tiltak (${sorted.length})${missingGroups.length > 0 ? ` · ${missingGroups.length} kategori${missingGroups.length === 1 ? "" : "er"} uten svar` : ""}</div>
  ${groupsHtml}
  <div class="footer">
    <span>Hjertefrisk – tiltaksplan</span>
    <span>Generert: ${dateStr}</span>
  </div>
</body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Screen toolbar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-slate-50 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-brand-navy transition-colors cursor-pointer"
            aria-label="Tilbake"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tilbake
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Tiltak – Hjertefrisk
          </h1>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          disabled={sorted.length === 0}
          className="flex items-center gap-2 px-5 py-2 bg-brand-navy text-white rounded-md hover:opacity-90 disabled:opacity-40 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Skriv ut tiltak
        </button>
      </div>

      {/* Screen preview */}
      <div className="px-8 py-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-brand-navy pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Hjertefrisk</h1>
            <p className="text-sm text-gray-500">Tiltaksplan</p>
          </div>
          <div className="text-right text-sm text-gray-500 leading-relaxed">
            <p>Pasient-ID: {patientId}</p>
            <p>Dato: {dateStr}</p>
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-4">
          Anbefalte tiltak ({sorted.length})
          {missingGroups.length > 0 && (
            <span className="ml-2 font-normal text-gray-400 normal-case tracking-normal">
              · {missingGroups.length} kategori
              {missingGroups.length === 1 ? "" : "er"} uten svar
            </span>
          )}
        </p>

        {sorted.length === 0 && missingData.length === 0 ? (
          <p className="text-gray-500 italic">
            Ingen tiltak ble generert basert på svarene i skjemaet.
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map(({ category, items }) => (
              <div key={category}>
                <h2 className="text-sm font-bold text-brand-navy capitalize border-b border-blue-200 pb-1 mb-3">
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((m) => (
                    <div
                      key={m.quickMeasureId}
                      className="bg-slate-50 border-l-4 border-brand-navy rounded px-5 py-4"
                    >
                      {m.title && (
                        <p className="font-semibold text-brand-navy mb-1">
                          {m.title}
                        </p>
                      )}
                      {m.fallbackText && <BulletText text={m.fallbackText} />}
                      {m.resourceUrl && (
                        <p className="text-sm mt-2">
                          <span className="text-gray-600">Les mer: </span>
                          <a
                            href={m.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            {m.resourceUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {missingGroups.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Kategorier uten svar
                </p>
                <div className="space-y-2">
                  {missingGroups.map(({ category }) => (
                    <div
                      key={category}
                      className="bg-gray-50 border-l-4 border-gray-300 rounded px-5 py-3 flex items-center gap-3"
                    >
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {category}
                      </span>
                      <span className="text-xs text-gray-400 italic">
                        — manglende data
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>Hjertefrisk – tiltaksplan</span>
          <span>Generert: {dateStr}</span>
        </div>
      </div>
    </div>
  );
}
