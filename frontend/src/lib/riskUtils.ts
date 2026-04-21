import type { TagVariant } from "@/components/atoms/Tag";

export type RiskThreshold = {
  high: number;
  medium: number | null;
};

export const CATEGORY_RISK_THRESHOLDS: Record<string, RiskThreshold> = {
  "fysisk aktivitet": { high: 9, medium: 5 },
  kosthold: { high: 9, medium: 5 },
  rusmidler: { high: 3, medium: 1 },
  alkohol: { high: 15, medium: 8 },
  røyking: { high: 2, medium: 1 },
  tannhelse: { high: 1, medium: null },
  kroppsdata: { high: 2, medium: 1 },
  blodtrykk: { high: 2, medium: 1 },
  blodlipider: { high: 2, medium: 1 },
  glukoseregulering: { high: 2, medium: 1 },
};

export function tagVariantFromCategoryScore(
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

export function sleepTagVariant(
  measures: { title: string | null }[],
): TagVariant | null {
  if (measures.length === 0) return null;
  const titles = measures.map((m) => m.title ?? "");
  if (titles.some((t) => t === "Betydelige s\u00F8vnvansker")) return "high";
  if (titles.some((t) => t === "Noen s\u00F8vnproblemer")) return "medium";
  if (titles.some((t) => t === "God s\u00F8vn")) return "low";
  return null;
}

export function tagTextFromVariant(variant: TagVariant): string {
  if (variant === "high") return "Høy";
  if (variant === "medium") return "Middels";
  return "Lav";
}
