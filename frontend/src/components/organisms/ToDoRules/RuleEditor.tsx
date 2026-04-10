'use client';

import React, { useState } from 'react';
import type { CreateQuestionAnswerRule, QuestionDto } from '@/types';

interface RuleEditorProps {
  question: QuestionDto;
  optionId?: number;
  onClose: () => void;
  onRuleCreated: (rule: CreateQuestionAnswerRule) => Promise<void>;
}

export default function RuleEditor({
  question,
  optionId,
  onClose,
  onRuleCreated
}: RuleEditorProps) {
  const [toDoText, setToDoText] = useState('');
  const [priority, setPriority] = useState(1);
  const [isExclusive, setIsExclusive] = useState(false);
  const [operator, setOperator] = useState('=');
  const [requiredValue, setRequiredValue] = useState('');
  const [loading, setLoading] = useState(false);

  const isRadioQuestion = question.questionType === 'radio';
  const isNumberQuestion = question.questionType === 'number';
  const isTextQuestion = question.questionType === 'text';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!toDoText.trim()) {
      alert('Please enter a TODO text');
      return;
    }

    if (isNumberQuestion && !requiredValue) {
      alert('Please enter the required value');
      return;
    }

    if (isTextQuestion && !requiredValue) {
      alert('Please enter the required text');
      return;
    }

    setLoading(true);
    try {
      const rule: CreateQuestionAnswerRule = {
        questionId: question.questionId,
        toDoText: toDoText.trim(),
        priority,
        isExclusive,
        operator: operator as any,
        triggerType: 'Question'
      };

      if (isRadioQuestion && optionId) {
        rule.requiredOption = optionId;
      } else if (isNumberQuestion) {
        rule.requiredValue = parseFloat(requiredValue);
      } else if (isTextQuestion) {
        rule.requiredText = requiredValue.trim();
      }

      await onRuleCreated(rule);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create rule');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isRadioQuestion && optionId) {
      return `Add Rule for Option ${optionId}`;
    } else if (isNumberQuestion) {
      return 'Add Rule for Number Answers';
    } else if (isTextQuestion) {
      return 'Add Rule for Text Answers';
    }
    return 'Add Rule';
  };

  const getValueLabel = () => {
    if (isRadioQuestion) return null;
    if (isNumberQuestion) return 'Required Value';
    if (isTextQuestion) return 'Required Text';
    return 'Required Value';
  };

  const getOperatorOptions = () => {
    if (isNumberQuestion) {
      return ['=', '!=', '<', '>', '<=', '>='];
    }
    return ['=', '!='];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <div className="mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600">
              {question.fallbackText}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">TODO Text *</label>
            <textarea
              value={toDoText}
              onChange={(e) => setToDoText(e.target.value)}
              placeholder="What should happen when this condition is met?"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={loading}
            />
          </div>

          {getValueLabel() && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {getValueLabel()} *
              </label>
              <input
                type={isNumberQuestion ? 'number' : 'text'}
                value={requiredValue}
                onChange={(e) => setRequiredValue(e.target.value)}
                placeholder={
                  isNumberQuestion ? 'e.g., 170' : 'e.g., text to match'
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                step={isNumberQuestion ? 'any' : undefined}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Operator</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {getOperatorOptions().map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exclusive"
              checked={isExclusive}
              onChange={(e) => setIsExclusive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="exclusive" className="text-sm font-medium text-gray-700">
              Exclusive (block other rules)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Rule'}
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
    </div>
  );
}
