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
    <div className="max-w-2xl mx-auto">
      {/* Question Content */}
      <div className="bg-white p-8 rounded-lg shadow-md min-h-100 flex flex-col">
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sender..." : submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2 border border-brand-navy text-brand-navy rounded-md hover:bg-brand-mist"
            >
              Hopp over
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
