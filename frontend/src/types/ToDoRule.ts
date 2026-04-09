export interface ToDoRule {
  id: number;
  triggerType: string; // 'Question' or 'Category'
  questionId?: number;
  categoryId?: number;
  scoreThreshold?: number;
  requiredOption?: string;
  requiredText?: string;
  requiredValue?: string;
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=';
  toDoText: string;
  priority: number; // 0 = low, 1 = medium, 2 = high
  isExclusive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateToDoRule {
  triggerType: string; // 'Question' or 'Category'
  questionId?: number;
  categoryId?: number;
  scoreThreshold?: number;
  requiredOption?: string;
  requiredText?: string;
  requiredValue?: string;
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=';
  toDoText: string;
  priority: number; // 0 = low, 1 = medium, 2 = high
  isExclusive: boolean;
}
