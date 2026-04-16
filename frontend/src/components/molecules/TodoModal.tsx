"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TodoList } from "./TodoList";
import { apiClient } from "@/lib/apiClient";

type Todo = { id: number; text: string; completed: boolean; public: boolean };

interface TodoModalProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export function TodoModal({ patientId, patientName, onClose }: TodoModalProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const allTodos = await apiClient.get<
          Array<{ toDoId: number; toDoText: string; finished: boolean; public: boolean; patientId: number }>
        >("/api/todos");
        
        const filtered = allTodos
          .filter((t) => t.patientId === Number(patientId))
          .map((t) => ({
            id: t.toDoId,
            text: t.toDoText,
            completed: t.finished,
            public: t.public,
          }));
        
        setTodos(filtered);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [patientId]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return createPortal(
    <>
      {/* Blurred Background */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-slate-300 text-3xl leading-none"
          >
            ✕
          </button>

          {/* TodoList */}
          <TodoList
            todos={todos}
            patientId={Number(patientId)}
            maxHeight="max-h-screen"
          />
        </div>
      </div>
    </>,
    document.body
  );
}
