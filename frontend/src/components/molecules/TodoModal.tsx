"use client";

import { useEffect, useState } from "react";
import { Modal } from "../atoms/Modal";
import { TodoList } from "./TodoList";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ToDoDto {
  toDoId: number;
  finished: boolean;
  toDoText: string;
  patientId: number;
}

interface TodoModalProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export function TodoModal({ patientId, patientName, onClose }: TodoModalProps) {
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then((r) => r.json())
      .then((data: ToDoDto[]) => {
        const filtered = data
          .filter((t) => t.patientId === Number(patientId))
          .map((t) => ({ id: t.toDoId, text: t.toDoText, completed: t.finished }));
        setTodos(filtered);
      })
      .catch(() => setTodos([]));
  }, [patientId]);

  return (
    <Modal onClose={onClose} title="Todo">
      <p className="text-slate-600 text-lg text-center -mt-1 mb-4">{patientName}</p>
      {todos.length === 0 ? (
        <p className="text-slate-500 text-sm">Ingen todos for denne pasienten.</p>
      ) : (
        <TodoList todos={todos} />
      )}
    </Modal>
  );
}
