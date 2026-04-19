import type { JournalNoteDto } from "@/types";
import { NoteTypeTag } from "@/components/atoms/NoteTypeTag";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type JournalNoteListItemProps = {
  note: JournalNoteDto;
  isSelected: boolean;
  onClick: () => void;
};

export function JournalNoteListItem({
  note,
  isSelected,
  onClick,
}: JournalNoteListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 border-b border-gray-50 transition-colors ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <NoteTypeTag type={note.type} />
        {note.signedAt ? (
          <svg
            className="w-3 h-3 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16z"
              clipRule="evenodd"
              className="text-brand-mint-background"
            />
            <path
              fillRule="evenodd"
              d="M13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
              className="text-brand-sage"
            />
          </svg>
        ) : (
          <span className="text-xs px-1.5 py-0.5 rounded bg-brand-orange-lightest text-brand-orange shrink-0">
            Utkast
          </span>
        )}
      </div>
      <div className="text-sm text-gray-400">
        {note.personnelName} · {formatDateTime(note.createdAt)}
      </div>
    </button>
  );
}
