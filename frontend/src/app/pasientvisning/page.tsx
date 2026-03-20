import PatientTable, { Patient } from "@/components/organisms/PatientTable";
import { Input } from "@/components/atoms/Input";
import { SearchBar } from "@/components/atoms/SearchBar";
import { TagVariant } from "@/components/atoms/Tag";
import { PatientDto } from "@/types";
import { getApiBaseUrl } from "@/lib/apiClient";

function scoreToRiskLevel(score: number): TagVariant {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function fetchPatients(): Promise<Patient[]> {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/patients`, { cache: "no-store" });
  if (!res.ok) throw new Error("Kunne ikke hente pasienter");
  const patients: PatientDto[] = await res.json();

  return Promise.all(
    patients.map(async (p) => {
      let riskLevel: TagVariant = "low";
      try {
        const scoreRes = await fetch(
          `${apiBaseUrl}/api/patients/${p.id}/score`,
          {
            cache: "no-store",
          },
        );
        if (scoreRes.ok) {
          const { totalScore } = await scoreRes.json();
          riskLevel = scoreToRiskLevel(totalScore);
        }
      } catch {
        // fallback to "low" if score fetch fails
      }
      return {
        id: String(p.id),
        name: p.name,
        lastVisited: formatDate(p.createdAt),
        riskLevel,
      };
    }),
  );
}

export default async function Page() {
  const patients = await fetchPatients();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Pasienter</h1>
        <div className="flex items-center gap-3">
          <Input
            as="select"
            className="w-36"
            options={[
              { value: "high", label: "Status: Høy" },
              { value: "medium", label: "Status: Middels" },
              { value: "low", label: "Status: Lav" },
              { value: "lastVisited", label: "Sist besøkt" },
            ]}
            placeholder="Filtrer"
            defaultValue=""
          />
          <SearchBar placeholder="Søk..." />
        </div>
      </div>
      <PatientTable patients={patients} />
    </div>
  );
}
