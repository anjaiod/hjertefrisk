"use client";

import { useRouter } from "next/navigation";
import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import { Button } from "../../../components/atoms/Button";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientHjertefrisk" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="flex-1 bg-slate-50 p-[clamp(1rem,3vw,2rem)]">
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="font-bold text-black mb-6 text-center text-[clamp(1.75rem,4vw,3rem)]">
              Hjertefrisk helseskjema
            </h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Viktig informasjon før du begynner
              </h2>
              <ul className="space-y-3 text-xl text-black mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-brand-navy font-bold mt-0.5">•</span>
                  Skjemaet tar ca. 5–10 minutter å fylle ut
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-navy font-bold mt-0.5">•</span>
                  Svarene lagres og er synlige for ditt behandlingsteam
                </li>
                <li className="flex items-start gap-2 font-bold">
                  <span className="text-black font-bold mt-0.5">•</span>
                  Du kan navigere frem og tilbake mellom spørsmålene, og du kan
                  trykke &quot;Neste&quot; på spørsmål du er usikker på, eller
                  ikke ønsker å svare på.
                </li>
              </ul>
              <p className="text-base text-black">
                Dette skjemaet brukes til å kartlegge din helse og livsstil som
                en del av Hjertefrisk-programmet. Svarene dine hjelper
                helsepersonellet å følge opp din helseutvikling, og behandles konfidensielt
                i henhold til gjeldende personvernregler.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  router.push(
                    "/pasientDashboard/pasientHjertefrisk/pasientSkjema",
                  )
                }
                className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy/90 transition touch-manipulation cursor-pointer"
              >
                Start skjema
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
