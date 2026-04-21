import type { QueryQuestionWithDetailsDto } from "@/types";

/**
 * Returns the unit label for a number question (e.g. "cm", "kg", "mmHg").
 */
export function getQuestionUnit(
  question: QueryQuestionWithDetailsDto,
): string | undefined {
  //questions containing open text answers
  const text = question.fallbackText.toLowerCase();
  if (text.includes("hvor høy")) return "cm";
  if (text.includes("hvor mye veier")) return "kg";
  if (text.includes("livvidde")) return "cm";
  if (text.includes("systolisk") || text.includes("diastolisk")) return "mmHg";
  if (text.includes("blodtrykk")) return "mmHg";
  if (text.includes("hba1c")) return "mmol/mol";
  if (text.includes("ldl") || text.includes("hdl")) return "mmol/L";
  if (text.includes("kolesterol")) return "mmol/L";
  if (text.includes("triglyserider")) return "mmol/L";
  return undefined;
}

/**
 * Returns the min/max validation range for a number question.
 * Based on clinically agreed values — update here when values change.
 */
export function getQuestionValidationRange(
  question: QueryQuestionWithDetailsDto,
): { min: number; max: number } {
  const text = question.fallbackText.toLowerCase();

  // Kroppsdata
  if (text.includes("hvor høy")) return { min: 1, max: 250 };
  if (text.includes("hvor mye veier")) return { min: 10, max: 700 };
  if (text.includes("livvidde")) return { min: 30, max: 300 };

  // Blodtrykk — sjekk systolisk/diastolisk før generell "blodtrykk"
  if (text.includes("systolisk")) return { min: 50, max: 400 };
  if (text.includes("diastolisk")) return { min: 20, max: 400 };
  if (text.includes("blodtrykk")) return { min: 20, max: 300 };

  // Glukoseregulering
  if (text.includes("hba1c")) return { min: 20, max: 150 };


  // Blodlipider — sjekk LDL/HDL før generell "kolesterol"
  if (text.includes("ldl")) return { min: 0.5, max: 15 };
  if (text.includes("hdl")) return { min: 0.1, max: 10 };
  if (text.includes("kolesterol")) return { min: 1, max: 20 };
  if (text.includes("triglyserider")) return { min: 0.1, max: 50 };

  // Fallback
  return { min: 0, max: 500 };
}

/**
 * Returns the number of rows for a textarea question.
 */
export function getQuestionRows(
  question: QueryQuestionWithDetailsDto,
): number | undefined {
  const text = question.fallbackText.toLowerCase();
  if (text.includes("hvor mye røyker")) return 2;
  if (text.includes("vekten din endret")) return 2;
  if (text.includes("begrensninger") || text.includes("barrierer")) return 3;
  return undefined;
}
