"use client";

import type { QueryQuestionWithDetailsDto } from "@/types";

interface QuestionnaireSummaryProps {
  questions: QueryQuestionWithDetailsDto[];
  answers: Record<number, string>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

/** Converts a boolean question into a readable Norwegian statement. */
function booleanSentence(questionText: string, isYes: boolean): string {
  const text = questionText.replace(/\?$/, "").trim();

  // Pattern: "[Verb] du [rest]"  e.g. "Røyker du fast", "Bruker du rusmidler"
  const verbDuMatch = text.match(/^([A-ZÆØÅa-zæøå]+)\s+du(\s+.+)?$/i);
  if (verbDuMatch) {
    const verb = verbDuMatch[1].toLowerCase();
    const rest = (verbDuMatch[2] ?? "").trim().toLowerCase();
    return isYes
      ? rest
        ? `Du ${verb} ${rest}`
        : `Du ${verb}`
      : rest
        ? `Du ${verb} ikke ${rest}`
        : `Du ${verb} ikke`;
  }

  // Pattern: "Er det [adj] for deg [å ...]"  e.g. "Er det vanskelig for deg å sovne"
  const erDetMatch = text.match(/^Er det\s+(.+?)\s+for deg\s+(.+)$/i);
  if (erDetMatch) {
    const adj = erDetMatch[1].toLowerCase();
    const action = erDetMatch[2].toLowerCase();
    return isYes
      ? `Du synes det er ${adj} ${action}`
      : `Du synes ikke det er ${adj} ${action}`;
  }

  return isYes ? `Ja – ${text}` : `Nei – ${text}`;
}

/** Returns a complete readable sentence for a question + answer. */
function buildSentence(
  question: QueryQuestionWithDetailsDto,
  rawValue: string,
): string {
  if (!rawValue) return "";

  const text = question.fallbackText;
  const lower = text.toLowerCase();
  const optionText =
    question.options.find((o) => o.optionValue === rawValue)?.fallbackText ??
    rawValue;
  const optionLower = optionText.toLowerCase();

  // ── Number ──────────────────────────────────────────────────────────────
  if (question.questionType === "number") {
    if (lower.includes("høy er du")) return `Din høyde er ${rawValue} cm`;
    if (lower.includes("veier du")) return `Du veier ${rawValue} kg`;
    if (lower.includes("livvidde")) return `Din livvidde er ${rawValue} cm`;
    return `${text}: ${rawValue}`;
  }

  // ── Text ────────────────────────────────────────────────────────────────
  if (question.questionType === "text") {
    if (lower.includes("mye røyker")) return `Du røyker ${rawValue}`;
    if (lower.includes("vekten din endret"))
      return `Vekten din har endret seg: ${rawValue}`;
    return rawValue;
  }

  // ── Boolean ─────────────────────────────────────────────────────────────
  if (question.questionType === "boolean") {
    return booleanSentence(text, rawValue === "ja");
  }

  // ── Radio ────────────────────────────────────────────────────────────────
  // Physical activity
  if (lower.includes("hvor ofte trener")) return `Du trener ${optionLower}`;
  if (lower.includes("hvor lenge trener"))
    return `Du trener ${optionLower} per økt`;
  if (lower.includes("hvor hardt trener")) return optionText;

  // Motivation – physical activity
  if (lower.includes("motivert til å bli mer fysisk aktiv"))
    return rawValue === "ja"
      ? "Du er motivert til å bli mer fysisk aktiv"
      : "Du er ikke motivert til å bli mer fysisk aktiv";

  // Diet
  if (lower.includes("hvor mange måltider"))
    return `Du spiser ${optionLower} per dag`;
  if (lower.includes("hopper du over måltider"))
    return optionLower === "aldri"
      ? "Du hopper aldri over måltider"
      : `Du hopper over måltider ${optionLower}`;
  if (lower.includes("appetitten din"))
    return `Appetitten din er ${optionLower}`;
  if (lower.includes("har vekten din vært stabil")) return optionText;

  // Sleep
  if (lower.includes("problemer med søvn"))
    return `Du har søvnproblemer ${optionLower}`;

  // Alcohol – AUDIT
  if (lower.includes("hvor ofte drikker du alkohol"))
    return optionLower === "aldri"
      ? "Du drikker ikke alkohol"
      : `Du drikker alkohol ${optionLower}`;
  if (lower.includes("enheter drikker du på en typisk dag"))
    return `Du drikker vanligvis ${optionLower} enheter på en typisk dag`;
  if (lower.includes("6 eller flere enheter"))
    return `Du drikker 6+ enheter ${optionLower}`;

  // Long AUDIT questions ("Hvor ofte i løpet av det siste året har du...")
  if (lower.includes("ikke klarte å stoppe å drikke"))
    return `Du klarte ikke å stoppe å drikke: ${optionLower}`;
  if (lower.includes("ikke klart å gjøre det som normalt forventes"))
    return `Alkohol har hindret deg fra daglige gjøremål: ${optionLower}`;
  if (lower.includes("drikke alkohol på morgenen"))
    return `Du trengte alkohol om morgenen: ${optionLower}`;
  if (lower.includes("skyldfølelse eller dårlig samvittighet"))
    return `Du har hatt skyldfølelse etter å ha drukket: ${optionLower}`;
  if (lower.includes("ikke kunnet huske"))
    return `Du husker ikke hva som skjedde pga. alkohol: ${optionLower}`;
  if (lower.includes("blitt skadet"))
    return optionLower === "nei"
      ? "Ingen har blitt skadet pga. drikkingen din"
      : `Noen har blitt skadet pga. drikkingen din: ${optionLower}`;
  if (lower.includes("vist bekymring"))
    return optionLower === "nei"
      ? "Ingen har vist bekymring for drikkingen din"
      : `Noen har vist bekymring for drikkingen din: ${optionLower}`;

  // Generic radio fallback: try to extract verb from common Norwegian question patterns
  // "Hvor ofte [verb] du [...]?" → "Du [verb] [optionLower]"
  const hvofteDuMatch = lower.match(/^hvor ofte (.+?)\s+du(.+)?$/);
  if (hvofteDuMatch) {
    const verb = hvofteDuMatch[1].trim();
    const rest = (hvofteDuMatch[2] ?? "").replace(/\?$/, "").trim();
    return rest
      ? `Du ${verb} ${rest} ${optionLower}`
      : `Du ${verb} ${optionLower}`;
  }

  // "Hvor [adj] [verb] du?" → "Du [verb] [optionLower]"
  const hvordanDuMatch = lower.match(/^hvor\w*\s+(.+?)\s+du(.+)?$/);
  if (hvordanDuMatch) {
    const verb = hvordanDuMatch[1].trim();
    const rest = (hvordanDuMatch[2] ?? "").replace(/\?$/, "").trim();
    return rest
      ? `Du ${verb} ${rest}: ${optionLower}`
      : `Du ${verb}: ${optionLower}`;
  }

  // "Hva/Har/Er [verb] du?" patterns
  const genericDuMatch = lower.match(/^(?:hva|har|er)\s+(.+?)\s+du(.+)?$/);
  if (genericDuMatch) {
    const stem = text.replace(/\?$/, "").trim();
    return `${stem}: ${optionText}`;
  }

  // Last resort: question as label + option as answer
  return `${text.replace(/\?$/, "")}: ${optionText}`;
}

export default function QuestionnaireSummary({
  questions,
  answers,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
}: QuestionnaireSummaryProps) {
  const answeredQuestions = questions.filter((q) => {
    const val = (answers[q.questionId] ?? "").trim();
    return val !== "";
  });

  // Group by category
  const categoryMap = new Map<string, QueryQuestionWithDetailsDto[]>();
  for (const q of answeredQuestions) {
    const key = q.categoryName?.trim() ?? "Annet";
    if (!categoryMap.has(key)) categoryMap.set(key, []);
    categoryMap.get(key)!.push(q);
  }

  const groups = Array.from(categoryMap.entries());

  return (
    <div className="w-full">
      <div className="bg-white p-[clamp(1.5rem,4vw,3rem)] rounded-lg shadow-md">
        <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-gray-900 mb-1">
          Oppsummering
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-6">
          Se over svarene dine før du sender inn.
        </p>

        {groups.length === 0 && (
          <p className="text-gray-400 italic">Ingen svar registrert.</p>
        )}

        <div className="space-y-6">
          {groups.map(([categoryName, qs]) => (
            <div key={categoryName}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-navy mb-3">
                {categoryName}
              </h3>
              <ul className="space-y-1">
                {qs.map((q) => {
                  const rawValue = (answers[q.questionId] ?? "").trim();
                  const sentence = buildSentence(q, rawValue);
                  return (
                    <li
                      key={q.questionId}
                      className="py-3 border-b border-gray-100 last:border-0 text-gray-800 text-sm md:text-base"
                    >
                      {sentence}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {submitError && (
          <p className="text-red-500 text-sm mt-4">{submitError}</p>
        )}

        <div className="flex gap-4 justify-between pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 min-w-28 touch-manipulation"
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg bg-brand-navy text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-w-28 touch-manipulation"
          >
            {isSubmitting ? "Sender..." : "Send inn"}
          </button>
        </div>
      </div>
    </div>
  );
}
