export type CreateResponseDto = {
  patientId: number;
  questionId: number;
  selectedOptionId?: number | null;
  textValue?: string | null;
  numberValue?: number | null;
};

export type ResponseDto = {
  patientId: number;
  questionId: number;
  selectedOptionId?: number | null;
  textValue?: string | null;
  numberValue?: number | null;
  createdAt: string;
};
