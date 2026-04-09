export type QuickMeasureResultDto = {
  quickMeasureId: number;
  fallbackText: string;
  title?: string | null;
  resourceUrl?: string | null;
  priority: number;
  categoryName?: string | null;
};

export type EvaluateQuickMeasuresDto = {
  patientId: number;
  queryId: number;
};

export type PatientMeasureResultDto = {
  patientMeasureId: number;
  source: number; // 0 = QuestionTrigger, 1 = CategoryScore
  categoryId?: number | null;
  triggerQuestionId?: number | null;
  categoryScore: number;
  text: string;
  title?: string | null;
  resourceUrl?: string | null;
  generatedAt: string;
  scoreThreshold: number;
  isExclusive: boolean;
  priority: number;
};

export type PersonnelMeasureResultDto = {
  personnelMeasureId: number;
  source: number;
  categoryId?: number | null;
  triggerQuestionId?: number | null;
  categoryScore: number;
  text: string;
  title?: string | null;
  resourceUrl?: string | null;
  generatedAt: string;
  scoreThreshold: number;
  isExclusive: boolean;
  priority: number;
};

export type MeasureEvaluationResultDto = {
  patientMeasures: PatientMeasureResultDto[];
  personnelMeasures: PersonnelMeasureResultDto[];
};

export type EvaluateMeasuresDto = {
  patientId: number;
  queryId: number;
  languageCode?: string | null;
  personnelId?: number | null;
};

export type CreateMeasureDto = {
  questionId: number;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  title?: string | null;
  resourceUrl?: string | null;
  fallbackText: string;
};

export type MeasureDto = {
  measureId: number;
  questionId: number;
  requiredOption?: number | null;
  requiredText?: string | null;
  requiredValue?: number | null;
  operator: string;
  title?: string | null;
  resourceUrl?: string | null;
  fallbackText: string;
};
