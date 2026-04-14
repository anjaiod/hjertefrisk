"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import { Tag } from "../../../components/atoms/Tag";
import type { TagVariant } from "../../../components/atoms/Tag";
import { apiClient } from "../../../lib/apiClient";
import type { CategoryDto } from "../../../types";
import { useUser } from "@/context/UserContext";

type PatientMeasureResult = {
  patientMeasureId: number;
  source: number;
  categoryId: number | null;
  triggerQuestionId: number | null;
  categoryScore: number;
  text: string;
  title: string | null;
  resourceUrl: string | null;
  generatedAt: string;
  scoreThreshold: number;
  isExclusive: boolean;
  priority: number;
};

type QueryDto = {
  id: number;
  name: string;
};

type RiskThreshold = {
  high: number;
  medium: number | null;
};

const CATEGORY_RISK_THRESHOLDS: Record<string, RiskThreshold> = {
  "fysisk aktivitet": { high: 9, medium: 5 },
  "kosthold":         { high: 9, medium: 5 },
  "rusmidler":        { high: 3, medium: 1 },
  "alkohol":          { high: 15, medium: 8 },
  "røyking":          { high: 2, medium: 1 },
  "tannhelse":        { high: 1, medium: null },
  "kroppsdata":       { high: 2, medium: 1 },
  "blodtrykk":        { high: 2, medium: 1 },
  "blodlipider":      { high: 2, medium: 1 },
  "glukoseregulering": { high: 2, medium: 1 },
};

function tagVariantFromCategoryScore(
  categoryName: string,
  score: number,
): TagVariant | null {
  const key = categoryName.toLowerCase().trim();
  const thresholds = CATEGORY_RISK_THRESHOLDS[key];
  if (!thresholds) return null;
  if (score >= thresholds.high) return "high";
  if (thresholds.medium !== null && score >= thresholds.medium) return "medium";
  return "low";
}

function sleepTagVariant(measures: PatientMeasureResult[]): TagVariant | null {
  if (measures.length === 0) return null;
  const titles = measures.map((m) => m.title ?? "");
  if (titles.some((t) => t === "Betydelige søvnvansker")) return "high";
  if (titles.some((t) => t === "Noen søvnproblemer")) return "medium";
  if (titles.some((t) => t === "God søvn")) return "low";
  return null;
}

function tagTextFromVariant(variant: TagVariant): string {
  if (variant === "high") return "Høy";
  if (variant === "medium") return "Middels";
  return "Lav";
}

export default function PasientTiltakside() {
  const { user, isAuthReady } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const selectedCategoryId = searchParams.get("kategori")
    ? Number(searchParams.get("kategori"))
    : (categories[0]?.categoryId ?? null);

  function setSelectedCategoryId(id: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) params.delete("kategori");
    else params.set("kategori", String(id));
    router.replace(`?${params.toString()}`);
  }
  const [measuresByCategory, setMeasuresByCategory] = useState<
    Record<number, PatientMeasureResult[]>
  >({});
  const [categoryScores, setCategoryScores] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthReady || !user) return;

    async function loadData() {
      try {
        const [cats, queryDto] = await Promise.all([
          apiClient.get<CategoryDto[]>("/api/Categories"),
          apiClient.get<QueryDto>("/api/Query/by-name/Helseskjema"),
        ]);

        setCategories(cats);

        const isNumericId = /^\d+$/.test(user!.id);
        const patientId = isNumericId
          ? Number(user!.id)
          : (
              await apiClient.get<{ id: number }>(
                `/api/Patients/by-supabase/${user!.id}`,
              )
            ).id;

        const result = await apiClient.post<{
          patientMeasures: PatientMeasureResult[];
          categoryScores: Record<number, number>;
        }>("/api/measures/evaluate", {
          patientId,
          queryId: queryDto.id,
          languageCode: "no",
        });

        const grouped: Record<number, PatientMeasureResult[]> = {};
        for (const m of result.patientMeasures) {
          if (m.categoryId != null) {
            grouped[m.categoryId] ??= [];
            grouped[m.categoryId].push(m);
          }
        }
        setMeasuresByCategory(grouped);
        setCategoryScores(result.categoryScores ?? {});
      } catch {
        // still render categories even if measures fail
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthReady, user]);

  const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

  const sortedCategories = [...categories].sort((a, b) => {
    const isSleepA = a.name.toLowerCase().trim() === "søvn";
    const isSleepB = b.name.toLowerCase().trim() === "søvn";
    const scoreA = categoryScores[a.categoryId];
    const scoreB = categoryScores[b.categoryId];
    const measuresA = measuresByCategory[a.categoryId] ?? [];
    const measuresB = measuresByCategory[b.categoryId] ?? [];
    const answeredA = isSleepA ? measuresA.length > 0 : scoreA !== undefined;
    const answeredB = isSleepB ? measuresB.length > 0 : scoreB !== undefined;
    const variantA = !answeredA
      ? null
      : isSleepA
        ? sleepTagVariant(measuresA)
        : tagVariantFromCategoryScore(a.name, scoreA ?? 0);
    const variantB = !answeredB
      ? null
      : isSleepB
        ? sleepTagVariant(measuresB)
        : tagVariantFromCategoryScore(b.name, scoreB ?? 0);
    const orderA = variantA != null ? (riskOrder[variantA] ?? 3) : 4;
    const orderB = variantB != null ? (riskOrder[variantB] ?? 3) : 4;
    return orderA - orderB;
  });

  const selectedCategory = categories.find(
    (c) => c.categoryId === selectedCategoryId,
  );
  const selectedMeasures = selectedCategoryId
    ? [...(measuresByCategory[selectedCategoryId] ?? [])].sort(
        (a, b) => a.priority - b.priority,
      )
    : [];

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientTiltakside" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="flex-1 bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Left panel: category list */}
            <div className="w-80 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-brand-navy mb-4">
                Din risikoprofil:
              </h2>
              <div className="flex flex-col gap-2">
                {loading ? (
                  <p className="text-slate-400 text-sm">Laster...</p>
                ) : (
                  sortedCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.categoryId;
                    const score = categoryScores[cat.categoryId];
                    const isSleep = cat.name.toLowerCase().trim() === "søvn";
                    const variant = isSleep
                      ? sleepTagVariant(measuresByCategory[cat.categoryId] ?? [])
                      : score !== undefined
                        ? tagVariantFromCategoryScore(cat.name, score)
                        : null;

                    return (
                      <button
                        key={cat.categoryId}
                        onClick={() => setSelectedCategoryId(cat.categoryId)}
                        className={[
                          "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all",
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

            {/* Right panel: selected category detail */}
            {selectedCategory && (
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <h2 className="text-brand-navy font-bold text-2xl mb-1">
                    {selectedCategory.name}
                  </h2>
                </div>

                {selectedMeasures.length === 0 ? (
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
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                      />
                    </svg>
                    <p className="text-slate-600 font-medium">
                      Ingen tiltak registrert for{" "}
                      {selectedCategory.name.toLowerCase()}
                    </p>
                    <p className="text-slate-400 text-sm max-w-sm">
                      Besvar kategorien{" "}
                      <span className="font-semibold text-slate-500">
                        {selectedCategory.name}
                      </span>{" "}
                      i Hjertefrisk-skjemaet for å få tiltak basert på svarene
                      dine.
                    </p>
                  </div>
                ) : (
                  selectedMeasures.map((measure) => (
                    <div
                      key={measure.patientMeasureId}
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
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
