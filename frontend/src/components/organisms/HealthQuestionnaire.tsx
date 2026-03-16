"use client";

import { ReactElement, useEffect, useState } from "react";
import { SidebarNav } from "./SidebarNav";
import CollapsibleSection from "../molecules/CollapsibleSection";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";

interface QuestionOption {
  questionOptionId: number;
  fallbackText: string;
  optionValue: string;
  displayOrder: number;
}

interface QuestionDependency {
  parentQuestionId: number;
  childQuestionId: number;
  triggerTextValue: string | null;
  operator: string;
}

interface Question {
  questionId: number;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole: string | null;
  displayOrder: number;
  options: QuestionOption[];
  dependencies: QuestionDependency[];
}

const CATEGORY_NAMES = [
  "Røyking",
  "Fysisk aktivitet",
  "Kosthold",
  "Overvekt",
  "Søvn",
  "Alkoholbruk",
  "Rusmiddelbruk",
];

function getCategoryIndex(displayOrder: number): number {
  if (displayOrder <= 3) return 0;
  if (displayOrder <= 9) return 1;
  if (displayOrder <= 15) return 2;
  if (displayOrder <= 18) return 3;
  if (displayOrder <= 27) return 4;
  if (displayOrder <= 37) return 5;
  return 6;
}

function toPatientPerspective(text: string): string {
  return text
    .replace(/\b[Dd]u\b/g, (match) =>
      match === "Du" ? "Pasienten" : "pasienten",
    )
    .replace(/\b[Dd]eg\b/g, (match) =>
      match === "Deg" ? "Pasienten" : "pasienten",
    )
    .replace(/\b[Dd]in\b/g, (match) =>
      match === "Din" ? "Pasientens" : "pasientens",
    )
    .replace(/\b[Dd]itt\b/g, (match) =>
      match === "Ditt" ? "Pasientens" : "pasientens",
    )
    .replace(/\b[Dd]ine\b/g, (match) =>
      match === "Dine" ? "Pasientens" : "pasientens",
    );
}

export default function HealthQuestionnaire() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/query/by-name/Helseskjema`,
        );
        if (!response.ok) throw new Error("Kunne ikke hente spørsmål");
        const data = await response.json();
        setQuestions(data.questions ?? []);
      } catch (err) {
        setError("Noe gikk galt ved henting av spørsmål.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const shouldShowQuestion = (question: Question): boolean => {
    const isChild = questions.some((q) =>
      q.dependencies.some((d) => d.childQuestionId === question.questionId),
    );

    if (!isChild) return true;

    const parentDeps = questions.flatMap((q) =>
      q.dependencies.filter((d) => d.childQuestionId === question.questionId),
    );

    return parentDeps.some((dependency) => {
      const parentAnswer = answers[dependency.parentQuestionId];
      if (!parentAnswer) return false;
      if (dependency.operator === "=") {
        return parentAnswer === dependency.triggerTextValue;
      }
      if (dependency.operator === "OR") {
        return (
          parentAnswer === dependency.triggerTextValue ||
          parentAnswer.startsWith("nei")
        );
      }
      return false;
    });
  };

  const visibleQuestions = questions.filter(shouldShowQuestion);

  const getPlaceholder = (question: Question): string | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor høy")) return "170";
    if (text.includes("hvor mye veier")) return "70";
    if (text.includes("livvidde")) return "80";
    if (text.includes("hvor mye røyker")) return "F.eks. 10 sigaretter per dag";
    if (text.includes("vekten din endret")) {
      return "F.eks. økt 5 kg siste 6 måneder";
    }
    if (text.includes("begrensninger") && text.includes("skriv")) {
      return "Beskriv dine fysiske begrensninger...";
    }
    if (text.includes("barrierer") && text.includes("skriv")) {
      return "Beskriv barrierer...";
    }
    return undefined;
  };

  const getUnit = (question: Question): string | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor høy")) return "cm";
    if (text.includes("hvor mye veier")) return "kg";
    if (text.includes("livvidde")) return "cm";
    return undefined;
  };

  const getRows = (question: Question): number | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor mye røyker")) return 2;
    if (text.includes("vekten din endret")) return 2;
    if (text.includes("begrensninger") || text.includes("barrierer")) return 3;
    return undefined;
  };

  const renderQuestion = (question: Question): ReactElement => {
    const value = answers[question.questionId] ?? "";
    const name = `question-${question.questionId}`;
    const questionText = toPatientPerspective(question.fallbackText);

    if (question.questionType === "boolean") {
      return (
        <ConditionalQuestion
          key={question.questionId}
          question={questionText}
          name={name}
          value={value as "ja" | "nei" | ""}
          onChange={(val) => updateAnswer(question.questionId, val)}
          required={question.isRequired}
        />
      );
    }

    if (question.questionType === "radio") {
      return (
        <QuestionRadio
          key={question.questionId}
          question={questionText}
          name={name}
          options={question.options.map((option) => ({
            value: option.optionValue,
            label: option.fallbackText,
          }))}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          required={question.isRequired}
        />
      );
    }

    if (question.questionType === "number") {
      return (
        <QuestionNumber
          key={question.questionId}
          question={questionText}
          name={name}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          placeholder={getPlaceholder(question)}
          unit={getUnit(question)}
          required={question.isRequired}
        />
      );
    }

    return (
      <QuestionTextArea
        key={question.questionId}
        question={questionText}
        name={name}
        value={value}
        onChange={(val) => updateAnswer(question.questionId, val)}
        placeholder={getPlaceholder(question)}
        rows={getRows(question)}
        required={question.isRequired}
      />
    );
  };

  const groupedQuestions = CATEGORY_NAMES.map((categoryName, index) => ({
    categoryName,
    questions: visibleQuestions.filter(
      (question) => getCategoryIndex(question.displayOrder) === index,
    ),
  })).filter((category) => category.questions.length > 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form data:", answers);
  };

  return (
    <div className="flex">
      <SidebarNav activePath="/behandler_skjema" />
      <main className="flex-1 bg-slate-50">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 space-y-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Helseskjema - Levevaner og Målinger
          </h1>

          {loading && <p className="text-gray-500">Laster spørsmål...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && groupedQuestions.length === 0 && (
            <p className="text-gray-500">Fant ingen spørsmål i skjemaet.</p>
          )}

          {!loading &&
            !error &&
            groupedQuestions.map((group, index) => (
              <CollapsibleSection
                key={group.categoryName}
                title={group.categoryName}
                defaultOpen={index === 0}
              >
                <div className="px-6 py-4">
                  {group.questions.map(renderQuestion)}
                </div>
              </CollapsibleSection>
            ))}

          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90"
            >
              Send inn
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
