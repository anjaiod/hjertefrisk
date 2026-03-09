"use client";

import ConditionalQuestion from "../molecules/ConditionalQuestion";

interface SubstanceUseData {
  usesSubstances: "ja" | "nei" | "";
  usedOpioidsGHB: "ja" | "nei" | "";
  usedOpioidsGHBRecently: "ja" | "nei" | "";
  usesInjection: "ja" | "nei" | "";
  motivatedToQuit: "ja" | "nei" | "";
}

interface SubstanceUseQuestionnaireProps {
  data: SubstanceUseData;
  onChange: (data: SubstanceUseData) => void;
}

export default function SubstanceUseQuestionnaire({
  data,
  onChange,
}: SubstanceUseQuestionnaireProps) {
  const updateData = (field: keyof SubstanceUseData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const showOverdoseWarning =
    data.usedOpioidsGHBRecently === "ja" || data.usesInjection === "ja";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-navy">
        Injisering av rusmidler
      </h2>

      <ConditionalQuestion
        question="Bruker pasienten rusmidler?"
        name="uses-substances"
        value={data.usesSubstances}
        onChange={(value) => updateData("usesSubstances", value)}
        required
      >
        <div className="space-y-4">
          <ConditionalQuestion
            question="Har pasienten brukt opioider/GHB noen gang?"
            name="used-opioids-ghb"
            value={data.usedOpioidsGHB}
            onChange={(value) => updateData("usedOpioidsGHB", value)}
            required
          />

          <ConditionalQuestion
            question="Har pasienten brukt opioider/GHB siste 0-8 dager?"
            name="used-opioids-ghb-recently"
            value={data.usedOpioidsGHBRecently}
            onChange={(value) => updateData("usedOpioidsGHBRecently", value)}
            required
          />

          <ConditionalQuestion
            question="Bruker pasienten injisering som inntaksmetode uansett rusmiddel?"
            name="uses-injection"
            value={data.usesInjection}
            onChange={(value) => updateData("usesInjection", value)}
            required
          />

          {showOverdoseWarning && (
            <div className="p-4 bg-red-50 border-l-4 border-brand-orange rounded-md">
              <p className="font-bold text-brand-orange mb-2">
                ⚠️ Overdosefare
              </p>
              <p className="text-sm text-gray-700">
                Pasienten bør informeres om overdosefare og gis
                113-kort/overdosekort.
              </p>
            </div>
          )}

          <ConditionalQuestion
            question="Er pasienten motivert og villig til å motta hjelp til å slutte med rusmiddelbruk?"
            name="motivated-to-quit"
            value={data.motivatedToQuit}
            onChange={(value) => updateData("motivatedToQuit", value)}
            required
          />
        </div>
      </ConditionalQuestion>
    </div>
  );
}
