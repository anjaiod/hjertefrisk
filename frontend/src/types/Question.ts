export type CreateQuestionDto = {
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole?: string | null;
};

export type QuestionDto = {
  questionId: number;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole?: string | null;
};
