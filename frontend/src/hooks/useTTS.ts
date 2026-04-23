import { QueryQuestionWithDetailsDto } from "@/types";
import { useState, useRef } from "react";

export const useTTS = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const runId = useRef(0);

  const stop = () => {
    window.speechSynthesis.cancel();
    runId.current++;
    setActiveId(null);
    setHighlightedIndex(null);
  };

  const speakPart = (text: string) =>
    new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "no-NO";
      u.rate = 0.95;

      u.onend = () => setTimeout(resolve, 400);

      window.speechSynthesis.speak(u);
    });

  const speakQuestion = async (question: QueryQuestionWithDetailsDto) => {
    if (activeId === question.questionId) {
      stop();
      return;
    }

    const id = ++runId.current;
    setActiveId(question.questionId);

    let text = question.fallbackText;

    if (question.questionType === "number") {
      text += ". Skriv inn et tall.";
    }

    await speakPart(text);
    if (id !== runId.current) return;

    if (question.questionType === "boolean") {
      const opts = ["Ja", "Nei"];

      for (let i = 0; i < opts.length; i++) {
        if (id !== runId.current) return;
        setHighlightedIndex(i);
        await speakPart(opts[i]);
      }
    }

    if (question.options?.length) {
      for (let i = 0; i < question.options.length; i++) {
        if (id !== runId.current) return;
        setHighlightedIndex(i);
        await speakPart(question.options[i].fallbackText);
      }
    }

    if (id !== runId.current) return;

    setActiveId(null);
    setHighlightedIndex(null);
  };

  const speakSequence = async (parts: string[]) => {
    stop();

    const id = ++runId.current;

    for (let i = 0; i < parts.length; i++) {
      if (id !== runId.current) return;

      setHighlightedIndex(i);
      await speakPart(parts[i]);
    }

    if (id !== runId.current) return;

    setHighlightedIndex(null);
  };

  return {
    speakQuestion,
    speakSequence,
    stop,
    activeId,
    highlightedIndex,
  };
};
