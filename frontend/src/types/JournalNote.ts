export type JournalNoteType =
  | "JournalNotat"
  | "Konsultasjon"
  | "Henvisning"
  | "Epikrise";

export type CreateJournalNoteDto = {
  patientId: number;
  type: JournalNoteType;
  title: string;
  content: string;
  isPrivate: boolean;
};

export type UpdateJournalNoteDto = {
  type: JournalNoteType;
  title: string;
  content: string;
  isPrivate: boolean;
};

export type JournalNoteDto = {
  journalnotatId: number;
  patientId: number;
  personnelId: number;
  personnelName: string;
  type: JournalNoteType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  isPrivate: boolean;
  signedAt?: string | null;
  signedByPersonnelId?: number | null;
  signedByPersonnelName?: string | null;
};
