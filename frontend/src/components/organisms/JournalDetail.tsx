import type { JournalNoteDto } from "@/types";
import { useUser } from "@/context/UserContext";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

type JournalDetailProps = {
  note: JournalNoteDto;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function JournalDetail({
  note,
  onEdit,
  onDelete,
  onClose,
}: JournalDetailProps) {
  const { user } = useUser();
  const isSigned = !!note.signedAt;
  const isOwner = user?.id === String(note.personnelId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {note.title}
            </h2>
            {isSigned && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-mint-background text-brand-mint-text">
                Signert
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {note.personnelName} ·{" "}
            {note.updatedAt && note.updatedAt !== note.createdAt
              ? `Redigert ${formatDate(note.updatedAt)}`
              : formatDate(note.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            title="Lukk"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
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
          {isOwner && (
            <>
              {!isSigned && (
                <button
                  type="button"
                  title="Rediger"
                  onClick={onEdit}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
              {!isSigned && (
                <button
                  type="button"
                  title="Slett"
                  onClick={onDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
          <button
            type="button"
            title="Skriv ut"
            onClick={() => {
              const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8" />
  <title>${note.title}</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 14px; color: #111; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 1.2rem; margin-bottom: 0.25rem; }
    .meta { color: #6b7280; font-size: 0.85rem; margin-bottom: 1.5rem; }
    h2 { font-size: 1rem; margin-top: 1.5rem; margin-bottom: 0.25rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
    h3 { font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.25rem; }
    ul { padding-left: 1.25rem; margin: 0.25rem 0; }
    li { margin-bottom: 0.2rem; }
    p { margin: 0.25rem 0; }
    em { color: #6b7280; }
    .signed { margin-top: 2rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #6fa185; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="meta">${note.personnelName} · ${formatDate(note.createdAt)}</div>
  ${note.content}
  ${note.signedAt ? `<div class="signed">Signert av ${note.personnelName} · ${formatDateTime(note.signedAt)}</div>` : ""}
</body>
</html>`;
              const win = window.open("", "_blank");
              if (!win) return;
              win.document.open();
              win.document.write(html);
              win.document.close();
              win.addEventListener("load", () => win.print());
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div
          className="prose prose-sm max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      {isSigned && (
        <div className="px-6 py-3 border-t border-gray-100 text-xs text-brand-mint-text">
          Signert av {note.personnelName} · {formatDateTime(note.signedAt!)}
        </div>
      )}
    </div>
  );
}
