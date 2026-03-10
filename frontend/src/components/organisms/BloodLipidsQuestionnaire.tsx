"use client";

import QuestionNumber from "../molecules/QuestionNumber";

interface BloodLipidsData {
  totalCholesterol: string;
  ldlCholesterol: string;
  hdlCholesterol: string;
  triglycerides: string;
}

interface BloodLipidsQuestionnaireProps {
  data: BloodLipidsData;
  onChange: (data: BloodLipidsData) => void;
}

export default function BloodLipidsQuestionnaire({
  data,
  onChange,
}: BloodLipidsQuestionnaireProps) {
  const updateData = (field: keyof BloodLipidsData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6">
      <QuestionNumber
        question="Totalkolesterol"
        name="lipids-total-cholesterol"
        value={data.totalCholesterol}
        onChange={(value) => updateData("totalCholesterol", value)}
        placeholder="5.0"
        unit="mmol/L"
      />

      <QuestionNumber
        question="LDL-kolesterol (dårlig kolesterol)"
        name="lipids-ldl"
        value={data.ldlCholesterol}
        onChange={(value) => updateData("ldlCholesterol", value)}
        placeholder="3.0"
        unit="mmol/L"
      />

      <QuestionNumber
        question="HDL-kolesterol (godt kolesterol)"
        name="lipids-hdl"
        value={data.hdlCholesterol}
        onChange={(value) => updateData("hdlCholesterol", value)}
        placeholder="1.5"
        unit="mmol/L"
      />

      <QuestionNumber
        question="Triglyserider"
        name="lipids-triglycerides"
        value={data.triglycerides}
        onChange={(value) => updateData("triglycerides", value)}
        placeholder="1.5"
        unit="mmol/L"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-1">Informasjon:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Totalkolesterol: &lt;5.0 mmol/L anbefales</li>
          <li>LDL-kolesterol: &lt;3.0 mmol/L anbefales</li>
          <li>
            HDL-kolesterol: &gt;1.0 mmol/L (menn), &gt;1.3 mmol/L (kvinner)
          </li>
          <li>Triglyserider: &lt;2.0 mmol/L anbefales</li>
        </ul>
      </div>
    </div>
  );
}
