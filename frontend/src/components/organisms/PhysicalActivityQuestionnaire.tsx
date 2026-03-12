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
  onChange: (field: keyof PhysicalActivityData, value: unknown) => void;
}

export default function PhysicalActivityQuestionnaire({
  data,
  onChange,
}: PhysicalActivityQuestionnaireProps) {
  return (
    <div className="bg-white p-6">
      <QuestionRadio
        question="Hvor ofte trener pasienten?"
        name="physical-activity-frequency"
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
        onChange={(value) => onChange("frequency", value)}
      />

      <QuestionRadio
        question="Hvor lenge trener pasienten hver gang?"
        name="physical-activity-duration"
        options={[
          { value: "15min", label: "Rundt 15 minutter" },
          { value: "30min", label: "Rundt 30 minutter" },
          { value: "30min-plus", label: "30 minutter eller mer" },
        ]}
        value={data.duration}
        onChange={(value) => onChange("duration", value)}
      />

      <QuestionRadio
        question="Hvor hardt trener pasienten?"
        name="physical-activity-intensity"
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
        onChange={(value) => onChange("intensity", value)}
      />

      <ConditionalQuestion
        question="Har pasienten noen fysiske begrensninger som påvirker pasientens muligheter til trening?"
        name="physical-activity-limitations"
        value={data.physicalLimitations}
        onChange={(value) => onChange("physicalLimitations", value)}
      >
        <QuestionTextArea
          question="Skriv om begrensninger"
          name="physical-limitations-details"
          value={data.physicalLimitationsDetails}
          onChange={(value) => onChange("physicalLimitationsDetails", value)}
          placeholder="Beskriv dine fysiske begrensninger..."
          rows={3}
        />
      </ConditionalQuestion>

      <ConditionalQuestion
        question="Har pasienten noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?"
        name="physical-activity-barriers"
        value={data.otherBarriers}
        onChange={(value) => onChange("otherBarriers", value)}
      >
        <QuestionTextArea
          question="Skriv litt om dette"
          name="other-barriers-details"
          value={data.otherBarriersDetails}
          onChange={(value) => onChange("otherBarriersDetails", value)}
          placeholder="Beskriv barrierer..."
          rows={3}
        />
      </ConditionalQuestion>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <QuestionRadio
          question="Er pasienten motivert til å bli mer fysisk aktiv i sin hverdag dersom pasienten får hjelp til dette?"
          name="physical-activity-motivated"
          options={[
            { value: "ja", label: "Ja" },
            { value: "nei", label: "Nei" },
          ]}
          value={data.motivated}
          onChange={(value) => onChange("motivated", value)}
        />
      </div>
    </div>
  );
}
