"use client";

import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import { IconButton } from "@/components/atoms/IconButton";
import { HealthCard } from "@/components/molecules/HealthCard";
import { SectionWrapper } from "@/components/organisms/SectionWrapper";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientRisikoside" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="p-8">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <IconButton
                onClick={() =>
                  (window.location.href = "../../pasientDashboard")
                }
                ariaLabel="Back to dashboard"
              >
                ←
              </IconButton>

              <h1 className="text-2xl font-semibold text-brand-navy">
                Din somatiske helseoversikt
              </h1>
            </div>
          </div>
          <p className="text-sm text-brand-sage">
            Trykk på et kort for å lese mer
          </p>
          <div>
            <SectionWrapper title="Levevaner">
              <HealthCard title="Fysisk aktivitet" />
              <HealthCard title="Kosthold" />
              <HealthCard title="Overvekt" />
              <HealthCard title="Søvn" />
            </SectionWrapper>

            <SectionWrapper title="Livsstilsvaner">
              <HealthCard title="Røyking" />
              <HealthCard
                title="Alkohol" // placeholder description
                description="AUDIT skåre: 3 "
              />
              <HealthCard title="Rus" />
              <HealthCard title="Tannhelse" />
            </SectionWrapper>

            <SectionWrapper title="Annet">
              <HealthCard
                title="Blodlipider"
                // placeholder description
                description="Totalkolesterol ≥ 7,0 mmol/l"
              />
              <HealthCard title="Glukose" />
              <HealthCard
                title="Blodtrykk" // placeholder description
                description={"≥ 140 systolisk\n≥ 90 diastolisk (mmHg)"}
              />
            </SectionWrapper>
          </div>
        </main>
      </div>
    </div>
  );
}
