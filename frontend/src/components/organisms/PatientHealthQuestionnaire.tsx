"use client";

import { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import type {
  CreateMeasurementResultDto,
  CreateResponseDto,
  PatientDto,
  QueryQuestionWithDetailsDto,
  QueryWithQuestionsDto,
} from "@/types";
import QuestionWizard from "../molecules/QuestionWizard";
import {
  getQuestionUnit,
  getQuestionValidationRange,
  getQuestionRows,
} from "@/lib/questionHelpers";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import QuestionnaireSummary from "../molecules/QuestionnaireSummary";

export default function PatientHealthQuestionnaire() {
  const router = useRouter();
  const { user: localUser, isAuthReady } = useUser();

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
  const [showSummary, setShowSummary] = useState(false);

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
      setIsPatientLoading(true);
      setPatientId(null);

      if (!isAuthReady) {
        return;
      }

      if (!localUser) {
        setPatientId(null);
        setPatientError("Du må være logget inn for å fylle ut skjemaet.");
        setIsPatientLoading(false);
        return;
      }

      if (localUser && localUser.role !== "pasient") {
        setPatientError("Denne siden er kun for pasienter.");
        setIsPatientLoading(false);
        return;
      }

      // Prefer local numeric patient id from UserContext (already resolved via backend).
      if (localUser?.role === "pasient") {
        const parsedLocalId = Number.parseInt(localUser.id, 10);
        if (Number.isFinite(parsedLocalId)) {
          setPatientError(null);
          setPatientId(parsedLocalId);
          setIsPatientLoading(false);
          return;
        }
      }

      try {
        setPatientError(null);
        const patient = await apiClient.get<PatientDto>(
          `/api/Patients/by-supabase/${encodeURIComponent(localUser.supabaseUserId)}`,
        );
        setPatientId(patient.id);
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 404) {
          try {
            const created = await apiClient.post<PatientDto>("/api/Patients", {
              supabaseUserId: localUser.supabaseUserId,
              name: localUser.name,
              email: localUser.email ?? "",
            });

            setPatientError(null);
            setPatientId(created.id);
            return;
          } catch (createErr) {
            setPatientId(null);
            setPatientError("Fant ikke pasientprofil for innlogget bruker.");
            console.error(createErr);
          }
        } else {
          setPatientId(null);
          if (err instanceof ApiClientError) {
            setPatientError(
              `Kunne ikke hente pasientprofil (${err.status}). Sjekk at backend kjører og at endpointet er oppdatert.`,
            );
          } else {
            setPatientError("Kunne ikke hente pasientprofil.");
          }
          console.error(err);
        }
      } finally {
        setIsPatientLoading(false);
      }
    };

    void resolvePatient();
  }, [isAuthReady, localUser]);

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

    if (!localUser) {
      setSubmitError("Du må være logget inn for å sende inn skjemaet.");
      return;
    }

    if (patientId == null) {
      setSubmitError("Fant ikke pasientprofil for innlogget bruker.");
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

    const measurementPayload: CreateMeasurementResultDto[] = [];
    for (const question of visibleQuestions) {
      if (question.measurementId == null) continue;
      if (question.questionType !== "number") continue;
      const rawValue = (answers[question.questionId] ?? "").trim();
      if (!rawValue) continue;
      const parsedValue = Number(rawValue.replace(",", "."));
      if (!Number.isFinite(parsedValue)) continue;
      measurementPayload.push({
        measurementId: question.measurementId,
        patientId,
        result: parsedValue,
      });
    }

    const weightEntry = measurementPayload.find((m) => m.measurementId === 1);
    const heightEntry = measurementPayload.find((m) => m.measurementId === 2);
    if (weightEntry && heightEntry && heightEntry.result > 0) {
      const heightM = heightEntry.result / 100;
      const bmi = weightEntry.result / (heightM * heightM);
      measurementPayload.push({
        measurementId: 10,
        patientId,
        result: Math.round(bmi * 10) / 10,
      });
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
      router.push("/pasientDashboard");
    } catch (err) {
      setSubmitError("Kunne ikke lagre svarene.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finn ut om et spørsmål skal vises basert på dependencies
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

    return parentDeps.some((dep) => {
      const parentAnswer = answers[dep.parentQuestionId];
      if (!parentAnswer) return false;

      if (dep.triggerOptionValue) {
        return parentAnswer === dep.triggerOptionValue;
      }

      if (dep.triggerOptionId != null) {
        const parentQuestion = questions.find(
          (q) => q.questionId === dep.parentQuestionId,
        );
        const triggerOption = parentQuestion?.options.find(
          (o) => o.questionOptionId === dep.triggerOptionId,
        );
        return triggerOption
          ? parentAnswer === triggerOption.optionValue
          : false;
      }

      if (dep.operator === "=") return parentAnswer === dep.triggerTextValue;

      return false;
    });
  };

  const visibleQuestions = questions
    .filter((q) => q.requiredRole !== "clinician")
    .filter(shouldShowQuestion);

  // Grupper blodtrykk-spørsmål (systolisk + diastolisk) i ett wizard-steg
  const isBpQuestion = (q: QueryQuestionWithDetailsDto): boolean => {
    const text = q.fallbackText.toLowerCase();
    return (
      text.includes("systolisk") ||
      text.includes("diastolisk") ||
      text.includes("blodtrykk")
    );
  };

  const bpVisibleQuestions = visibleQuestions.filter(isBpQuestion);
  const bpQuestionIds = new Set(bpVisibleQuestions.map((q) => q.questionId));

  // Erstatt alle BP-spørsmål med én grupperepresentant i wizard-steg-listen
  const wizardSteps: QueryQuestionWithDetailsDto[] = [];
  let bpGroupAdded = false;
  for (const q of visibleQuestions) {
    if (bpQuestionIds.has(q.questionId)) {
      if (!bpGroupAdded) {
        wizardSteps.push(q);
        bpGroupAdded = true;
      }
    } else {
      wizardSteps.push(q);
    }
  }

  // Bygg kategorier dynamisk fra wizard-stegene
  const categoryMap = new Map<number, string>();
  wizardSteps.forEach((q) => {
    if (q.categoryId != null && q.categoryName) {
      const displayName = q.categoryName.toLowerCase().trim() === "blodlipider"
        ? "Sykdomshistorikk"
        : q.categoryName;
      categoryMap.set(q.categoryId, displayName);
    }
  });

  const uniqueCategories = Array.from(categoryMap.entries()).map(
    ([categoryId, name]) => ({
      categoryId,
      name,
    }),
  );

  const questionCategories = wizardSteps.map((q) =>
    uniqueCategories.findIndex((c) => c.categoryId === q.categoryId),
  );

  const categoryCounts = uniqueCategories.map(
    (_, i) => questionCategories.filter((c) => c === i).length,
  );

  const categories = uniqueCategories.map((cat, i) => ({
    category: {
      categoryId: cat.categoryId,
      name: cat.name,
    },
    count: categoryCounts[i],
  }));

  const buildQuestionElement = (
    question: QueryQuestionWithDetailsDto,
  ): ReactElement => {
    const value = answers[question.questionId] ?? "";
    const name = `question-${question.questionId}`;
    const text = question.fallbackText.toLowerCase();

    const isHyperkolesterolemi = text.includes("hyperkolesterolemi");
    const questionDescription = isHyperkolesterolemi
      ? "Familiær hyperkolesterolemi er en arvelig sykdom hvor en genfeil som gir høyt kolesterol, overføres fra generasjon til generasjon."
      : undefined;

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
          smallLabel={isHyperkolesterolemi}
          description={questionDescription}
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
          smallLabel={isHyperkolesterolemi}
          description={questionDescription}
        />
      );
    }

    if (question.questionType === "number") {
      const { min, max } = getQuestionValidationRange(question);
      return (
        <QuestionNumber
          key={question.questionId}
          question={question.fallbackText}
          name={name}
          value={value}
          onChange={(val) => updateAnswer(question.questionId, val)}
          onAnswer={handleNext}
          unit={getQuestionUnit(question)}
          required={question.isRequired}
          min={min}
          max={max}
        />
      );
    }

    return (
      <QuestionTextArea
        key={question.questionId}
        question={question.fallbackText}
        name={name}
        value={value}
        onChange={(val) => updateAnswer(question.questionId, val)}
        onAnswer={handleNext}
        rows={getQuestionRows(question)}
        required={question.isRequired}
      />
    );
  };

  // Blodtrykk-gruppeelementet: header + begge felter side om side
  const buildBpGroupElement = (): ReactElement => (
    <div key="bp-group">
      <p className="text-2xl font-medium text-gray-800 mb-10">
        Har du instrumenter til å måle blodtrykket ditt? I så fall, fyll inn
        her:
      </p>
      <div className="flex gap-6 flex-wrap">
        {bpVisibleQuestions.map((bpQ) => {
          const isSystolic = bpQ.fallbackText.toLowerCase().includes("systolisk");
          const label = isSystolic ? "Systolisk blodtrykk:" : "Diastolisk blodtrykk:";
          return (
            <div key={bpQ.questionId} className="flex-1 min-w-40">
              <QuestionNumber
                question={label}
                name={`question-${bpQ.questionId}`}
                value={answers[bpQ.questionId] ?? ""}
                onChange={(val) => updateAnswer(bpQ.questionId, val)}
                unit="mmHg"
                required={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const questionElements = wizardSteps.map((q) => {
    if (bpQuestionIds.has(q.questionId) && bpVisibleQuestions.length > 0) {
      return buildBpGroupElement();
    }
    return buildQuestionElement(q);
  });

  useEffect(() => {
    if (currentStep >= wizardSteps.length && wizardSteps.length > 0) {
      setCurrentStep(wizardSteps.length - 1);
    }
  }, [wizardSteps.length, currentStep]);

  const isLoading = isQuestionsLoading || isPatientLoading;
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
    <div className="flex min-h-screen">
      <main className="flex-1 bg-slate-50 p-[clamp(1rem,3vw,2rem)]">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="font-bold text-gray-900 mb-8 text-center text-[clamp(1.75rem,4vw,3rem)]">
            Helseskjema
          </h1>
          {submitError && !showSummary && (
            <p className="text-red-500 mb-4 text-center">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-green-700 mb-4 text-center">{submitSuccess}</p>
          )}
          {showSummary ? (
            <QuestionnaireSummary
              questions={visibleQuestions}
              answers={answers}
              onBack={() => setShowSummary(false)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onGoToQuestion={(questionId) => {
                const stepIndex = wizardSteps.findIndex(
                  (q) => q.questionId === questionId ||
                    (bpQuestionIds.has(questionId) && bpQuestionIds.has(q.questionId)),
                );
                if (stepIndex !== -1) setCurrentStep(stepIndex);
                setShowSummary(false);
              }}
            />
          ) : (
            <QuestionWizard
              currentStep={currentStep}
              totalSteps={questionElements.length}
              onSkip={handleSkip}
              onPrevious={handlePrevious}
              onSubmit={() => setShowSummary(true)}
              submitLabel="Se oppsummering"
              categories={categories}
              questionCategories={questionCategories}
              onCategoryClick={(categoryIndex) => {
                const firstStep = questionCategories.findIndex(
                  (c) => c === categoryIndex,
                );
                if (firstStep !== -1) setCurrentStep(firstStep);
              }}
            >
              {questionElements[currentStep]}
            </QuestionWizard>
          )}
        </div>
      </main>
    </div>
  );
}
