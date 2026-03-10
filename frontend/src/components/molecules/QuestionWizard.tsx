"use client";

import { ReactNode } from "react";

interface QuestionWizardProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function QuestionWizard({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
}: QuestionWizardProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Spørsmål {currentStep + 1} av {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-navy h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white p-8 rounded-lg shadow-md min-h-[400px] flex flex-col">
        <div className="flex-1">{children}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between pt-6 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirstStep}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Forrige
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90"
            >
              Send inn
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90"
            >
              Neste
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
