"use client";

import { useState } from "react";

type Todo = { id: number; text: string; completed: boolean };

export function TodoList({
  title = "Oppgaver",
  todos: initialTodos = [],
}: {
  title?: string;
  todos?: Todo[];
}) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-md rounded-lg border border-brand-mist bg-white p-6 shadow-sm">
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
          <label
            key={todo.id}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-brand-mist/20 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 accent-brand-navy"
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
          </label>
        ))}
      </div>

      {/* Progress Text */}
      <div className="mt-4 text-center text-sm text-slate-600">
        {completedCount} av {totalCount} oppgaver fullført
      </div>
    </div>
  );
}
