export type CreateSeverityDto = {
  questionId?: number | null;
  measurementId?: number | null;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  score: number;
};

export type SeverityDto = {
  severityId: number;
  questionId?: number | null;
  measurementId?: number | null;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  score: number;
};
