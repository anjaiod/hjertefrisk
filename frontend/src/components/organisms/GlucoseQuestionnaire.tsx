"use client";

import QuestionNumber from "../molecules/QuestionNumber";

interface GlucoseData {
  hba1c: string;
  fastingGlucose: string;
}

interface GlucoseQuestionnaireProps {
  data: GlucoseData;
  onChange: (data: GlucoseData) => void;
}

export default function GlucoseQuestionnaire({
  data,
  onChange,
}: GlucoseQuestionnaireProps) {
  const updateData = (field: keyof GlucoseData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6">
      <QuestionNumber
        question="HbA1c (langtidsblodsukker)"
        name="glucose-hba1c"
        value={data.hba1c}
        onChange={(value) => updateData("hba1c", value)}
        placeholder="42"
        unit="mmol/mol"
      />

      <QuestionNumber
        question="Fastende glukose"
        name="glucose-fasting"
        value={data.fastingGlucose}
        onChange={(value) => updateData("fastingGlucose", value)}
        placeholder="5.5"
        unit="mmol/L"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">Informasjon:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>HbA1c &lt;42 mmol/mol: Normal</li>
          <li>HbA1c 42-47 mmol/mol: Prediabetes</li>
          <li>HbA1c ≥48 mmol/mol: Diabetes</li>
          <li>Fastende glukose &lt;6.1 mmol/L: Normal</li>
          <li>Fastende glukose ≥7.0 mmol/L: Diabetes</li>
        </ul>
      </div>
    </div>
  );
}
