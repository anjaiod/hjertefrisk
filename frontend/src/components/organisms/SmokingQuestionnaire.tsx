"use client";

import { useState } from "react";
import QuestionRadio from "../molecules/QuestionRadio";
import ConditionalQuestion from "../molecules/ConditionalQuestion";
import QuestionTextArea from "../molecules/QuestionTextArea";

interface SmokingData {
  smoker: string;
  amount: string;
  motivated: "ja" | "nei" | "";
}

interface SmokingQuestionnaireProps {
  data: SmokingData;
  onChange: (data: SmokingData) => void;
}

export default function SmokingQuestionnaire({
  data,
  onChange,
}: SmokingQuestionnaireProps) {
  const updateData = (field: keyof SmokingData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-navy">Røyking</h2>

      <QuestionRadio
        question="Røyker pasienten fast?"
        name="smoker"
        options={[
          { value: "ja", label: "Ja" },
          { value: "nei", label: "Nei" },
        ]}
        value={data.smoker}
        onChange={(value) => updateData("smoker", value)}
        required
      />

      {data.smoker === "ja" && (
        <div className="ml-6 mt-4 border-l-2 border-brand-sky pl-4 space-y-4">
          <QuestionTextArea
            question="Hvor mye røyker pasienten?"
            name="amount"
            value={data.amount}
            onChange={(value) => updateData("amount", value)}
            placeholder="F.eks. 10 sigaretter per dag"
          />

          <ConditionalQuestion
            question="Er pasienten motivert til å slutte med røyking dersom du får hjelp til dette?"
            name="motivated"
            value={data.motivated}
            onChange={(value) => updateData("motivated", value)}
          />
        </div>
      )}
    </div>
  );
}
