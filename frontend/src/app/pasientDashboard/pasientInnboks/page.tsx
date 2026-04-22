import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";

export default function Page() {
  // not yet tied to backend functionality, so hardcoded to false:
  const hasMessages = false;

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientInnboks" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="flex-1 bg-slate-50 p-6">
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-brand-navy mb-6">Innboks</h1>

            {!hasMessages && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-3 text-center">
                <svg
                  className="w-10 h-10 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0l-9 6.75-9-6.75"
                  />
                </svg>

                <p className="text-slate-600 font-medium">
                  Innboksen din er tom
                </p>

                <p className="text-slate-400 text-sm max-w-sm">
                  Du har ingen meldinger enda. Når helsepersonell sender deg
                  meldinger, vil de vises her.
                </p>
              </div>
            )}

            {hasMessages && (
              <div className="space-y-3">
                {/* space for message cards */}
                <div className="bg-white rounded-xl border p-4">
                  Meldinger kommer her
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
