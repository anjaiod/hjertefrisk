"use client";

import { ReactNode } from "react";
import type { CategoryWithCount } from "@/types";
import CategorizedProgressBar from "./CategorizedProgressBar";

interface QuestionWizardProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onSkip: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  categories?: CategoryWithCount[];
  questionCategories?: number[];
  onCategoryClick?: (categoryIndex: number) => void;
}

export default function QuestionWizard({
  children,
  currentStep,
  totalSteps,
  onSkip,
  onPrevious,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Send inn",
  categories,
  questionCategories,
  onCategoryClick,
}: QuestionWizardProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="w-full">
      {/* Question Content */}
      <div className="bg-white p-[clamp(1.5rem,4vw,3rem)] rounded-lg shadow-md min-h-[70vh] flex flex-col">
        <div className="flex-1">{children}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between pt-6 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirstStep}
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-28 touch-manipulation"
          >
            Forrige
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg bg-brand-navy text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-28 touch-manipulation"
            >
              {isSubmitting ? "Sender..." : submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg border border-brand-navy text-brand-navy rounded-xl hover:bg-brand-mist cursor-pointer min-w-28 touch-manipulation"
            >
              Neste
            </button>
          )}
        </div>
      </div>

      {/* Categorized Progress Bar - Bottom */}
      {categories && questionCategories && (
        <div className="mt-6">
          <CategorizedProgressBar
            categories={categories}
            currentStep={currentStep}
            questionCategories={questionCategories}
            onCategoryClick={onCategoryClick}
          />
        </div>
      )}
    </div>
  );
}
