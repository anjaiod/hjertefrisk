"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "../atoms/Checkbox";

type Todo = { id: number; text: string; completed: boolean };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function TodoList({
  title,
  todos: initialTodos = [],
}: {
  title?: string;
  todos?: Todo[];
}) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Update local state immediately for responsiveness
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );

    // Update database
    setUpdatingId(id);
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toDoText: todo.text,
          patientId: todo.id, // This will be overridden by the backend
          finished: !todo.completed,
          public: true,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update todo");
        // Revert on error
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, completed: todo.completed } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      // Revert on error
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: todo.completed } : t,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-md  bg-white rounded-xl border border-brand-mist/30 shadow-sm p-8">
      <h2 className="mb-6 text-lg font-semibold text-brand-navy">{title}</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-mist">
            <div
              className="h-full rounded-full bg-brand-sage transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="min-w-12 text-right text-sm font-bold text-brand-sage">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 rounded-lg p-2 hover:bg-brand-mist/20 ${
              updatingId === todo.id ? "opacity-60" : ""
            }`}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              disabled={updatingId === todo.id}
            />
            <span
              className={`text-base ${
                todo.completed
                  ? "line-through text-slate-400"
                  : "text-slate-700"
              }`}
            >
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Text */}
      <div className="mt-4 text-center text-sm text-slate-600">
        {completedCount} av {totalCount} oppgaver fullført
      </div>
    </div>
  );
}
