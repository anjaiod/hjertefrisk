export type CreateQuestionDependencyDto = {
  parentQueryId: number;
  parentQuestionId: number;
  childQueryId: number;
  childQuestionId: number;
  triggerOptionId?: number | null;
  triggerTextValue?: string | null;
  triggerNumberValue?: number | null;
  operator: string;
};

export type QuestionDependencyDto = {
  parentQueryId: number;
  parentQuestionId: number;
  childQueryId: number;
  childQuestionId: number;
  triggerOptionId?: number | null;
  triggerTextValue?: string | null;
  triggerNumberValue?: number | null;
  operator: string;
};
