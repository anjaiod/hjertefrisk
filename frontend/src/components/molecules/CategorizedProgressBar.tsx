"use client";

import type { CategoryWithCount } from "@/types";

interface CategorizedProgressBarProps {
  categories: CategoryWithCount[];
  currentStep: number;
  questionCategories: number[];
  onCategoryClick?: (categoryIndex: number) => void;
}

export default function CategorizedProgressBar({
  categories,
  currentStep,
  questionCategories,
  onCategoryClick,
}: CategorizedProgressBarProps) {
  const totalSteps = questionCategories.length;
  // Ensure currentStep doesn't exceed bounds
  const safeCurrentStep = Math.min(currentStep, totalSteps - 1);
  const currentCategoryIndex = questionCategories[safeCurrentStep];
  const currentCategory = categories[currentCategoryIndex];

  // Calculate how many questions completed in each category
  const completedPerCategory = categories.map((_, categoryIndex) => {
    return questionCategories.filter(
      (qCat, qIndex) => qCat === categoryIndex && qIndex <= safeCurrentStep,
    ).length;
  });

  return (
    <div className="w-full">
      {/* Category Segments */}
      <div className="flex gap-1 mb-3">
        {categories.map((categoryWithCount, index) => {
          const totalInCategory = categoryWithCount.count;
          const completedInCategory = completedPerCategory[index];
          const progressPercent =
            totalInCategory > 0
              ? (completedInCategory / totalInCategory) * 100
              : 0;
          const isActive = index === currentCategoryIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onCategoryClick?.(index)}
              className="flex-1 relative text-left"
              style={{
                flexBasis: `${(categoryWithCount.count / totalSteps) * 100}%`,
              }}
            >
              {/* Background */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                {/* Progress */}
                <div
                  className="bg-brand-mint h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {/* Category Label */}
              <div
                className={`text-xs md:text-sm mt-1 text-center hover:underline cursor-pointer leading-tight ${
                  isActive
                    ? "font-semibold text-gray-800"
                    : "font-normal text-gray-600"
                }`}
              >
                {categoryWithCount.category.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Progress Text */}
      <div className="flex items-center justify-between text-sm md:text-base">
        <span className="font-medium text-gray-700">
          {currentCategory ? (
            <>
              Spørsmål {Math.min(currentStep + 1, totalSteps)} av {totalSteps}
            </>
          ) : (
            <>
              Spørsmål {Math.min(currentStep + 1, totalSteps)} av {totalSteps}
            </>
          )}
        </span>
        <span className="text-gray-500">
          {Math.round(
            (Math.min(currentStep + 1, totalSteps) / totalSteps) * 100,
          )}
          %
        </span>
      </div>
    </div>
  );
}
