"use client";

import React, { useState } from "react";
import type {
  CategoryDto,
  QuestionDto,
  CreateQuestionAnswerRule,
  CreateCategoryScoreRule,
  CreateToDoRule,
  Operator,
} from "@/types";

interface RuleCreationFormProps {
  mode: "answer" | "score";
  categories: CategoryDto[];
  questions: QuestionDto[];
  onRuleCreated: (rule: CreateToDoRule) => Promise<void>;
}

export default function RuleCreationForm({
  mode,
  categories,
  questions,
  onRuleCreated,
}: RuleCreationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Answer-based form state
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [answerOperator, setAnswerOperator] = useState<Operator>("=");
  const [answerValue, setAnswerValue] = useState<string>("");

  // Score-based form state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [scoreThreshold, setScoreThreshold] = useState<number>(0);
  const [scoreOperator, setScoreOperator] = useState<Operator>(">=");

  // Common form state
  const [toDoText, setToDoText] = useState<string>("");
  const [priority, setPriority] = useState<number>(1); // 0=low, 1=medium, 2=high

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      let rule: CreateToDoRule;

      if (mode === "answer") {
        // Determine if the value is a number, text, or option reference
        const numValue = parseFloat(answerValue);
        const isNumeric = !isNaN(numValue) && answerValue.trim() !== "";

        rule = {
          triggerType: "Question",
          questionId: parseInt(selectedQuestion),
          operator: answerOperator,
          toDoText,
          priority,
          ...(isNumeric
            ? { requiredValue: numValue }
            : { requiredText: answerValue }),
        } as CreateQuestionAnswerRule;
      } else {
        rule = {
          triggerType: "Category",
          categoryId: parseInt(selectedCategory),
          scoreThreshold: Math.floor(scoreThreshold),
          operator: scoreOperator,
          toDoText,
          priority,
        } as CreateCategoryScoreRule;
      }

      await onRuleCreated(rule);

      // Reset form
      if (mode === "answer") {
        setSelectedQuestion("");
        setAnswerOperator("=");
        setAnswerValue("");
      } else {
        setSelectedCategory("");
        setScoreThreshold(0);
        setScoreOperator(">=");
      }
      setToDoText("");
      setPriority(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rule");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "answer") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Select Question *
          </label>
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a question...</option>
            {questions.map((q) => (
              <option key={q.questionId} value={q.questionId}>
                {q.fallbackText}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Operator *
          </label>
          <select
            value={answerOperator}
            onChange={(e) => setAnswerOperator(e.target.value as Operator)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value="<">&lt;</option>
            <option value=">"></option>
            <option value="<=">&lt;=</option>
            <option value=">=">=</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Value (Option/Text/Number) *
          </label>
          <input
            type="text"
            value={answerValue}
            onChange={(e) => setAnswerValue(e.target.value)}
            placeholder="e.g., 'Yes', 'true', '7'"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            TODO Text *
          </label>
          <textarea
            value={toDoText}
            onChange={(e) => setToDoText(e.target.value)}
            placeholder="What should be done?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedQuestion || !answerValue || !toDoText}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Creating..." : "Create Rule"}
        </button>
      </form>
    );
  }

  // Score-based form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Select Category *
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Choose a category...</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Score Operator *
        </label>
        <select
          value={scoreOperator}
          onChange={(e) => setScoreOperator(e.target.value as Operator)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value=">=">&gt;=</option>
          <option value=">">&gt;</option>
          <option value="=">=</option>
          <option value="<">&lt;</option>
          <option value="<=">&lt;=</option>
          <option value="!=">&lt;&gt;</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Score Threshold *
        </label>
        <input
          type="number"
          value={scoreThreshold}
          onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
          placeholder="e.g., 25"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          TODO Text *
        </label>
        <textarea
          value={toDoText}
          onChange={(e) => setToDoText(e.target.value)}
          placeholder="What should be done?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={
          loading ||
          !selectedCategory ||
          scoreThreshold === undefined ||
          !toDoText
        }
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? "Creating..." : "Create Rule"}
      </button>
    </form>
  );
}
