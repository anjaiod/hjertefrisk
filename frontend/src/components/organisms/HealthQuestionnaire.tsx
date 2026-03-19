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
  triggerOptionValue?: string | null;
  triggerTextValue: string | null;
  operator: string;
  triggerOptionId?: number | null;
}

interface Question {
  questionId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  fallbackText: string;
  questionType: string;
  isRequired: boolean;
  requiredRole: string | null;
  displayOrder: number;
  options: QuestionOption[];
  dependencies: QuestionDependency[];
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

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const endpoint = `${apiBaseUrl}/api/query/by-name/Helseskjema`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(
            `Kunne ikke hente spørsmål (HTTP ${response.status} ${response.statusText}) fra ${endpoint}`,
          );
        }
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
  }, [apiBaseUrl]);

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

      // Preferred path: match directly against trigger option value from API.
      if (dependency.triggerOptionValue) {
        return parentAnswer === dependency.triggerOptionValue;
      }

      // Fallback path: map triggerOptionId to optionValue on parent question.
      if (dependency.triggerOptionId != null) {
        const parentQuestion = questions.find(
          (q) => q.questionId === dependency.parentQuestionId,
        );
        const triggerOption = parentQuestion?.options.find(
          (o) => o.questionOptionId === dependency.triggerOptionId,
        );
        return triggerOption
          ? parentAnswer === triggerOption.optionValue
          : false;
      }

      // Text/boolean fallback.
      if (dependency.operator === "=") {
        return parentAnswer === dependency.triggerTextValue;
      }

      if (dependency.operator === "OR") {
        return (
          parentAnswer === dependency.triggerTextValue ||
          parentAnswer.startsWith("ja")
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
    if (text.includes("fyll inn")) return "Skriv tall";
    return undefined;
  };

  const getUnit = (question: Question): string | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor høy")) return "cm";
    if (text.includes("hvor mye veier")) return "kg";
    if (text.includes("livvidde")) return "cm";
    if (text.includes("blodtrykk")) return "mmHg";
    if (text.includes("hba1c")) return "mmol/mol";
    if (text.includes("fastende")) return "mmol/L";
    if (text.includes("kolesterol")) return "mmol/L";
    if (text.includes("triglyserider")) return "mmol/L";

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

  const groupedQuestions = Array.from(
    visibleQuestions
      .reduce((groups, question) => {
        const categoryName = question.categoryName?.trim() || "Uten kategori";
        const categoryKey =
          question.categoryId != null
            ? `category-${question.categoryId}`
            : `category-name-${categoryName.toLowerCase()}`;

        const existingGroup = groups.get(categoryKey);
        if (existingGroup) {
          existingGroup.questions.push(question);
          return groups;
        }

        groups.set(categoryKey, {
          categoryKey,
          categoryName,
          questions: [question],
        });
        return groups;
      }, new Map<string, { categoryKey: string; categoryName: string; questions: Question[] }>())
      .values(),
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form data:", answers);
  };

  return (
    <div className="flex">
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
                key={group.categoryKey}
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
