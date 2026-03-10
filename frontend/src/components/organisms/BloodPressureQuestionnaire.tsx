"use client";

import QuestionNumber from "../molecules/QuestionNumber";

interface BloodPressureData {
  systolic: string;
  diastolic: string;
}

interface BloodPressureQuestionnaireProps {
  data: BloodPressureData;
  onChange: (data: BloodPressureData) => void;
}

export default function BloodPressureQuestionnaire({
  data,
  onChange,
}: BloodPressureQuestionnaireProps) {
  const updateData = (field: keyof BloodPressureData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6">
      <QuestionNumber
        question="Systolisk blodtrykk (øvre verdi)"
        name="blood-pressure-systolic"
        value={data.systolic}
        onChange={(value) => updateData("systolic", value)}
        placeholder="120"
        unit="mmHg"
      />

      <QuestionNumber
        question="Diastolisk blodtrykk (nedre verdi)"
        name="blood-pressure-diastolic"
        value={data.diastolic}
        onChange={(value) => updateData("diastolic", value)}
        placeholder="80"
        unit="mmHg"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">Informasjon:</p>
        <p>
          Normalt blodtrykk er under 120/80 mmHg. Høyt blodtrykk (hypertensjon)
          er systolisk ≥140 og/eller diastolisk ≥90 mmHg.
        </p>
      </div>
    </div>
  );
}
