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
    <div className="flex flex-col h-full">
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
            {note.personnelName} · {formatDate(note.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            title="Lukk"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
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
              <button
                type="button"
                title="Rediger"
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
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
              {!isSigned && (
                <button
                  type="button"
                  title="Slett"
                  onClick={onDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
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
            onClick={() => window.print()}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
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
