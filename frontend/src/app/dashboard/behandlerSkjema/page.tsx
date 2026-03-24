import HealthQuestionnaire from "@/components/organisms/HealthQuestionnaire";

type PageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const raw = sp.patientId;
  const patientIdStr = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const patientId = patientIdStr ? parseInt(patientIdStr, 10) : null;

  return <HealthQuestionnaire patientId={Number.isFinite(patientId) ? patientId : null} />;
}
