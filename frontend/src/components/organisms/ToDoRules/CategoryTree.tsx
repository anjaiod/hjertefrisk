'use client';

import React, { useState } from 'react';
import type { CategoryDto, QuestionDto, ToDoRule, CreateToDoRule, QuestionAnswerRule, CategoryScoreRule } from '@/types';
import RuleEditor from './RuleEditor';
import ScoreRuleEditor from './ScoreRuleEditor';

interface CategoryTreeProps {
  categories: CategoryDto[];
  questions: QuestionDto[];
  rules: ToDoRule[];
  onRuleCreated: (rule: CreateToDoRule) => Promise<void>;
  onRuleDeleted: (id: number) => Promise<void>;
}

export default function CategoryTree({
  categories,
  questions,
  rules,
  onRuleCreated,
  onRuleDeleted
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(categories.map(c => c.categoryId))
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [creatingRuleFor, setCreatingRuleFor] = useState<{
    question: QuestionDto;
    optionId?: number;
  } | null>(null);
  const [creatingScoreRuleFor, setCreatingScoreRuleFor] = useState<number | null>(null);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getRulesForOption = (questionId: number, optionId: number) => {
    return rules.filter((rule): rule is QuestionAnswerRule => {
      if (rule.triggerType !== 'Question') return false;
      if (rule.questionId !== questionId) return false;
      if (rule.requiredOption !== optionId) return false;
      return true;
    });
  };

  const getScoreRulesForCategory = (categoryId: number) => {
    return rules.filter((rule): rule is CategoryScoreRule => {
      if (rule.triggerType !== 'Category') return false;
      if (rule.categoryId !== categoryId) return false;
      return true;
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
      {/* Left Column: Answer-Based Rules */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Answer-Based Rules</h3>
        {categories.map((category) => {
          const categoryQuestions = questions.filter(q => q.categoryId === category.categoryId);
          const isExpanded = expandedCategories.has(category.categoryId);
          return (
          <div key={category.categoryId} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.categoryId)}
              className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-left font-medium text-gray-900 transition"
            >
              <span>{category.name}</span>
              <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
                {categoryQuestions.length}
              </span>
            </button>

            {isExpanded && (
              <div className="bg-white border-t divide-y">
                {categoryQuestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No questions in this category
                  </div>
                ) : (
                  categoryQuestions.map(question => {
                    const questionIsExpanded = expandedQuestions.has(question.questionId);
                    const hasOptions = question.options && question.options.length > 0;
                    const isRadioQuestion = question.questionType === 'radio';
                    const isNumberQuestion = question.questionType === 'number';
                    const isTextQuestion = question.questionType === 'text';

                    return (
                      <div
                        key={question.questionId}
                        className="border-t first:border-t-0"
                      >
                        <div className="px-4 py-3 text-left hover:bg-gray-50 transition">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {question.fallbackText}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {question.questionId} • Type: {question.questionType}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {(isNumberQuestion || isTextQuestion) && (
                                <button
                                  onClick={() => setCreatingRuleFor({ question })}
                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  Add Rule
                                </button>
                              )}
                              {isRadioQuestion && (
                                <>
                                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    {question.options!.length} options
                                  </span>
                                  <button
                                    onClick={() =>
                                      setExpandedQuestions((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(question.questionId)) {
                                          next.delete(question.questionId);
                                        } else {
                                          next.add(question.questionId);
                                        }
                                        return next;
                                      })
                                    }
                                    className="px-2 py-1 text-xs bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                  >
                                    {questionIsExpanded ? 'Hide option' : 'Show option'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {isRadioQuestion && questionIsExpanded && hasOptions && (
                          <div className="bg-gray-50 px-4 py-3 space-y-3 text-sm">
                            {question.options!.map(option => {
                              const optionRules = getRulesForOption(
                                question.questionId,
                                option.questionOptionId
                              );

                              return (
                                <div
                                  key={option.questionOptionId}
                                  className="p-3 bg-white border rounded space-y-2"
                                >
                                  {/* Option Header */}
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="text-gray-900 font-medium">{option.fallbackText}</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Value: {option.optionValue}
                                      </div>
                                    </div>
                                    <div className="ml-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                      ID: {option.questionOptionId}
                                    </div>
                                  </div>

                                  {/* Rules for this option */}
                                  {optionRules.length > 0 ? (
                                    <div className="space-y-2 mt-2 pt-2 border-t">
                                      {optionRules.map(rule => (
                                        <div
                                          key={rule.toDoRuleId}
                                          className="bg-green-50 border border-green-200 rounded p-2 space-y-1"
                                        >
                                          <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                              <div className="text-xs font-medium text-green-900">
                                                {rule.toDoText}
                                              </div>
                                              <div className="text-xs text-green-700 mt-1">
                                                Priority: {rule.priority}
                                              </div>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                              <button
                                                onClick={() => setCreatingRuleFor({
                                                  question,
                                                  optionId: option.questionOptionId
                                                })}
                                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={() => {
                                                  if (confirm('Delete this rule?')) {
                                                    onRuleDeleted(rule.toDoRuleId);
                                                  }
                                                }}
                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setCreatingRuleFor({
                                        question,
                                        optionId: option.questionOptionId
                                      })}
                                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      + Add rule for this option
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Right Column: Score-Based Rules */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Category Score-Based Rules</h3>
        <p className="text-sm text-gray-600 mb-6">
          Add rules that trigger when a category reaches a specific score.
        </p>

        <div className="space-y-3">
          {categories.map(category => {
            const scoreRules = getScoreRulesForCategory(category.categoryId);

            return (
              <div key={category.categoryId} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-500">ID: {category.categoryId}</p>
                  </div>
                  <button
                    onClick={() => setCreatingScoreRuleFor(category.categoryId)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Score Rule
                  </button>
                </div>

                {scoreRules.length > 0 ? (
                  <div className="space-y-2 pt-3 border-t">
                    {scoreRules.map(rule => (
                      <div
                        key={rule.toDoRuleId}
                        className="bg-purple-50 border border-purple-200 rounded p-2 space-y-1"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-purple-900">
                              {rule.toDoText}
                            </div>
                            <div className="text-xs text-purple-700 mt-1">
                              Score {rule.operator} {rule.scoreThreshold} • Priority: {rule.priority}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => setCreatingScoreRuleFor(category.categoryId)}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this rule?')) {
                                  onRuleDeleted(rule.toDoRuleId);
                                }
                              }}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 pt-2">No score rules for this category yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>

    {/* Rule Editor Modal */}
    {creatingRuleFor && (
      <RuleEditor
        question={creatingRuleFor.question}
        optionId={creatingRuleFor.optionId}
        onClose={() => setCreatingRuleFor(null)}
        onRuleCreated={async (rule) => {
          await onRuleCreated(rule);
          setCreatingRuleFor(null);
        }}
      />
    )}

    {/* Score Rule Editor Modal */}
    {creatingScoreRuleFor && (
      <ScoreRuleEditor
        categoryId={creatingScoreRuleFor}
        category={categories.find(c => c.categoryId === creatingScoreRuleFor)}
        onClose={() => setCreatingScoreRuleFor(null)}
        onRuleCreated={async (rule) => {
          await onRuleCreated(rule);
          setCreatingScoreRuleFor(null);
        }}
      />
    )}
    </>
  );
}
