"use client";

import QuestionNumber from "../molecules/QuestionNumber";

interface WeightData {
  height: string;
  weight: string;
  waistCircumference: string;
}

interface WeightQuestionnaireProps {
  data: WeightData;
  onChange: (data: WeightData) => void;
}

export default function WeightQuestionnaire({
  data,
  onChange,
}: WeightQuestionnaireProps) {
  const updateData = (field: keyof WeightData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    const heightM = parseFloat(data.height) / 100;
    const weightKg = parseFloat(data.weight);
    if (heightM > 0 && weightKg > 0) {
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

  return (
    <div className="bg-white p-6">
      <QuestionNumber
        question="Hvor høy er pasienten?"
        name="height"
        value={data.height}
        onChange={(value) => updateData("height", value)}
        placeholder="170"
        unit="cm"
      />

      <QuestionNumber
        question="Hvor mye veier pasienten?"
        name="weight"
        value={data.weight}
        onChange={(value) => updateData("weight", value)}
        placeholder="70"
        unit="kg"
      />

      {bmi && (
        <div className="mb-6 p-3 bg-brand-mist/20 rounded-md">
          <p className="text-sm font-medium text-brand-navy">BMI: {bmi}</p>
        </div>
      )}

      <QuestionNumber
        question="Hva er pasientens livvidde?"
        name="waist"
        value={data.waistCircumference}
        onChange={(value) => updateData("waistCircumference", value)}
        placeholder="80"
        unit="cm"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">Informasjon:</p>
        <p>
          Livvidde måles ved å plassere målebåndet rundt livet, vanligvis
          omtrent midt mellom nedre ribbenskant og hoftekam.
        </p>
      </div>
    </div>
  );
}
