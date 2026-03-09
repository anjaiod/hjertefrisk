"use client";

import { useState } from "react";
import SmokingQuestionnaire from "./SmokingQuestionnaire";
import PhysicalActivityQuestionnaire from "./PhysicalActivityQuestionnaire";
import DietQuestionnaire from "./DietQuestionnaire";
import WeightQuestionnaire from "./WeightQuestionnaire";
import SleepQuestionnaire from "./SleepQuestionnaire";
import AlcoholQuestionnaire from "./AlcoholQuestionnaire";
import SubstanceUseQuestionnaire from "./SubstanceUseQuestionnaire";

interface QuestionnaireData {
  smoking: {
    smoker: string;
    amount: string;
    motivated: "ja" | "nei" | "";
  };
  physicalActivity: {
    frequency: string;
    duration: string;
    intensity: string;
    physicalLimitations: "ja" | "nei" | "";
    physicalLimitationsDetails: string;
    otherBarriers: "ja" | "nei" | "";
    otherBarriersDetails: string;
    motivated: "ja" | "nei" | "";
  };
  diet: {
    mealsPerDay: string;
    skipMeals: string;
    appetite: string;
    motivatedToImprove: "ja" | "nei" | "";
    weightStable: string;
    weightChange: string;
  };
  weight: {
    height: string;
    weight: string;
    waistCircumference: string;
  };
  sleep: {
    difficultyFallingAsleep: "ja" | "nei" | "";
    wakesDuringNight: "ja" | "nei" | "";
    wakesTooEarly: "ja" | "nei" | "";
    poorSleepQuality: "ja" | "nei" | "";
    sleepDayAwakeNight: "ja" | "nei" | "";
    nightShiftWork: "ja" | "nei" | "";
    problemFrequency: string;
    takesMedication: "ja" | "nei" | "";
    wantsGuidance: "ja" | "nei" | "";
  };
  alcohol: {
    frequency: string;
    unitsPerDay: string;
    bingeDrinking: string;
    unableToStop: string;
    failedExpectations: string;
    morningDrinking: string;
    guilt: string;
    memoryLoss: string;
    injuryDueToAlcohol: string;
    concernFromOthers: string;
  };
  substanceUse: {
    usesSubstances: "ja" | "nei" | "";
    usedOpioidsGHB: "ja" | "nei" | "";
    usedOpioidsGHBRecently: "ja" | "nei" | "";
    usesInjection: "ja" | "nei" | "";
    motivatedToQuit: "ja" | "nei" | "";
  };
}

export default function HealthQuestionnaire() {
  const [data, setData] = useState<QuestionnaireData>({
    smoking: {
      smoker: "",
      amount: "",
      motivated: "",
    },
    physicalActivity: {
      frequency: "",
      duration: "",
      intensity: "",
      physicalLimitations: "",
      physicalLimitationsDetails: "",
      otherBarriers: "",
      otherBarriersDetails: "",
      motivated: "",
    },
    diet: {
      mealsPerDay: "",
      skipMeals: "",
      appetite: "",
      motivatedToImprove: "",
      weightStable: "",
      weightChange: "",
    },
    weight: {
      height: "",
      weight: "",
      waistCircumference: "",
    },
    sleep: {
      difficultyFallingAsleep: "",
      wakesDuringNight: "",
      wakesTooEarly: "",
      poorSleepQuality: "",
      sleepDayAwakeNight: "",
      nightShiftWork: "",
      problemFrequency: "",
      takesMedication: "",
      wantsGuidance: "",
    },
    alcohol: {
      frequency: "",
      unitsPerDay: "",
      bingeDrinking: "",
      unableToStop: "",
      failedExpectations: "",
      morningDrinking: "",
      guilt: "",
      memoryLoss: "",
      injuryDueToAlcohol: "",
      concernFromOthers: "",
    },
    substanceUse: {
      usesSubstances: "",
      usedOpioidsGHB: "",
      usedOpioidsGHBRecently: "",
      usesInjection: "",
      motivatedToQuit: "",
    },
  });

  const handleSmokingChange = (smokingData: QuestionnaireData["smoking"]) => {
    setData({ ...data, smoking: smokingData });
  };

  const handlePhysicalActivityChange = (
    activityData: QuestionnaireData["physicalActivity"],
  ) => {
    setData({ ...data, physicalActivity: activityData });
  };

  const handleDietChange = (dietData: QuestionnaireData["diet"]) => {
    setData({ ...data, diet: dietData });
  };

  const handleWeightChange = (weightData: QuestionnaireData["weight"]) => {
    setData({ ...data, weight: weightData });
  };

  const handleSleepChange = (sleepData: QuestionnaireData["sleep"]) => {
    setData({ ...data, sleep: sleepData });
  };

  const handleAlcoholChange = (alcoholData: QuestionnaireData["alcohol"]) => {
    setData({ ...data, alcohol: alcoholData });
  };

  const handleSubstanceUseChange = (
    substanceData: QuestionnaireData["substanceUse"],
  ) => {
    setData({ ...data, substanceUse: substanceData });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Helseskjema - Levevaner
      </h1>

      <SmokingQuestionnaire
        data={data.smoking}
        onChange={handleSmokingChange}
      />

      <PhysicalActivityQuestionnaire
        data={data.physicalActivity}
        onChange={handlePhysicalActivityChange}
      />

      <DietQuestionnaire data={data.diet} onChange={handleDietChange} />

      <WeightQuestionnaire data={data.weight} onChange={handleWeightChange} />

      <SleepQuestionnaire data={data.sleep} onChange={handleSleepChange} />

      <AlcoholQuestionnaire
        data={data.alcohol}
        onChange={handleAlcoholChange}
      />

      <SubstanceUseQuestionnaire
        data={data.substanceUse}
        onChange={handleSubstanceUseChange}
      />

      <div className="flex gap-4 justify-end pt-6">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Avbryt
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90"
        >
          Send inn
        </button>
      </div>
    </form>
  );
}
