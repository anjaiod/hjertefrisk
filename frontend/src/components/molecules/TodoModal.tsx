"use client";

import { useEffect, useState } from "react";
import { TodoList } from "./TodoList";
import { apiClient } from "@/lib/apiClient";
import { Modal } from "../atoms/Modal";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  public: boolean;
  createdAt?: string;
  personnelId?: number;
  toDoRuleId?: number;
};

interface TodoModalProps {
  patientId: string;
  onClose: () => void;
}

export function TodoModal({ patientId, onClose }: TodoModalProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const allTodos = await apiClient.get<
          Array<{
            toDoId: number;
            toDoText: string;
            finished: boolean;
            public: boolean;
            patientId: number;
            createdAt: string;
            personnelId?: number | null;
            toDoRuleId?: number;
          }>
        >("/api/todos");

        const filtered = allTodos
          .filter((t) => t.patientId === Number(patientId))
          .map((t) => ({
            id: t.toDoId,
            text: t.toDoText,
            completed: t.finished,
            public: t.public,
            createdAt: t.createdAt,
            personnelId: t.personnelId ?? undefined,
            toDoRuleId: t.toDoRuleId,
          }));
        setTodos(filtered);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      }
    };

    fetchTodos();
  }, [patientId]);

  return (
    <Modal onClose={onClose} title="Todoer">
      <TodoList todos={todos} patientId={Number(patientId)} maxHeight="max-h-[60vh]" noContainer showControls={false} />
    </Modal>
  );
}
