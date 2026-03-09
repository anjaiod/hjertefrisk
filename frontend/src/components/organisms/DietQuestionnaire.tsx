"use client";

import QuestionRadio from "../molecules/QuestionRadio";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import QuestionTextArea from "../molecules/QuestionTextArea";

interface DietData {
  mealsPerDay: string;
  skipMeals: string;
  appetite: string;
  motivatedToImprove: "ja" | "nei" | "";
  weightStable: string;
  weightChange: string;
}

interface DietQuestionnaireProps {
  data: DietData;
  onChange: (data: DietData) => void;
}

export default function DietQuestionnaire({
  data,
  onChange,
}: DietQuestionnaireProps) {
  const updateData = (field: keyof DietData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-navy">Kosthold</h2>

      <QuestionRadio
        question="Hvor mange måltider spiser pasienten vanligvis per dag?"
        name="meals-per-day"
        options={[
          { value: "1-2", label: "1–2" },
          { value: "3", label: "3" },
          { value: "4-plus", label: "4 eller flere" },
        ]}
        value={data.mealsPerDay}
        onChange={(value) => updateData("mealsPerDay", value)}
        required
      />

      <QuestionRadio
        question="Hopper pasienten ofte over måltider?"
        name="skip-meals"
        options={[
          { value: "nei", label: "Nei" },
          { value: "av-og-til", label: "Av og til" },
          { value: "ofte", label: "Ofte" },
        ]}
        value={data.skipMeals}
        onChange={(value) => updateData("skipMeals", value)}
        required
      />

      <QuestionRadio
        question="Hvordan vil pasienten beskrive sin appetitt den siste måneden?"
        name="appetite"
        options={[
          { value: "normalt", label: "Normalt" },
          { value: "redusert", label: "Redusert" },
          { value: "økt", label: "Økt" },
          { value: "varierer", label: "Varierer mye" },
        ]}
        value={data.appetite}
        onChange={(value) => updateData("appetite", value)}
        required
      />

      <ConditionalQuestion
        question="Er pasienten motivert til å forbedre kostholdet og ønsker hjelp til dette?"
        name="motivated-improve"
        value={data.motivatedToImprove}
        onChange={(value) => updateData("motivatedToImprove", value)}
        required
      />

      <QuestionRadio
        question="Er pasientens vekt stabil?"
        name="weight-stable"
        options={[
          { value: "ja", label: "Ja" },
          { value: "nei", label: "Nei" },
          { value: "usikker", label: "Usikker" },
        ]}
        value={data.weightStable}
        onChange={(value) => updateData("weightStable", value)}
        required
      />

      {data.weightStable === "nei" && (
        <div className="ml-6 mt-4 border-l-2 border-brand-sky pl-4">
          <QuestionTextArea
            question="Har pasienten gått opp eller ned i vekt de siste månedene?"
            name="weight-change"
            value={data.weightChange}
            onChange={(value) => updateData("weightChange", value)}
            placeholder="Beskriv vektendring..."
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
