'use client';

import React, { useState, useEffect } from 'react';
import CategoryTree from '@/components/organisms/ToDoRules/CategoryTree';
import type { CategoryDto, QuestionDto, ToDoRule, CreateToDoRule } from '@/types';

export default function ToDoRulesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [rules, setRules] = useState<ToDoRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();

      try {
        setLoading(true);
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const [categoriesRes, questionsRes, rulesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Categories`, {
            headers
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Questions`, {
            headers
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ToDoRule`, {
            headers
          })
        ]);

        if (!categoriesRes.ok || !questionsRes.ok || !rulesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [categoriesData, questionsData, rulesData] = await Promise.all([
          categoriesRes.json(),
          questionsRes.json(),
          rulesRes.json()
        ]);

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
          questionsData.map(async (question: QuestionDto) => {
            try {
              const optionsRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/QuestionOptions/question/${question.questionId}`,
                { headers }
              );
              if (optionsRes.ok) {
                const options = await optionsRes.json();
                return { ...question, options };
              }
            } catch (err) {
              console.error(`Failed to fetch options for question ${question.questionId}:`, err);
            }
            return question;
          })
        );

        setCategories(categoriesData);
        setQuestions(questionsWithOptions);
        setRules(rulesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRuleCreated = async (newRule: CreateToDoRule) => {
    const token = getToken();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ToDoRule`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newRule)
      });

      if (!response.ok) {
        throw new Error('Failed to create rule');
      }

      const createdRule = await response.json();
      setRules([...rules, createdRule]);
      alert('Rule created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
    }
  };

  const handleRuleUpdated = async (id: number, updatedRule: CreateToDoRule) => {
    const token = getToken();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ToDoRule/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedRule)
      });

      if (!response.ok) {
        throw new Error('Failed to update rule');
      }

      const updatedRuleData = await response.json();
      setRules(rules.map(r => (r.toDoRuleId === updatedRuleData.toDoRuleId) ? updatedRuleData : r));
      alert('Rule updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
    }
  };

  const handleRuleDeleted = async (id: number) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    const token = getToken();

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ToDoRule/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      setRules(rules.filter(r => r.toDoRuleId !== id));
      alert('Rule deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">TODO Rule Management</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <CategoryTree
            categories={categories}
            questions={questions}
            rules={rules}
            onRuleCreated={handleRuleCreated}
            onRuleDeleted={handleRuleDeleted}
          />
        </div>
      )}
    </div>
  );
}
