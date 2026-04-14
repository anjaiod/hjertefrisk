import type { QuestionOptionDto } from './QuestionOption';

export type CreateQuestionDto = {
  categoryId?: number | null;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole?: string | null;
};

export type QuestionDto = {
  questionId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole?: string | null;
  options?: QuestionOptionDto[];
};

export type Question = {
  id: number;
  categoryId?: number | null;
  text: string;
  type?: string;
  isRequired?: boolean;
};
