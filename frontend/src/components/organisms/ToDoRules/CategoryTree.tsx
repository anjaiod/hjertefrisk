'use client';

import React, { useState } from 'react';
import type { CategoryDto, QuestionDto } from '@/types';

interface CategoryTreeProps {
  categories: CategoryDto[];
  questions: QuestionDto[];
}

export default function CategoryTree({ categories, questions }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(categories.map(c => c.categoryId))
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleQuestion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="space-y-2">
      {categories.map(category => {
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

                    return (
                      <div
                        key={question.questionId}
                        className="border-t first:border-t-0"
                      >
                        <button
                          onClick={() => toggleQuestion(question.questionId)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition"
                        >
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {question.fallbackText}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {question.questionId}
                            </div>
                          </div>
                          {hasOptions && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {question.options!.length} options
                            </span>
                          )}
                        </button>

                        {questionIsExpanded && hasOptions && (
                          <div className="bg-gray-50 px-4 py-2 space-y-2 text-sm">
                            {question.options!.map(option => (
                              <div
                                key={option.questionOptionId}
                                className="p-2 bg-white border rounded flex justify-between items-start"
                              >
                                <div className="flex-1">
                                  <div className="text-gray-900">{option.fallbackText}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Value: {option.optionValue}
                                  </div>
                                </div>
                                <div className="ml-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                  ID: {option.questionOptionId}
                                </div>
                              </div>
                            ))}
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
  );
}
