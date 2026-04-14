import { apiClient } from "@/lib/apiClient";
import { Tag } from "../atoms/Tag";
import type { TagVariant } from "../atoms/Tag";

export type RiskVariant = "high" | "medium" | "low";
export type CategoryRisk = { name: string; variant: RiskVariant };

export const CATEGORY_RISK_THRESHOLDS: Record<
  string,
  { high: number; medium: number | null }
> = {
  "fysisk aktivitet": { high: 9, medium: 5 },
  kosthold: { high: 9, medium: 5 },
  rusmidler: { high: 3, medium: 1 },
  alkohol: { high: 15, medium: 8 },
  røyking: { high: 2, medium: 1 },
  tannhelse: { high: 1, medium: null },
  kroppsdata: { high: 2, medium: 1 },
  blodtrykk: { high: 2, medium: 1 },
  glukose: { high: 2, medium: 1 },
  blodlipider: { high: 2, medium: 1 },
};

export function scoreToVariant(
  categoryName: string,
  score: number,
): RiskVariant | null {
  const thresholds =
    CATEGORY_RISK_THRESHOLDS[categoryName.toLowerCase().trim()];
  if (!thresholds) return null;
  if (score >= thresholds.high) return "high";
  if (thresholds.medium !== null && score >= thresholds.medium) return "medium";
  return "low";
}

export function sleepVariantFromTitles(titles: string[]): RiskVariant | null {
  if (titles.some((t) => t === "Betydelige søvnvansker")) return "high";
  if (titles.some((t) => t === "Noen søvnproblemer")) return "medium";
  if (titles.some((t) => t === "God søvn")) return "low";
  return null;
}

export function totalScoreToVariant(score: number): RiskVariant {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export async function getRisks(patientId: string): Promise<CategoryRisk[]> {
  try {
    const [query, categories] = await Promise.all([
      apiClient.get<{ id: number }>("/api/Query/by-name/Helseskjema"),
      apiClient.get<{ categoryId: number; name: string }[]>("/api/Categories"),
    ]);
    const result = await apiClient.post<{
      patientMeasures: { categoryId: number | null; title: string | null }[];
      categoryScores: Record<number, number>;
    }>("/api/measures/evaluate", {
      patientId: Number(patientId),
      queryId: query.id,
      languageCode: "no",
    });
    const scores = result.categoryScores ?? {};
    return categories
      .map((cat): CategoryRisk | null => {
        if (cat.name.toLowerCase().trim() === "søvn") {
          const titles = result.patientMeasures
            .filter((m) => m.categoryId === cat.categoryId)
            .map((m) => m.title ?? "");
          const variant = sleepVariantFromTitles(titles);
          return variant ? { name: cat.name, variant } : null;
        }
        const score = scores[cat.categoryId];
        if (score === undefined) return null;
        const variant = scoreToVariant(cat.name, score);
        if (!variant) return null;
        return { name: cat.name, variant };
      })
      .filter((r): r is CategoryRisk => r !== null);
  } catch {
    return [];
  }
}

function tagLabel(variant: TagVariant): string {
  if (variant === "high") return "Høy";
  if (variant === "medium") return "Middels";
  return "Lav";
}

export function riskVariantToLabel(variant: RiskVariant): string {
  return tagLabel(variant);
}

export function riskVariantRank(variant: RiskVariant): number {
  return { high: 0, medium: 1, low: 2 }[variant];
}

export function RiskList({ risks = [] }: { risks?: CategoryRisk[] }) {
  const sorted = [...risks].sort(
    (a, b) => riskVariantRank(a.variant) - riskVariantRank(b.variant),
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg bg-brand-mist-lightest border border-brand-mist-lighter p-4">
        <p className="text-slate-900 font-semibold">
          Ingen kjente risikofaktorer
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((risk) => (
        <div
          key={risk.name}
          className="rounded-lg border border-brand-mist-lighter p-3 flex items-center justify-between"
        >
          <p className="text-slate-900">{risk.name}</p>
          <Tag variant={risk.variant} className="text-xs px-2 py-1">
            {tagLabel(risk.variant)}
          </Tag>
        </div>
      ))}
    </div>
  );
}
