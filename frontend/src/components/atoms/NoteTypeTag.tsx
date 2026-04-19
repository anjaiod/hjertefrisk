import type { JournalNoteType } from "@/types";

const variantClasses: Record<JournalNoteType, string> = {
  Konsultasjon: "bg-brand-mint-background text-brand-mint-text",
  JournalNotat: "bg-brand-sky-lightest text-brand-navy-light",
  Henvisning: "bg-brand-sun-background text-brand-sun-text",
};

const labels: Record<JournalNoteType, string> = {
  Konsultasjon: "Konsultasjon",
  JournalNotat: "Journal notat",
  Henvisning: "Henvisning",
};

interface NoteTypeTagProps {
  type: JournalNoteType;
  className?: string;
}

export function NoteTypeTag({ type, className = "" }: NoteTypeTagProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[type],
        className,
      ].join(" ")}
    >
      {labels[type]}
    </span>
  );
}
