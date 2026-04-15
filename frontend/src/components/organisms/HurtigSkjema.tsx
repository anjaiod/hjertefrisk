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
import type {
  CreateMeasurementResultDto,
  CreateResponseDto,
  QueryQuestionWithDetailsDto,
  QueryWithQuestionsDto,
  ResponseDto,
} from "@/types";

const HWB_MEASUREMENT_IDS = new Set([1, 2, 10]);

function groupIntoRows(
  questions: QueryQuestionWithDetailsDto[],
): QueryQuestionWithDetailsDto[][] {
  const hwbIds = new Set(
    questions
      .filter(
        (q) =>
          q.measurementId != null && HWB_MEASUREMENT_IDS.has(q.measurementId),
      )
      .map((q) => q.questionId),
  );
  const bpIds = new Set(
    questions
      .filter((q) => {
        const text = q.fallbackText.toLowerCase();
        return text.includes("systolisk") || text.includes("diastolisk");
      })
      .map((q) => q.questionId),
  );

  const rows: QueryQuestionWithDetailsDto[][] = [];
  let hwbRow: QueryQuestionWithDetailsDto[] | null = null;
  let bpRow: QueryQuestionWithDetailsDto[] | null = null;

  for (const q of questions) {
    if (hwbIds.has(q.questionId)) {
      if (!hwbRow) {
        hwbRow = [];
        rows.push(hwbRow);
      }
      hwbRow.push(q);
    } else if (bpIds.has(q.questionId)) {
      if (!bpRow) {
        bpRow = [];
        rows.push(bpRow);
      }
      bpRow.push(q);
    } else {
      rows.push([q]);
    }
  }

  return rows;
}

interface HurtigSkjemaProps {
  patientId: number | null;
}

export default function HurtigSkjema({ patientId }: HurtigSkjemaProps) {
  const { user } = useUser();
  const router = useRouter();
  const [questions, setQuestions] = useState<QueryQuestionWithDetailsDto[]>([]);
  const [queryId, setQueryId] = useState<number | null>(null);
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
          "/api/Query/full/by-name/HurtigHjertefrisk",
        );
        setQueryId(data.id);
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

  const heightQuestion = questions.find((q) => q.measurementId === 2);
  const weightQuestion = questions.find((q) => q.measurementId === 1);
  const bmiQuestion = questions.find((q) => q.measurementId === 10);

  const heightRaw = heightQuestion
    ? (answers[heightQuestion.questionId] ?? "")
    : "";
  const weightRaw = weightQuestion
    ? (answers[weightQuestion.questionId] ?? "")
    : "";

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  useEffect(() => {
    if (!heightQuestion || !weightQuestion || !bmiQuestion) return;
    if (!heightRaw || !weightRaw) return;

    const height = Number(heightRaw.replace(",", "."));
    const weight = Number(weightRaw.replace(",", "."));

    if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0)
      return;

    const heightM = height / 100;
    const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;

    setAnswers((prev) => ({ ...prev, [bmiQuestion.questionId]: String(bmi) }));
  }, [heightRaw, weightRaw, bmiQuestion, heightQuestion, weightQuestion]);

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
    const questionText = question.fallbackText;

    if (bmiQuestion && question.questionId === bmiQuestion.questionId) {
      return (
        <div key={question.questionId} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {questionText}
            {question.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name={name}
              value={value}
              readOnly
              className="w-32 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
            <span className="text-sm text-gray-600">kg/m²</span>
            <span className="text-xs text-gray-400 italic">
              Beregnes automatisk
            </span>
          </div>
        </div>
      );
    }

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

    try {
      setIsSubmitting(true);
      const savedResponses = await apiClient.post<ResponseDto[]>("/api/Responses/bulk", payload);
      if (measurementPayload.length > 0) {
        await apiClient.post(
          "/api/MeasurementResults/bulk",
          measurementPayload,
        );
      }

      const answeredQueryId = savedResponses[0]?.answeredQueryId ?? null;

      if (queryId != null && answeredQueryId != null) {
        router.push(
          `/dashboard/hurtigskjema/tiltak?patientId=${patientId}&queryId=${queryId}&answeredQueryId=${answeredQueryId}`,
        );
      } else {
        setAnswers({});
        setFormKey((k) => k + 1);
        setSubmitSuccess("Skjema sendt inn!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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
          key={formKey}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 space-y-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Hurtigskjema - Hjertefrisk
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
                  {groupIntoRows(group.questions).map((row, rowIndex) =>
                    row.length > 1 ? (
                      <div key={rowIndex} className="flex gap-6 flex-wrap">
                        {row.map((q) => (
                          <div key={q.questionId} className="flex-1 min-w-40">
                            {renderQuestion(q)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      renderQuestion(row[0])
                    ),
                  )}
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
