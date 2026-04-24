"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import { Tag, type TagVariant } from "@/components/atoms/Tag";
import type { CategoryDto, QueryDto } from "@/types";
import BackButton from "@/components/atoms/BackButton";
import {
  tagVariantFromCategoryScore,
  sleepTagVariant,
  tagTextFromVariant,
} from "@/lib/riskUtils";

type PersonnelMeasureResult = {
  personnelMeasureId: number;
  categoryId: number | null;
  categoryScore: number;
  title: string | null;
  text: string;
  resourceUrl: string | null;
  priority: number;
};

type MeasureEvaluationResponse = {
  personnelMeasures: PersonnelMeasureResult[];
  categoryScores?: Record<number, number>;
};

type EvaluatePayload = {
  patientId: number;
  queryId: number;
  languageCode: string;
  personnelId?: number;
};

export default function TiltakPage() {
  const searchParams = useSearchParams();
  const { user, isAuthReady } = useUser();

  const patientIdParam = searchParams?.get("patientId");
  const parsedPatientId = patientIdParam
    ? Number.parseInt(patientIdParam, 10)
    : Number.NaN;
  const patientId = Number.isFinite(parsedPatientId) ? parsedPatientId : null;

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [measuresByCategory, setMeasuresByCategory] = useState<
    Record<number, PersonnelMeasureResult[]>
  >({});
  const [categoryScores, setCategoryScores] = useState<Record<number, number>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const hasPatientId =
    typeof patientId === "number" && Number.isFinite(patientId);

  useEffect(() => {
    if (!hasPatientId) return;
    if (!user || !isAuthReady) return;
    const userId = user.id;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [fetchedCategories, query] = await Promise.all([
          apiClient.get<CategoryDto[]>("/api/Categories"),
          apiClient.get<QueryDto>("/api/Query/by-name/Helseskjema"),
        ]);

        if (cancelled) return;

        setCategories(fetchedCategories);

        const resolvedPersonnelId = Number.parseInt(userId, 10);
        const payload: EvaluatePayload = {
          patientId: patientId!,
          queryId: query.id,
          languageCode: "no",
        };

        if (Number.isFinite(resolvedPersonnelId)) {
          payload.personnelId = resolvedPersonnelId;
        }

        const evaluation = await apiClient.post<MeasureEvaluationResponse>(
          "/api/measures/evaluate",
          payload,
        );

        if (cancelled) return;

        const grouped: Record<number, PersonnelMeasureResult[]> = {};
        for (const measure of evaluation.personnelMeasures) {
          if (!measure.categoryId) continue;
          grouped[measure.categoryId] ??= [];
          grouped[measure.categoryId].push(measure);
        }

        for (const list of Object.values(grouped)) {
          list.sort((a, b) => a.priority - b.priority);
        }

        setMeasuresByCategory(grouped);
        setCategoryScores(evaluation.categoryScores ?? {});

        setSelectedCategoryId((current) => {
          if (current && grouped[current]?.length) return current;
          return (
            fetchedCategories.find((cat) => grouped[cat.categoryId]?.length)
              ?.categoryId ??
            fetchedCategories[0]?.categoryId ??
            null
          );
        });
      } catch {
        if (!cancelled) {
          setError("Kunne ikke hente tiltak.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [hasPatientId, isAuthReady, patientId, reloadKey, user]);

  useEffect(() => {
    if (!hasPatientId) return;
    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ patientId?: string | number }>;
      const detail = customEvent.detail;
      if (!detail?.patientId) return;
      if (String(detail.patientId) !== String(patientId)) return;
      setReloadKey((key) => key + 1);
    };

    window.addEventListener("measurements:updated", handler as EventListener);
    return () => {
      window.removeEventListener(
        "measurements:updated",
        handler as EventListener,
      );
    };
  }, [hasPatientId, patientId]);

  const riskOrder: Record<TagVariant, number> = {
    high: 0,
    medium: 1,
    low: 2,
    none: 3,
  };

  const categoryVariant = useCallback(
    (cat: CategoryDto): TagVariant | null => {
      const normalized = cat.name.toLowerCase().trim();
      const isSleepCategory = normalized === "søvn";
      const score = categoryScores[cat.categoryId];
      const measures = measuresByCategory[cat.categoryId] ?? [];
      const answered = isSleepCategory
        ? measures.length > 0
        : score !== undefined;
      if (!answered) return null;
      if (isSleepCategory) {
        return sleepTagVariant(measures);
      }
      return tagVariantFromCategoryScore(cat.name, score ?? 0);
    },
    [categoryScores, measuresByCategory],
  );

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const variantA = categoryVariant(a);
      const variantB = categoryVariant(b);
      const orderA = variantA ? (riskOrder[variantA] ?? 3) : 4;
      const orderB = variantB ? (riskOrder[variantB] ?? 3) : 4;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [categories, categoryVariant]);

  const selectedCategory = useMemo(
    () =>
      categories.find((cat) => cat.categoryId === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const selectedMeasures = useMemo(
    () =>
      selectedCategoryId != null
        ? (measuresByCategory[selectedCategoryId] ?? [])
        : [],
    [measuresByCategory, selectedCategoryId],
  );

  if (!hasPatientId) {
    return (
      <div className="max-w-3xl mx-auto rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-amber-900">
        <p className="text-lg font-semibold">Ingen pasient er valgt.</p>
        <p className="text-sm text-amber-800 mt-1">
          Velg en pasient fra pasientlisten for å se anbefalte tiltak.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <header>
        <BackButton className="mb-2" />
        <h1 className="text-3xl font-bold text-brand-navy mb-1">
          Tiltak for valgt pasient
        </h1>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-80 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-navy mb-4">
            Risikoprofiler
          </h2>
          <div className="flex flex-col gap-2">
            {loading && categories.length === 0 ? (
              <p className="text-slate-400 text-sm">Laster...</p>
            ) : (
              sortedCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.categoryId;
                const variant = categoryVariant(cat);

                return (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategoryId(cat.categoryId)}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all cursor-pointer",
                      isSelected
                        ? "bg-brand-sky/10 border border-brand-sky/40"
                        : "border border-transparent hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="text-slate-800 font-medium">
                      {cat.name}
                    </span>
                    {variant && (
                      <Tag variant={variant} className="text-sm">
                        {tagTextFromVariant(variant)}
                      </Tag>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {loading && categories.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-slate-500">
              Laster tiltak...
            </div>
          ) : !selectedCategory ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-slate-500">
              Velg en kategori til venstre for å se tilhorende tiltak.
            </div>
          ) : selectedMeasures.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-3 text-center">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
              <p className="text-slate-600 font-medium">
                Ingen tiltak registrert for{" "}
                {selectedCategory.name.toLowerCase()}.
              </p>
              <p className="text-slate-400 text-sm max-w-sm">
                Fyll ut kategorien{" "}
                <span className="font-semibold text-slate-500">
                  {selectedCategory.name}
                </span>{" "}
                i Hjertefrisk-skjemaet for å få tiltak basert på svarene.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-brand-navy font-bold text-2xl mb-1">
                  {selectedCategory.name}
                </h2>
              </div>
              {selectedMeasures.map((measure) => (
                <div
                  key={measure.personnelMeasureId}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3"
                >
                  {measure.title && (
                    <h3 className="font-bold text-brand-navy">
                      {measure.title}
                    </h3>
                  )}
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {measure.text}
                  </p>
                  {measure.resourceUrl && (
                    <a
                      href={measure.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-brand-sky underline hover:text-brand-navy"
                    >
                      Les mer her
                    </a>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
