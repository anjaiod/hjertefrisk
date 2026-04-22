export type CreateQuestionOptionDto = {
  questionId: number;
  fallbackText: string;
  optionValue: string;
  displayOrder: number;
};

export type QuestionOptionDto = {
  questionOptionId: number;
  questionId: number;
  fallbackText: string;
  optionValue: string;
  displayOrder: number;
};
