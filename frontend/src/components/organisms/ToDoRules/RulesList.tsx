"use client";

import React, { useState } from "react";
import type {
  ToDoRule,
  CategoryDto,
  QuestionDto,
  CreateToDoRule,
  QuestionAnswerRule,
  CategoryScoreRule,
} from "@/types";

interface RulesListProps {
  rules: ToDoRule[];
  categories: CategoryDto[];
  questions: QuestionDto[];
  onRuleUpdated: (id: number, rule: CreateToDoRule) => Promise<void>;
  onRuleDeleted: (id: number) => Promise<void>;
}

export default function RulesList({
  rules,
  categories,
  questions,
  onRuleUpdated,
  onRuleDeleted,
}: RulesListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<CreateToDoRule>>({});

  const getCategoryName = (id: number) =>
    categories.find((c) => c.categoryId === id)?.name || "Unknown";
  const getQuestionText = (id: number) =>
    questions.find((q) => q.questionId === id)?.fallbackText || "Unknown";

  const startEdit = (rule: ToDoRule) => {
    setEditingId(rule.toDoRuleId);
    if (rule.triggerType === "Question") {
      const qRule = rule as QuestionAnswerRule;
      setEditData({
        toDoText: qRule.toDoText,
        priority: qRule.priority,
        triggerType: "Question",
        questionId: qRule.questionId,
        requiredOption: qRule.requiredOption,
        requiredValue: qRule.requiredValue,
        operator: qRule.operator,
      });
    } else {
      const cRule = rule as CategoryScoreRule;
      setEditData({
        toDoText: cRule.toDoText,
        priority: cRule.priority,
        triggerType: "Category",
        categoryId: cRule.categoryId,
        scoreThreshold: cRule.scoreThreshold,
        operator: cRule.operator,
      });
    }
  };

  const saveEdit = async (ruleId: number) => {
    try {
      if (!editData.toDoText) {
        alert("TODO text is required");
        return;
      }
      await onRuleUpdated(ruleId, editData as CreateToDoRule);
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update rule");
    }
  };

  if (rules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No rules created yet. Create your first rule above!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {rules.map((rule) => (
        <div
          key={rule.toDoRuleId}
          className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition"
        >
          {editingId === rule.toDoRuleId ? (
            // Edit Mode
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  TODO Text
                </label>
                <textarea
                  value={editData.toDoText || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, toDoText: e.target.value })
                  }
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(rule.toDoRuleId)}
                  className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-900">
                  {rule.toDoText}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {rule.triggerType === "Question" ? (
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                        Answer
                      </span>
                      Question:{" "}
                      {getQuestionText((rule as QuestionAnswerRule).questionId)}
                    </div>
                  ) : (
                    <div>
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs mr-2">
                        Score
                      </span>
                      Category:{" "}
                      {getCategoryName((rule as CategoryScoreRule).categoryId)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      rule.priority === 2
                        ? "bg-red-100 text-red-800"
                        : rule.priority === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {rule.priority === 2
                      ? "HIGH"
                      : rule.priority === 1
                        ? "MEDIUM"
                        : "LOW"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(rule)}
                    className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRuleDeleted(rule.toDoRuleId)}
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
