"use client";

import QuestionRadio from "../molecules/QuestionRadio";
import ConditionalQuestion from "../molecules/ConditionalQuestion";

interface SleepData {
  difficultyFallingAsleep: "ja" | "nei" | "";
  wakesDuringNight: "ja" | "nei" | "";
  wakesTooEarly: "ja" | "nei" | "";
  poorSleepQuality: "ja" | "nei" | "";
  sleepDayAwakeNight: "ja" | "nei" | "";
  nightShiftWork: "ja" | "nei" | "";
  problemFrequency: string;
  takesMedication: "ja" | "nei" | "";
  wantsGuidance: "ja" | "nei" | "";
}

interface SleepQuestionnaireProps {
  data: SleepData;
  onChange: (data: SleepData) => void;
}

export default function SleepQuestionnaire({
  data,
  onChange,
}: SleepQuestionnaireProps) {
  const updateData = (field: keyof SleepData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6">
      <ConditionalQuestion
        question="Er det vanskelig for pasienten å sovne om kvelden?"
        name="difficulty-falling-asleep"
        value={data.difficultyFallingAsleep}
        onChange={(value) => updateData("difficultyFallingAsleep", value)}
      />

      <ConditionalQuestion
        question="Våkner pasienten flere ganger i løpet av natten?"
        name="wakes-during-night"
        value={data.wakesDuringNight}
        onChange={(value) => updateData("wakesDuringNight", value)}
      />

      <ConditionalQuestion
        question="Våkner pasienten for tidlig om morgenen?"
        name="wakes-too-early"
        value={data.wakesTooEarly}
        onChange={(value) => updateData("wakesTooEarly", value)}
      />

      <ConditionalQuestion
        question="Synes pasienten selv at hen sover for dårlig?"
        name="poor-sleep-quality"
        value={data.poorSleepQuality}
        onChange={(value) => updateData("poorSleepQuality", value)}
      />

      <ConditionalQuestion
        question="Sover pasienten om dagen og er våken om natten?"
        name="sleep-day-awake-night"
        value={data.sleepDayAwakeNight}
        onChange={(value) => updateData("sleepDayAwakeNight", value)}
      >
        <ConditionalQuestion
          question="Jobber pasienten nattskift?"
          name="night-shift-work"
          value={data.nightShiftWork}
          onChange={(value) => updateData("nightShiftWork", value)}
        />
      </ConditionalQuestion>

      <QuestionRadio
        question="Hvor ofte har pasienten problemer med søvn?"
        name="problem-frequency"
        options={[
          { value: "less-than-3", label: "< 3 ganger i uka" },
          { value: "3-or-more", label: "3 dager eller fler i uka" },
        ]}
        value={data.problemFrequency}
        onChange={(value) => updateData("problemFrequency", value)}
      />

      {data.problemFrequency === "3-or-more" && (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-brand-sun text-sm text-gray-700">
          <p className="font-medium">
            Merk: 3 dager eller fler med problemer kan indikere insomni.
          </p>
        </div>
      )}

      <ConditionalQuestion
        question="Tar pasienten medisiner for å sove?"
        name="takes-medication"
        value={data.takesMedication}
        onChange={(value) => updateData("takesMedication", value)}
      />

      <ConditionalQuestion
        question="Ønsker pasienten veiledning for bedre søvn?"
        name="wants-guidance"
        value={data.wantsGuidance}
        onChange={(value) => updateData("wantsGuidance", value)}
      />
    </div>
  );
}
