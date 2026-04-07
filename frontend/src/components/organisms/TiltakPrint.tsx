"use client";

import type { QuickMeasureResultDto } from "@/types";

interface TiltakPrintProps {
  measures: QuickMeasureResultDto[];
  patientId: number;
}

export default function TiltakPrint({ measures, patientId }: TiltakPrintProps) {
  const sorted = [...measures].sort((a, b) => b.priority - a.priority);

  const dateStr = new Date().toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handlePrint = () => {
    const content = document.getElementById("tiltak-print-content");
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

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
      color: #111;
      padding: 20mm;
    }
    h1 { font-size: 18pt; margin-bottom: 3mm; }
    .meta { font-size: 10pt; color: #555; margin-bottom: 8mm; }
    .measure {
      border-bottom: 1px solid #ddd;
      padding: 4mm 0;
    }
    .measure:last-child { border-bottom: none; }
    .measure-title { font-weight: bold; font-size: 12pt; margin-bottom: 1mm; }
    .measure-text { font-size: 11pt; }
    .measure-url-label { font-size: 10pt; margin-top: 2mm; }
    .measure-url { font-size: 10pt; color: #1a56db; }
    .empty { color: #888; font-style: italic; }
    @media print { body { padding: 10mm; } }
  </style>
</head>
<body>
  ${content.innerHTML}
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
        <h1 className="text-2xl font-bold text-gray-900">Tiltak – Hjertefrisk</h1>
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Skriv ut tiltak
        </button>
      </div>

      {/* Printable content */}
      <div id="tiltak-print-content" className="px-8 py-6 max-w-3xl mx-auto">
        <h1
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          Tiltak – Hjertefrisk
        </h1>
        <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "Arial, sans-serif" }}>
          Pasient-ID: {patientId}&nbsp;&nbsp;|&nbsp;&nbsp;Dato: {dateStr}
        </p>

        {sorted.length === 0 ? (
          <p className="text-gray-500 italic">
            Ingen tiltak ble generert basert på svarene i skjemaet.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {sorted.map((m) => (
              <div key={m.quickMeasureId} className="py-4">
                {m.title && (
                  <p className="font-semibold text-gray-900 mb-1">{m.title}</p>
                )}
                <p className="text-gray-800 text-sm">{m.fallbackText}</p>
                {m.resourceUrl && (
                  <p className="text-sm mt-2">
                    <span className="text-gray-600">Les mer her: </span>
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
        )}
      </div>
    </div>
  );
}
