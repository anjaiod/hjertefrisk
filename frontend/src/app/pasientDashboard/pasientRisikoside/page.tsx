"use client";

import { useState, useEffect } from "react";
import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import BackButton from "@/components/atoms/BackButton";
import { HealthCard } from "@/components/molecules/HealthCard";
import {
  scoreToVariant,
  sleepVariantFromTitles,
  riskVariantToLabel,
  type RiskVariant,
} from "@/components/molecules/RiskList";
import { SectionWrapper } from "@/components/organisms/SectionWrapper";
import { apiClient } from "../../../lib/apiClient";
import type { CategoryDto } from "../../../types";
import { useUser } from "@/context/UserContext";

type PatientMeasureResult = {
  patientMeasureId: number;
  categoryId: number | null;
  title: string | null;
  categoryScore: number;
};

export default function PasientRisikoSide() {
  const { user, isAuthReady } = useUser();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryScores, setCategoryScores] = useState<Record<number, number>>(
    {},
  );
  const [measuresByCategory, setMeasuresByCategory] = useState<
    Record<number, PatientMeasureResult[]>
  >({});

  useEffect(() => {
    if (!isAuthReady || !user) return;

    async function loadData() {
      try {
        const [cats, queryDto] = await Promise.all([
          apiClient.get<CategoryDto[]>("/api/Categories"),
          apiClient.get<{ id: number }>("/api/Query/by-name/Helseskjema"),
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
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [isAuthReady, user]);

  function getCategoryInfo(name: string) {
    const cat = categories.find(
      (c) => c.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
    if (!cat) return null;

    const score = categoryScores[cat.categoryId];
    const measures = measuresByCategory[cat.categoryId] ?? [];
    const isSleep = cat.name.toLowerCase().trim() === "søvn";

    const hasData = isSleep
      ? measures.length > 0
      : score !== undefined && score !== null;

    let variant: RiskVariant | null = null;
    if (hasData) {
      variant = isSleep
        ? sleepVariantFromTitles(measures.map((m) => m.title ?? ""))
        : scoreToVariant(cat.name, score);
    }

    return { id: cat.categoryId, variant };
  }

  function renderHealthCard(apiName: string, displayTitle?: string) {
    const info = getCategoryInfo(apiName);
    const variant = info?.variant ?? null;
    const categoryId = info?.id;

    return (
      <HealthCard
        key={apiName}
        title={displayTitle ?? apiName}
        categoryId={categoryId}
        tag={variant ? riskVariantToLabel(variant) : undefined}
        tagVariant={variant ?? undefined}
      />
    );
  }

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientRisikoside" />
      <div className="flex flex-col flex-1">
        <PatientHeader />
        <main className="p-8 py-6 bg-slate-50 min-h-screen">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <BackButton />

              <h1 className="text-2xl font-semibold text-brand-navy">
                Din somatiske helseoversikt
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionWrapper title="Levevaner">
              {renderHealthCard("Fysisk aktivitet")}
              {renderHealthCard("Kosthold")}
              {renderHealthCard("Kroppsdata")}
              {renderHealthCard("Søvn")}
            </SectionWrapper>

            <SectionWrapper title="Livsstilsvaner">
              {renderHealthCard("Røyking")}
              {renderHealthCard("Alkohol")}
              {renderHealthCard("Rusmidler")}
              {renderHealthCard("Tannhelse")}
            </SectionWrapper>

            <SectionWrapper title="Annet">
              {renderHealthCard("Blodtrykk")}
              {renderHealthCard("Glukose")}
              {renderHealthCard("Blodlipider", "Kolesterol")}
            </SectionWrapper>
          </div>
        </main>
      </div>
    </div>
  );
}
