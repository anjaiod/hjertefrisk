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
import type { CategoryDto, LatestMeasurementResultDto } from "../../../types";
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
  const [latestMeasurements, setLatestMeasurements] = useState<
    LatestMeasurementResultDto[]
  >([]);

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

        const [result, measurements] = await Promise.all([
          apiClient.post<{
            patientMeasures: PatientMeasureResult[];
            categoryScores: Record<number, number>;
          }>("/api/measures/evaluate", {
            patientId,
            queryId: queryDto.id,
            languageCode: "no",
          }),
          apiClient
            .get<LatestMeasurementResultDto[]>(
              `/api/patients/${patientId}/latest-measurements`,
            )
            .catch(() => [] as LatestMeasurementResultDto[]),
        ]);

        const grouped: Record<number, PatientMeasureResult[]> = {};
        for (const m of result.patientMeasures) {
          if (m.categoryId != null) {
            grouped[m.categoryId] ??= [];
            grouped[m.categoryId].push(m);
          }
        }
        setMeasuresByCategory(grouped);
        setCategoryScores(result.categoryScores ?? {});
        setLatestMeasurements(measurements);
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

    return { id: cat.categoryId, variant, measures, score };
  }

  function variantStatus(variant: RiskVariant | null): string | null {
    if (variant === "low") return "Ingen problemer, bra!";
    if (variant === "medium") return "Noen utfordringer";
    if (variant === "high") return "Tiltak bør fattes";
    return null;
  }

  function buildInfo(
    apiName: string,
    score: number | undefined,
    variant: RiskVariant | null,
  ): string[] {
    const name = apiName.toLowerCase().trim();
    const lines: string[] = [];
    const status = variantStatus(variant);

    if (name === "kroppsdata") {
      const weight = latestMeasurements.find((m) => m.measurementId === 1)?.result;
      const height = latestMeasurements.find((m) => m.measurementId === 2)?.result;
      const waist = latestMeasurements.find((m) => m.measurementId === 3)?.result;

      if (weight != null && height != null && height > 0) {
        const bmi = weight / Math.pow(height / 100, 2);
        lines.push(`BMI: ${bmi.toFixed(1).replace(".", ",")}`);
      }
      if (waist != null) {
        lines.push(`Midjemål: ${waist} cm`);
      }
      if (status) lines.push(status);
      return lines;
    }

    if (name === "søvn") {
      if (status) lines.push(status);
      return lines;
    }

    if (score !== undefined) {
      lines.push(`Poengsum: ${score}`);
    }
    if (status) lines.push(status);
    return lines;
  }

  function renderHealthCard(apiName: string, displayTitle?: string) {
    const info = getCategoryInfo(apiName);
    const variant = info?.variant ?? null;
    const categoryId = info?.id;
    const infoLines = info ? buildInfo(apiName, info.score, variant) : [];

    return (
      <HealthCard
        key={apiName}
        title={displayTitle ?? apiName}
        categoryId={categoryId}
        tag={variant ? `${riskVariantToLabel(variant)} risiko` : undefined}
        tagVariant={variant ?? undefined}
        info={infoLines.length > 0 ? infoLines : undefined}
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
            <BackButton />
            <h1 className="mt-2 text-2xl font-semibold text-brand-navy">
              Dine risikoer
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            <SectionWrapper title="Kardiometabolsk helse">
              {renderHealthCard("Blodtrykk")}
              {renderHealthCard("Glukoseregulering")}
              {renderHealthCard("Blodlipider")}
              {renderHealthCard("Kroppsdata", "Kroppsdata")}
            </SectionWrapper>
            
            <SectionWrapper title="Levevaner">
              {renderHealthCard("Fysisk aktivitet")}
              {renderHealthCard("Kosthold")}
              {renderHealthCard("Røyking")}
              {renderHealthCard("Tannhelse")}
            </SectionWrapper>

            <SectionWrapper title="Psykisk helse og rus">
              {renderHealthCard("Søvn")}
              {renderHealthCard("Alkohol")}
              {renderHealthCard("Rusmidler")}
            </SectionWrapper>

            
          </div>
        </main>
      </div>
    </div>
  );
}
