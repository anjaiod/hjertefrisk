"use client";

import { useState } from "react";

export const useTTS = (onEnd?: () => void) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "no-NO";
    utterance.rate = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onEnd?.();
  };

  return { speak, stop, isSpeaking };
};