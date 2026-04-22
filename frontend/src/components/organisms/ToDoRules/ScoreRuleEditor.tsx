"use client";

import React, { useState } from "react";
import type { CreateCategoryScoreRule, CategoryDto, Operator } from "@/types";
import { Modal } from "@/components/atoms/Modal";

interface ScoreRuleEditorProps {
  categoryId: number;
  category: CategoryDto | undefined;
  onClose: () => void;
  onRuleCreated: (rule: CreateCategoryScoreRule) => Promise<void>;
}

export default function ScoreRuleEditor({
  categoryId,
  category,
  onClose,
  onRuleCreated,
}: ScoreRuleEditorProps) {
  const [toDoText, setToDoText] = useState("");
  const [priority, setPriority] = useState(1);
  const [operator, setOperator] = useState<Operator>(">=");
  const [scoreThreshold, setScoreThreshold] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!toDoText.trim()) {
      alert("Please enter a TODO text");
      return;
    }

    if (!scoreThreshold) {
      alert("Please enter a score threshold");
      return;
    }

    setLoading(true);
    try {
      const rule: CreateCategoryScoreRule = {
        categoryId,
        scoreThreshold: parseInt(scoreThreshold),
        toDoText: toDoText.trim(),
        priority,
        operator: operator,
        triggerType: "Category",
      };

      await onRuleCreated(rule);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Add Score Rule for ${category?.name}`}>
      <div className="max-w-md w-full p-2 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TODO Text *
            </label>
            <textarea
              value={toDoText}
              onChange={(e) => setToDoText(e.target.value)}
              placeholder="What should happen when this score is reached?"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operator *
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as Operator)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value=">=">&gt;=</option>
                <option value=">">&gt;</option>
                <option value="<"></option>
                <option value="<=">&lt;=</option>
                <option value="==">=</option>
                <option value="!=">!=</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Score Threshold *
              </label>
              <input
                type="number"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(e.target.value)}
                placeholder="e.g., 50"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) =>
                  setPriority(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Creating..." : "Create Rule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
