export type CreateToDoDto = {
  toDoText: string;
  patientId: number;
  personnelId: number;
  finished: boolean;
  public: boolean;
};

export type ToDoDto = {
  toDoId: number;
  finished: boolean;
  toDoText: string;
  patientId: number;
  personnelId: number | null;
  toDoRuleId?: number;
  public: boolean;
  createdAt?: string;
};
