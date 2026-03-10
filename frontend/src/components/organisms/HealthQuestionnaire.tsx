"use client";

import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import CollapsibleSection from "../molecules/CollapsibleSection";
import SmokingQuestionnaire from "./SmokingQuestionnaire";
import PhysicalActivityQuestionnaire from "./PhysicalActivityQuestionnaire";
import DietQuestionnaire from "./DietQuestionnaire";
import WeightQuestionnaire from "./WeightQuestionnaire";
import SleepQuestionnaire from "./SleepQuestionnaire";
import AlcoholQuestionnaire from "./AlcoholQuestionnaire";
import SubstanceUseQuestionnaire from "./SubstanceUseQuestionnaire";
import BloodPressureQuestionnaire from "./BloodPressureQuestionnaire";
import GlucoseQuestionnaire from "./GlucoseQuestionnaire";
import BloodLipidsQuestionnaire from "./BloodLipidsQuestionnaire";

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
  bloodPressure: {
    systolic: string;
    diastolic: string;
  };
  glucose: {
    hba1c: string;
    fastingGlucose: string;
  };
  bloodLipids: {
    totalCholesterol: string;
    ldlCholesterol: string;
    hdlCholesterol: string;
    triglycerides: string;
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
    bloodPressure: {
      systolic: "",
      diastolic: "",
    },
    glucose: {
      hba1c: "",
      fastingGlucose: "",
    },
    bloodLipids: {
      totalCholesterol: "",
      ldlCholesterol: "",
      hdlCholesterol: "",
      triglycerides: "",
    },
  });

  const handleSmokingChange = (smokingData: QuestionnaireData["smoking"]) => {
    setData((prevData) => ({ ...prevData, smoking: smokingData }));
  };

  const handlePhysicalActivityChange = (
    field: keyof QuestionnaireData["physicalActivity"],
    value: unknown,
  ) => {
    setData((prevData) => ({
      ...prevData,
      physicalActivity: {
        ...prevData.physicalActivity,
        [field]: value,
      },
    }));
  };

  const handleDietChange = (dietData: QuestionnaireData["diet"]) => {
    setData((prevData) => ({ ...prevData, diet: dietData }));
  };

  const handleWeightChange = (weightData: QuestionnaireData["weight"]) => {
    setData((prevData) => ({ ...prevData, weight: weightData }));
  };

  const handleSleepChange = (sleepData: QuestionnaireData["sleep"]) => {
    setData((prevData) => ({ ...prevData, sleep: sleepData }));
  };

  const handleAlcoholChange = (alcoholData: QuestionnaireData["alcohol"]) => {
    setData((prevData) => ({ ...prevData, alcohol: alcoholData }));
  };

  const handleSubstanceUseChange = (
    substanceData: QuestionnaireData["substanceUse"],
  ) => {
    setData((prevData) => ({ ...prevData, substanceUse: substanceData }));
  };

  const handleBloodPressureChange = (
    bloodPressureData: QuestionnaireData["bloodPressure"],
  ) => {
    setData((prevData) => ({ ...prevData, bloodPressure: bloodPressureData }));
  };

  const handleGlucoseChange = (glucoseData: QuestionnaireData["glucose"]) => {
    setData((prevData) => ({ ...prevData, glucose: glucoseData }));
  };

  const handleBloodLipidsChange = (
    bloodLipidsData: QuestionnaireData["bloodLipids"],
  ) => {
    setData((prevData) => ({ ...prevData, bloodLipids: bloodLipidsData }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", data);
    // Handle form submission
  };

  return (
    <div className="flex">
      <SidebarNav activePath="/behandler_skjema" />
      <main className="flex-1 bg-slate-50">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 space-y-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Helseskjema - Levevaner og Målinger
          </h1>

          <CollapsibleSection title="Røyking" defaultOpen={true}>
            <SmokingQuestionnaire
              data={data.smoking}
              onChange={handleSmokingChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Fysisk aktivitet">
            <PhysicalActivityQuestionnaire
              data={data.physicalActivity}
              onChange={handlePhysicalActivityChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Kosthold">
            <DietQuestionnaire data={data.diet} onChange={handleDietChange} />
          </CollapsibleSection>

          <CollapsibleSection title="Overvekt">
            <WeightQuestionnaire
              data={data.weight}
              onChange={handleWeightChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Søvn">
            <SleepQuestionnaire
              data={data.sleep}
              onChange={handleSleepChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Alkoholbruk (AUDIT)">
            <AlcoholQuestionnaire
              data={data.alcohol}
              onChange={handleAlcoholChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Rusmiddelbruk">
            <SubstanceUseQuestionnaire
              data={data.substanceUse}
              onChange={handleSubstanceUseChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Blodtrykk">
            <BloodPressureQuestionnaire
              data={data.bloodPressure}
              onChange={handleBloodPressureChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Glukoseregulering">
            <GlucoseQuestionnaire
              data={data.glucose}
              onChange={handleGlucoseChange}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Blodlipider">
            <BloodLipidsQuestionnaire
              data={data.bloodLipids}
              onChange={handleBloodLipidsChange}
            />
          </CollapsibleSection>

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
      </main>
    </div>
  );
}
