"use client";

import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CollapsibleSection from "../molecules/CollapsibleSection";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import {
  getQuestionUnit,
  getQuestionValidationRange,
  getQuestionRows,
} from "@/lib/questionHelpers";
import type {
  CreateMeasurementResultDto,
  CreateResponseDto,
  QueryQuestionWithDetailsDto,
  QueryWithQuestionsDto,
  SeverityDto,
} from "@/types";

interface HealthQuestionnaireProps {
  patientId: number | null;
  compact?: boolean;
}

export default function HealthQuestionnaire({
  patientId,
  compact = false,
}: HealthQuestionnaireProps) {
  const router = useRouter();
  const { user } = useUser();
  const [questions, setQuestions] = useState<QueryQuestionWithDetailsDto[]>([]);
  const [severities, setSeverities] = useState<SeverityDto[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsData, severitiesData] = await Promise.all([
          apiClient.get<QueryWithQuestionsDto>(
            "/api/Query/full/by-name/Helseskjema",
          ),
          apiClient.get<SeverityDto[]>("/api/Severities"),
        ]);
        setQuestions(questionsData.questions ?? []);
        setSeverities(severitiesData ?? []);
      } catch (err) {
        setError("Noe gikk galt ved henting av spørsmål.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const shouldShowQuestion = (
    question: QueryQuestionWithDetailsDto,
  ): boolean => {
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

      if (dependency.triggerOptionValue) {
        return parentAnswer === dependency.triggerOptionValue;
      }

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

  const getPlaceholder = (
    question: QueryQuestionWithDetailsDto,
  ): string | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor høy")) return "170";
    if (text.includes("hvor mye veier")) return "70";
    if (text.includes("livvidde")) return "80";
    if (text.includes("fyll inn")) return "Skriv tall";
    return undefined;
  };

  const renderQuestion = (
    question: QueryQuestionWithDetailsDto,
  ): ReactElement => {
    const value = answers[question.questionId] ?? "";
    const name = `question-${question.questionId}`;
    const questionText = question.fallbackText;

    if (question.questionType === "boolean") {
      return (
        <ConditionalQuestion
          key={question.questionId}
          question={questionText}
          name={name}
          value={value as "ja" | "nei" | ""}
          onChange={(val) => updateAnswer(question.questionId, val)}
          required={question.isRequired}
          compact={compact}
        />
      );
    }

    if (question.questionType === "radio") {
      return (
        <QuestionRadio
          key={question.questionId}
          question={questionText}
          name={name}
          options={question.options.map((option) => {
            const severity = severities.find(
              (s) =>
                s.questionId === question.questionId &&
                s.requiredOption === option.questionOptionId,
            );
            return {
              value: option.optionValue,
              label: option.fallbackText,
              score: severity?.score,
            };
          })}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          required={question.isRequired}
          compact={compact}
        />
      );
    }

    if (question.questionType === "number") {
      const { min, max } = getQuestionValidationRange(question);
      return (
        <QuestionNumber
          key={question.questionId}
          question={questionText}
          name={name}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          placeholder={getPlaceholder(question)}
          unit={getQuestionUnit(question)}
          required={question.isRequired}
          compact={compact}
          min={min}
          max={max}
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
        rows={getQuestionRows(question)}
        required={question.isRequired}
        compact={compact}
      />
    );
  };

  const groupedQuestions = Array.from(
    visibleQuestions
      .reduce(
        (groups, question) => {
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
        },
        new Map<
          string,
          {
            categoryKey: string;
            categoryName: string;
            questions: QueryQuestionWithDetailsDto[];
          }
        >(),
      )
      .values(),
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (patientId == null) {
      setSubmitError("Ingen pasient er valgt. Gå tilbake og velg en pasient.");
      return;
    }

    const invalidFields = visibleQuestions.filter((q) => {
      if (q.questionType !== "number") return false;
      const raw = (answers[q.questionId] ?? "").trim();
      if (!raw) return false;
      const val = Number(raw.replace(",", "."));
      const { min, max } = getQuestionValidationRange(q);
      return !Number.isFinite(val) || val < min || val > max;
    });
    if (invalidFields.length > 0) {
      setSubmitError("Noen tall-svar er ugyldige. Sjekk de markerte feltene.");
      return;
    }

    const payload: CreateResponseDto[] = [];

    for (const question of visibleQuestions) {
      const rawValue = (answers[question.questionId] ?? "").trim();
      if (!rawValue) continue;

      const matchedOption = question.options.find(
        (option) => option.optionValue === rawValue,
      );

      const base: CreateResponseDto = {
        patientId,
        questionId: question.questionId,
        selectedOptionId: matchedOption?.questionOptionId ?? null,
      };

      if (question.questionType === "number") {
        const parsedValue = Number(rawValue.replace(",", "."));
        if (Number.isFinite(parsedValue)) {
          payload.push({ ...base, numberValue: parsedValue });
          continue;
        }
      }

      payload.push({ ...base, textValue: rawValue });
    }

    if (payload.length === 0) {
      setSubmitError("Fyll inn minst ett svar før innsending.");
      return;
    }

    const personnelId = user ? parseInt(user.id, 10) : null;

    const measurementPayload: CreateMeasurementResultDto[] = [];
    for (const question of visibleQuestions) {
      if (question.measurementId == null) continue;
      if (question.questionType !== "number") continue;
      const rawValue = (answers[question.questionId] ?? "").trim();
      if (!rawValue) continue;
      const parsedValue = Number(rawValue.replace(",", "."));
      if (!Number.isFinite(parsedValue)) continue;
      if (personnelId == null || !Number.isFinite(personnelId)) continue;
      measurementPayload.push({
        measurementId: question.measurementId,
        patientId,
        result: parsedValue,
        registeredBy: personnelId,
      });
    }

    if (personnelId != null && Number.isFinite(personnelId)) {
      const heightEntry = measurementPayload.find((m) => m.measurementId === 2);
      const weightEntry = measurementPayload.find((m) => m.measurementId === 1);
      if (heightEntry && weightEntry && heightEntry.result > 0) {
        const heightM = heightEntry.result / 100;
        const bmi = weightEntry.result / (heightM * heightM);
        measurementPayload.push({
          measurementId: 10,
          patientId,
          result: Math.round(bmi * 10) / 10,
          registeredBy: personnelId,
        });
      }
    }

    try {
      setIsSubmitting(true);
      await apiClient.post(`/api/patients/${patientId}/responses`, payload);
      if (measurementPayload.length > 0) {
        await apiClient.post(
          `/api/patients/${patientId}/measurements`,
          measurementPayload,
        );
      }
      setAnswers({});
      setFormKey((k) => k + 1);
      setSubmitSuccess("Skjema sendt inn!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError("Kunne ikke lagre svarene.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 bg-slate-50">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 space-y-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Helseskjema - Levevaner og Målinger
            </h1>
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                showAll
                  ? "bg-brand-navy text-white border-brand-navy hover:opacity-90"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showAll ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
              {showAll ? "Skjul alle seksjoner" : "Vis alle seksjoner"}
            </button>
          </div>

          {patientId == null && (
            <p className="text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
              Ingen pasient er valgt. Gå tilbake og velg en pasient.
            </p>
          )}

          {loading && <p className="text-gray-500">Laster spørsmål...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {submitError && <p className="text-red-500">{submitError}</p>}
          {submitSuccess && <p className="text-green-700">{submitSuccess}</p>}

          {!loading && !error && groupedQuestions.length === 0 && (
            <p className="text-gray-500">Fant ingen spørsmål i skjemaet.</p>
          )}

          {!loading &&
            !error &&
            groupedQuestions.map((group, index) => (
              <CollapsibleSection
                key={`${formKey}-${group.categoryKey}`}
                title={group.categoryName}
                defaultOpen={index === 0}
                forceOpen={showAll ? true : undefined}
              >
                <div className="px-6 py-4">
                  {group.questions.map(renderQuestion)}
                </div>
              </CollapsibleSection>
            ))}

          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting || patientId == null}
              className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Sender inn..." : "Send inn"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
