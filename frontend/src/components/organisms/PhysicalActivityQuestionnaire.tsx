"use client";

import QuestionRadio from "../molecules/QuestionRadio";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import QuestionTextArea from "../molecules/QuestionTextArea";

interface PhysicalActivityData {
  frequency: string;
  duration: string;
  intensity: string;
  physicalLimitations: "ja" | "nei" | "";
  physicalLimitationsDetails: string;
  otherBarriers: "ja" | "nei" | "";
  otherBarriersDetails: string;
  motivated: "ja" | "nei" | "";
}

interface PhysicalActivityQuestionnaireProps {
  data: PhysicalActivityData;
  onChange: (data: PhysicalActivityData) => void;
}

export default function PhysicalActivityQuestionnaire({
  data,
  onChange,
}: PhysicalActivityQuestionnaireProps) {
  const updateData = (field: keyof PhysicalActivityData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-navy">
        Fysisk aktivitet
      </h2>

      <QuestionRadio
        question="Hvor ofte trener pasienten?"
        name="frequency"
        options={[
          {
            value: "nesten-aldri",
            label: "Nesten aldri eller mindre enn en gang i uka",
          },
          { value: "en-gang", label: "En gang i uka" },
          { value: "2-3-ganger", label: "2-3 ganger i uka" },
          { value: "nesten-hver-dag", label: "Nesten hver dag" },
        ]}
        value={data.frequency}
        onChange={(value) => updateData("frequency", value)}
        required
      />

      <QuestionRadio
        question="Hvor lenge trener pasienten hver gang?"
        name="duration"
        options={[
          { value: "15min", label: "Rundt 15 minutter" },
          { value: "30min", label: "Rundt 30 minutter" },
          { value: "30min-plus", label: "30 minutter eller mer" },
        ]}
        value={data.duration}
        onChange={(value) => updateData("duration", value)}
        required
      />

      <QuestionRadio
        question="Hvor hardt trener pasienten?"
        name="intensity"
        options={[
          {
            value: "rolig",
            label:
              "Pasienten tar det med ro og blir ikke andpusten eller svett",
          },
          { value: "moderat", label: "Pasienten blir litt andpusten og svett" },
          { value: "hardt", label: "Pasienten tar det helt ut" },
        ]}
        value={data.intensity}
        onChange={(value) => updateData("intensity", value)}
        required
      />

      <ConditionalQuestion
        question="Har pasienten noen fysiske begrensninger som påvirker pasientens muligheter til trening?"
        name="physical-limitations"
        value={data.physicalLimitations}
        onChange={(value) => updateData("physicalLimitations", value)}
        required
      >
        <QuestionTextArea
          question="Skriv om begrensninger"
          name="physical-limitations-details"
          value={data.physicalLimitationsDetails}
          onChange={(value) => updateData("physicalLimitationsDetails", value)}
          placeholder="Beskriv dine fysiske begrensninger..."
          rows={3}
        />
      </ConditionalQuestion>

      <ConditionalQuestion
        question="Har pasienten noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?"
        name="other-barriers"
        value={data.otherBarriers}
        onChange={(value) => updateData("otherBarriers", value)}
        required
      >
        <QuestionTextArea
          question="Skriv litt om dette"
          name="other-barriers-details"
          value={data.otherBarriersDetails}
          onChange={(value) => updateData("otherBarriersDetails", value)}
          placeholder="Beskriv barrierer..."
          rows={3}
        />
      </ConditionalQuestion>

      <ConditionalQuestion
        question="Er pasienten motivert til å bli mer fysisk aktiv i sin hverdag dersom pasienten får hjelp til dette?"
        name="motivated"
        value={data.motivated}
        onChange={(value) => updateData("motivated", value)}
        required
      />
    </div>
  );
}
