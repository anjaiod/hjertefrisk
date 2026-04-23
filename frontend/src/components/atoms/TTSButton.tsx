"use client";

import { IconButton } from "./IconButton";

type Props = {
  isActive: boolean;
  onClick: () => void;
};

export const TTSButton = ({ isActive, onClick }: Props) => {
  return (
    <IconButton
      ariaLabel={isActive ? "Stopp opplesning" : "Les opp spørsmål"}
      onClick={onClick}
    >
      <span className="bg-teal-200 hover:bg-teal-300 p-3 rounded-full flex items-center justify-center">
        {isActive ? (
          // MUTED ICON
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
            <line
              x1="23"
              y1="1"
              x2="1"
              y2="23"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ) : (
          // SPEAKER ICON
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
            <path
              d="M15 9C16.5 10.5 16.5 13.5 15 15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M17.5 7C20 9.5 20 14.5 17.5 17"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
      </span>
    </IconButton>
  );
};
