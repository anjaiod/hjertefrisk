"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "../atoms/Checkbox";
import { apiClient } from "@/lib/apiClient";

type Todo = { id: number; text: string; completed: boolean; public: boolean };

export function TodoList({
  title,
  todos: initialTodos = [],
  patientId,
  maxHeight = "max-h-64",
}: {
  title?: string;
  todos?: Todo[];
  patientId?: number;
  maxHeight?: string;
}) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoPublic, setNewTodoPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Update local state immediately for responsiveness
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

    // Update database
    setUpdatingId(id);
    try {
      await apiClient.put(`/api/todos/${id}`, {
        toDoText: todo.text,
        patientId: patientId, // Use the actual patient ID from props
        finished: !todo.completed,
        public: todo.public,
      });
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

  const createTodo = async () => {
    if (!newTodoText.trim()) return;
    if (!patientId) {
      alert("Pasienten må være valgt for å opprette en oppgave");
      return;
    }

    setIsCreating(true);
    try {
      const created = await apiClient.post<{
        toDoId: number;
        toDoText: string;
        finished: boolean;
        public: boolean;
      }>("/api/todos", {
        toDoText: newTodoText.trim(),
        patientId: patientId,
        finished: false,
        public: newTodoPublic,
      });

      setTodos([
        ...todos,
        {
          id: created.toDoId,
          text: created.toDoText,
          completed: created.finished,
          public: created.public,
        },
      ]);
      setNewTodoText("");
      setNewTodoPublic(true);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm("Er du sikker på at du vil slette denne oppgaven?")) {
      return;
    }

    setDeletingId(id);
    try {
      await apiClient.delete(`/api/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-md  bg-white rounded-xl border border-brand-mist/30 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={!patientId}
          className="px-3 py-1 text-sm font-medium text-white bg-brand-sage hover:bg-brand-sage/90 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          title={!patientId ? "Velg pasient for å opprette oppgave" : ""}
        >
          + Ny
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-3 bg-brand-mist/20 rounded-lg">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createTodo();
              if (e.key === "Escape") setShowCreateForm(false);
            }}
            placeholder="Skriv ny oppgave..."
            className="w-full px-3 py-2 border border-brand-mist rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage mb-3"
            autoFocus
            disabled={isCreating}
          />

          <div className="mb-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newTodoPublic}
                onChange={(e) => setNewTodoPublic(e.target.checked)}
                disabled={isCreating}
                className="w-4 h-4 accent-brand-sage"
              />
              {newTodoPublic ? "🔓 Offentlig" : "🔒 Privat"}
            </label>
            <span className="text-xs text-slate-500">
              {newTodoPublic ? "(alle kan se)" : "(bare du)"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={createTodo}
              disabled={isCreating || !newTodoText.trim()}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-brand-sage hover:bg-brand-sage/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Legger til..." : "Legg til"}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              disabled={isCreating}
              className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

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
      <div className={`${maxHeight} overflow-y-auto space-y-2 pr-2`}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 rounded-lg p-2 hover:bg-brand-mist/20 group ${
              updatingId === todo.id || deletingId === todo.id
                ? "opacity-60"
                : ""
            }`}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={todo.text}
              className="h-5 w-5 accent-brand-navy"
              disabled={updatingId === todo.id || deletingId === todo.id}
            />
            <span
              className={`flex-1 text-base ${
                todo.completed
                  ? "line-through text-slate-400"
                  : "text-slate-700"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              disabled={updatingId === todo.id || deletingId === todo.id}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-500 hover:text-red-700 transition-all disabled:opacity-50"
              title="Slett oppgave"
            >
              ✕
            </button>
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
