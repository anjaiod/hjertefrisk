"use client";

import { IconButton } from "../atoms/IconButton";
import { PiSpeakerHigh, PiSpeakerSlash } from "react-icons/pi";

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
    <div className="relative">
      <div className="absolute top-0 right-0">
        <IconButton
          ariaLabel={isActive ? "Stopp opplesning" : "Les opp spørsmål"}
          onClick={onToggle}
        >
          <span className="bg-teal-200 hover:bg-teal-300 p-3 rounded-full flex items-center justify-center">
            {isActive ? (
              <PiSpeakerSlash size={20} />
            ) : (
              <PiSpeakerHigh size={20} />
            )}
          </span>
        </IconButton>
      </div>

      {children}
    </div>
  );
}
