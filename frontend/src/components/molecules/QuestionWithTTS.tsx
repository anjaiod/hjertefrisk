"use client";

import { TTSButton } from "../atoms/TTSButton";

type Props = {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function QuestionWithTTS({
  isActive,
  onToggle,
  children,
}: Props) {
  return (
    <div className="relative pr-14 md:pr-16">
      <div className="absolute top-0 right-0">
        <TTSButton isActive={isActive} onClick={onToggle} />
      </div>
      {children}
    </div>
  );
}
