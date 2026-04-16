/**
 * Operator type for rule conditions
 */
export type Operator = '=' | '!=' | '<' | '>' | '<=' | '>=';

/**
 * Base interface for all ToDoRule types
 */
export interface ToDoRuleBase {
  toDoRuleId: number;
  operator: Operator;
  toDoText: string;
  priority: number; // 0 = low, 1 = medium, 2 = high
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Rule triggered by a question answer (option, text, or numeric value)
 */
export interface QuestionAnswerRule extends ToDoRuleBase {
  triggerType: 'Question';
  questionId: number;
  requiredOption?: number;
  requiredText?: string;
  requiredValue?: number;
}

/**
 * Rule triggered by a category score threshold
 */
export interface CategoryScoreRule extends ToDoRuleBase {
  triggerType: 'Category';
  categoryId: number;
  scoreThreshold: number;
}

export type ToDoRule = QuestionAnswerRule | CategoryScoreRule;

/**
 * Create a new question answer rule
 */
export interface CreateQuestionAnswerRule {
  triggerType: 'Question';
  questionId: number;
  requiredOption?: number;
  requiredText?: string;
  requiredValue?: number;
  operator: Operator;
  toDoText: string;
  priority: number;
}

/**
 * Create a new category score rule
 */
export interface CreateCategoryScoreRule {
  triggerType: 'Category';
  categoryId: number;
  scoreThreshold: number;
  operator: Operator;
  toDoText: string;
  priority: number;
}

export type CreateToDoRule = CreateQuestionAnswerRule | CreateCategoryScoreRule;
