import TiltakPrint from "@/components/organisms/TiltakPrint";
import { apiClient } from "@/lib/apiClient";
import type { EvaluateQuickMeasuresDto, QuickMeasureResultDto } from "@/types";

type PageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

export default async function TiltakPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});

  const patientIdRaw = sp.patientId;
  const queryIdRaw = sp.queryId;

  const patientIdStr =
    typeof patientIdRaw === "string"
      ? patientIdRaw
      : Array.isArray(patientIdRaw)
        ? patientIdRaw[0]
        : undefined;

  const queryIdStr =
    typeof queryIdRaw === "string"
      ? queryIdRaw
      : Array.isArray(queryIdRaw)
        ? queryIdRaw[0]
        : undefined;

  const patientId = patientIdStr ? parseInt(patientIdStr, 10) : null;
  const queryId = queryIdStr ? parseInt(queryIdStr, 10) : null;

  if (
    patientId == null ||
    !Number.isFinite(patientId) ||
    queryId == null ||
    !Number.isFinite(queryId)
  ) {
    return (
      <div className="p-8 text-red-600">
        Manglende pasient-ID eller skjema-ID. Gå tilbake og send inn skjemaet på nytt.
      </div>
    );
  }

  let measures: QuickMeasureResultDto[] = [];
  let fetchError: string | null = null;

  try {
    const payload: EvaluateQuickMeasuresDto = { patientId, queryId };
    measures = await apiClient.post<QuickMeasureResultDto[]>(
      "/api/QuickMeasures/evaluate",
      payload,
    );
  } catch (err) {
    console.error("Kunne ikke hente tiltak:", err);
    fetchError = "Kunne ikke hente tiltak fra serveren.";
  }

  if (fetchError) {
    return <div className="p-8 text-red-600">{fetchError}</div>;
  }

  return <TiltakPrint measures={measures} patientId={patientId} />;
}
