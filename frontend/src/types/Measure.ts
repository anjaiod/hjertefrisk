export type CreateMeasureDto = {
  questionId: number;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  fallbackText: string;
};

export type MeasureDto = {
  measureId: number;
  questionId: number;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  fallbackText: string;
};
