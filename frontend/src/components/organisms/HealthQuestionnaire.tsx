"use client";

import { ReactElement, useEffect, useState } from "react";
import CollapsibleSection from "../molecules/CollapsibleSection";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import type {
  CreateMeasurementResultDto,
  CreateResponseDto,
  QueryQuestionWithDetailsDto,
  QueryWithQuestionsDto,
} from "@/types";

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

interface HealthQuestionnaireProps {
  patientId: number | null;
}

export default function HealthQuestionnaire({
  patientId,
}: HealthQuestionnaireProps) {
  const { user } = useUser();
  const [questions, setQuestions] = useState<QueryQuestionWithDetailsDto[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiClient.get<QueryWithQuestionsDto>(
          "/api/Query/full/by-name/Helseskjema",
        );
        setQuestions(data.questions ?? []);
      } catch (err) {
        setError("Noe gikk galt ved henting av spørsmål.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchQuestions();
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

  const getUnit = (
    question: QueryQuestionWithDetailsDto,
  ): string | undefined => {
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

  const getRows = (
    question: QueryQuestionWithDetailsDto,
  ): number | undefined => {
    const text = question.fallbackText.toLowerCase();
    if (text.includes("hvor mye røyker")) return 2;
    if (text.includes("vekten din endret")) return 2;
    if (text.includes("begrensninger") || text.includes("barrierer")) return 3;
    return undefined;
  };

  const renderQuestion = (
    question: QueryQuestionWithDetailsDto,
  ): ReactElement => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Helseskjema - Levevaner og Målinger
          </h1>

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
