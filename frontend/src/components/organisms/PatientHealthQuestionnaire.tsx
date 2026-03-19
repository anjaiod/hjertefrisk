"use client";

import { useState, useEffect, ReactElement, useMemo } from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import type {
  CreateResponseDto,
  PatientDto,
  QueryQuestionWithDetailsDto,
  QueryWithQuestionsDto,
} from "@/types";
import QuestionWizard from "../molecules/QuestionWizard";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";

const CATEGORY_NAMES = [
  "Røyking",
  "Fysisk aktivitet",
  "Kosthold",
  "Vekt",
  "Søvn",
  "Alkohol",
  "Rusmidler",
];

// Hvilke questionId-er tilhører hvilken kategori (basert på displayOrder)
function getCategoryIndex(displayOrder: number): number {
  if (displayOrder <= 3) return 0; // Røyking
  if (displayOrder <= 9) return 1; // Fysisk aktivitet
  if (displayOrder <= 15) return 2; // Kosthold
  if (displayOrder <= 18) return 3; // Vekt
  if (displayOrder <= 27) return 4; // Søvn
  if (displayOrder <= 37) return 5; // Alkohol
  return 6; // Rusmidler
}

export default function PatientHealthQuestionnaire() {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<QueryQuestionWithDetailsDto[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState<number | null>(null);
  const [isPatientLoading, setIsPatientLoading] = useState(true);
  const [patientError, setPatientError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsError(null);
        const data = await apiClient.get<QueryWithQuestionsDto>(
          "/api/Query/full/by-name/Helseskjema",
        );
        const patientQuestions = (data.questions ?? []).filter(
          (question) =>
            question.requiredRole == null ||
            question.requiredRole.toLowerCase() === "patient",
        );
        setQuestions(patientQuestions);
      } catch (err) {
        setQuestionsError("Noe gikk galt ved henting av spørsmål.");
        console.error(err);
      } finally {
        setIsQuestionsLoading(false);
      }
    };

    void fetchQuestions();
  }, []);

  useEffect(() => {
    const resolvePatient = async () => {
      if (isAuthLoading) {
        return;
      }

      if (authError) {
        setPatientError(authError);
        setIsPatientLoading(false);
        return;
      }

      if (!user) {
        setPatientId(null);
        setPatientError("Du må være logget inn for å fylle ut skjemaet.");
        setIsPatientLoading(false);
        return;
      }

      try {
        setPatientError(null);
        const patient = await apiClient.get<PatientDto>(
          `/api/Patients/by-supabase-user/${encodeURIComponent(user.id)}`,
        );
        setPatientId(patient.id);
      } catch (err) {
        setPatientId(null);
        if (err instanceof ApiClientError && err.status === 404) {
          setPatientError("Fant ikke pasientprofil for innlogget bruker.");
        } else if (err instanceof ApiClientError) {
          setPatientError(
            `Kunne ikke hente pasientprofil (${err.status}). Sjekk at backend kjører og at endpointet er oppdatert.`,
          );
        } else {
          setPatientError("Kunne ikke hente pasientprofil.");
        }
        console.error(err);
      } finally {
        setIsPatientLoading(false);
      }
    };

    void resolvePatient();
  }, [authError, isAuthLoading, user]);

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleSkip = () => setCurrentStep((prev) => prev + 1);
  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!user) {
      setSubmitError("Du må være logget inn for å sende inn skjemaet.");
      return;
    }

    if (patientId == null) {
      setSubmitError("Fant ikke pasientprofil for innlogget bruker.");
      return;
    }

    const payload: CreateResponseDto[] = [];

    for (const question of visibleQuestions) {
      const rawValue = (answers[question.questionId] ?? "").trim();
      if (!rawValue) {
        continue;
      }

      const matchedOption = question.options.find(
        (option) => option.optionValue === rawValue,
      );

      const basePayload: CreateResponseDto = {
        patientId,
        questionId: question.questionId,
        selectedOptionId: matchedOption?.questionOptionId ?? null,
      };

      if (question.questionType === "number") {
        const parsedValue = Number(rawValue.replace(",", "."));

        if (Number.isFinite(parsedValue)) {
          payload.push({
            ...basePayload,
            numberValue: parsedValue,
          });
          continue;
        }
      }

      payload.push({
        ...basePayload,
        textValue: rawValue,
      });
    }

    if (payload.length === 0) {
      setSubmitError("Fyll inn minst ett svar før innsending.");
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.all(
        payload.map((item) => apiClient.post("/api/Responses", item)),
      );
      setSubmitSuccess("Skjema sendt inn!");
    } catch (err) {
      setSubmitError("Kunne ikke lagre svarene.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finn ut om et spørsmål skal vises basert på dependencies
  const shouldShowQuestion = (question: QueryQuestionWithDetailsDto): boolean => {
    const isChild = questions.some((q) =>
      q.dependencies.some((d) => d.childQuestionId === question.questionId),
    );
    if (!isChild) return true;

    // Finn alle parent-dependencies for dette spørsmålet
    const parentDeps = questions.flatMap((q) =>
      q.dependencies.filter((d) => d.childQuestionId === question.questionId),
    );

    return parentDeps.some((dep) => {
      const parentAnswer = answers[dep.parentQuestionId];
      if (!parentAnswer) return false;
      if (dep.operator === "=") return parentAnswer === dep.triggerTextValue;
      if (dep.operator === "OR")
        return (
          parentAnswer === dep.triggerTextValue ||
          parentAnswer.startsWith("nei")
        );
      return false;
    });
  };

  // Bygg den synlige spørsmålslisten dynamisk basert på svar
  const visibleQuestions = useMemo(
    () => questions.filter(shouldShowQuestion),
    [answers, questions],
  );

  const buildQuestionElement = (question: QueryQuestionWithDetailsDto): ReactElement => {
    const value = answers[question.questionId] ?? "";
    const name = `question-${question.questionId}`;

    // Determine placeholder based on question text or type
    const getPlaceholder = (): string | undefined => {
      const text = question.fallbackText.toLowerCase();

      // Number fields
      if (text.includes("hvor høy")) return "170";
      if (text.includes("hvor mye veier")) return "70";
      if (text.includes("livvidde")) return "80";

      // Text fields
      if (text.includes("hvor mye røyker"))
        return "F.eks. 10 sigaretter per dag";
      if (text.includes("vekten din endret"))
        return "F.eks. økt 5 kg siste 6 måneder";
      if (text.includes("begrensninger") && text.includes("skriv"))
        return "Beskriv dine fysiske begrensninger...";
      if (text.includes("barrierer") && text.includes("skriv"))
        return "Beskriv barrierer...";

      return undefined;
    };

    const getUnit = (): string | undefined => {
      const text = question.fallbackText.toLowerCase();
      if (text.includes("hvor høy")) return "cm";
      if (text.includes("hvor mye veier")) return "kg";
      if (text.includes("livvidde")) return "cm";
      return undefined;
    };

    const getRows = (): number | undefined => {
      const text = question.fallbackText.toLowerCase();
      if (text.includes("hvor mye røyker")) return 2;
      if (text.includes("vekten din endret")) return 2;
      if (text.includes("begrensninger") || text.includes("barrierer"))
        return 3;
      return undefined;
    };

    const placeholder = getPlaceholder();
    const unit = getUnit();
    const rows = getRows();

    if (question.questionType === "boolean") {
      return (
        <ConditionalQuestion
          key={question.questionId}
          question={question.fallbackText}
          name={name}
          value={value as "ja" | "nei" | ""}
          onChange={(val) => updateAnswer(question.questionId, val)}
          onAnswer={handleNext}
          required={question.isRequired}
        />
      );
    }

    if (question.questionType === "radio") {
      return (
        <QuestionRadio
          key={question.questionId}
          question={question.fallbackText}
          name={name}
          options={question.options.map((o) => ({
            value: o.optionValue,
            label: o.fallbackText,
          }))}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          onAnswer={handleNext}
          required={question.isRequired}
        />
      );
    }

    if (question.questionType === "number") {
      return (
        <QuestionNumber
          key={question.questionId}
          question={question.fallbackText}
          name={name}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          onAnswer={handleNext}
          placeholder={placeholder}
          unit={unit}
          required={question.isRequired}
        />
      );
    }

    // text / textarea
    return (
      <QuestionTextArea
        key={question.questionId}
        question={question.fallbackText}
        name={name}
        value={value}
        onChange={(val) => updateAnswer(question.questionId, val)}
        onAnswer={handleNext}
        placeholder={placeholder}
        rows={rows}
        required={question.isRequired}
      />
    );
  };

  const questionElements = useMemo(
    () => visibleQuestions.map(buildQuestionElement),
    [answers, visibleQuestions],
  );

  const questionCategories = useMemo(
    () => visibleQuestions.map((q) => getCategoryIndex(q.displayOrder)),
    [visibleQuestions],
  );

  const categoryCounts = CATEGORY_NAMES.map(
    (_, i) => questionCategories.filter((c) => c === i).length,
  );
  const categories = CATEGORY_NAMES.map((name, i) => ({
    name,
    count: categoryCounts[i],
  }));

  useEffect(() => {
    if (currentStep >= visibleQuestions.length && visibleQuestions.length > 0) {
      setCurrentStep(visibleQuestions.length - 1);
    }
  }, [visibleQuestions.length, currentStep]);

  const isLoading = isQuestionsLoading || isAuthLoading || isPatientLoading;
  const mainError = questionsError ?? patientError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Laster spørsmål...</p>
      </div>
    );
  }

  if (mainError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{mainError}</p>
      </div>
    );
  }

  if (questionElements.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Fant ingen spørsmål i skjemaet.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Helseskjema
          </h1>
          {submitError && (
            <p className="text-red-500 mb-4 text-center">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-green-700 mb-4 text-center">{submitSuccess}</p>
          )}
          <QuestionWizard
            currentStep={currentStep}
            totalSteps={questionElements.length}
            onSkip={handleSkip}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            categories={categories}
            questionCategories={questionCategories}
          >
            {questionElements[currentStep]}
          </QuestionWizard>
        </div>
      </main>
    </div>
  );
}
