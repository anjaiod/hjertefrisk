export type CreateQueryDto = {
  name: string;
};

export type QueryDto = {
  id: number;
  name: string;
};

export type QueryQuestionOptionDto = {
  questionOptionId: number;
  fallbackText: string;
  optionValue: string;
  displayOrder: number;
};

export type QueryQuestionDependencyDto = {
  parentQuestionId: number;
  childQuestionId: number;
  triggerTextValue?: string | null;
  operator: string;
};

export type QueryQuestionWithDetailsDto = {
  questionId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole?: string | null;
  displayOrder: number;
  options: QueryQuestionOptionDto[];
  dependencies: QueryQuestionDependencyDto[];
};

export type QueryWithQuestionsDto = {
  id: number;
  name: string;
  questions: QueryQuestionWithDetailsDto[];
};
