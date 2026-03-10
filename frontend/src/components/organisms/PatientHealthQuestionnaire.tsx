"use client";

import { useState } from "react";
import QuestionWizard from "../molecules/QuestionWizard";
import QuestionRadio from "../molecules/QuestionRadio";
import QuestionNumber from "../molecules/QuestionNumber";
import QuestionTextArea from "../molecules/QuestionTextArea";
import ConditionalQuestion from "../molecules/ConditionalQuestion";

interface PatientHealthData {
  // Røyking
  smoker: string;
  smokingAmount: string;
  smokingMotivated: "ja" | "nei" | "";

  // Fysisk aktivitet
  exerciseFrequency: string;
  exerciseDuration: string;
  exerciseIntensity: string;
  physicalLimitations: "ja" | "nei" | "";
  physicalLimitationsDetails: string;
  exerciseBarriers: "ja" | "nei" | "";
  exerciseBarriersDetails: string;
  exerciseMotivated: "ja" | "nei" | "";

  // Kosthold
  mealsPerDay: string;
  skipMeals: string;
  appetite: string;
  dietMotivated: "ja" | "nei" | "";
  weightStable: string;
  weightChange: string;

  // Vekt
  height: string;
  weight: string;
  waistCircumference: string;

  // Søvn
  difficultyFallingAsleep: "ja" | "nei" | "";
  wakesDuringNight: "ja" | "nei" | "";
  wakesTooEarly: "ja" | "nei" | "";
  poorSleepQuality: "ja" | "nei" | "";
  sleepDayAwakeNight: "ja" | "nei" | "";
  nightShiftWork: "ja" | "nei" | "";
  sleepProblemFrequency: string;
  sleepMedication: "ja" | "nei" | "";
  sleepGuidance: "ja" | "nei" | "";

  // Alkohol
  alcoholFrequency: string;
  alcoholUnitsPerDay: string;
  alcoholBingeDrinking: string;
  alcoholUnableToStop: string;
  alcoholFailedExpectations: string;
  alcoholMorningDrinking: string;
  alcoholGuilt: string;
  alcoholMemoryLoss: string;
  alcoholInjury: string;
  alcoholConcern: string;

  // Rusmidler
  usesSubstances: "ja" | "nei" | "";
  usedOpioidsGHB: "ja" | "nei" | "";
  usedOpioidsGHBRecently: "ja" | "nei" | "";
  usesInjection: "ja" | "nei" | "";
  substanceMotivated: "ja" | "nei" | "";
}

export default function PatientHealthQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PatientHealthData>({
    smoker: "",
    smokingAmount: "",
    smokingMotivated: "",
    exerciseFrequency: "",
    exerciseDuration: "",
    exerciseIntensity: "",
    physicalLimitations: "",
    physicalLimitationsDetails: "",
    exerciseBarriers: "",
    exerciseBarriersDetails: "",
    exerciseMotivated: "",
    mealsPerDay: "",
    skipMeals: "",
    appetite: "",
    dietMotivated: "",
    weightStable: "",
    weightChange: "",
    height: "",
    weight: "",
    waistCircumference: "",
    difficultyFallingAsleep: "",
    wakesDuringNight: "",
    wakesTooEarly: "",
    poorSleepQuality: "",
    sleepDayAwakeNight: "",
    nightShiftWork: "",
    sleepProblemFrequency: "",
    sleepMedication: "",
    sleepGuidance: "",
    alcoholFrequency: "",
    alcoholUnitsPerDay: "",
    alcoholBingeDrinking: "",
    alcoholUnableToStop: "",
    alcoholFailedExpectations: "",
    alcoholMorningDrinking: "",
    alcoholGuilt: "",
    alcoholMemoryLoss: "",
    alcoholInjury: "",
    alcoholConcern: "",
    usesSubstances: "",
    usedOpioidsGHB: "",
    usedOpioidsGHBRecently: "",
    usesInjection: "",
    substanceMotivated: "",
  });

  const updateData = (field: keyof PatientHealthData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const questions = [
    // Røyking
    <QuestionRadio
      key="smoker"
      question="Røyker du fast?"
      name="patient-smoker"
      options={[
        { value: "ja", label: "Ja" },
        { value: "nei", label: "Nei" },
      ]}
      value={data.smoker}
      onChange={(value) => updateData("smoker", value)}
    />,

    // Conditional: hvis røyker
    ...(data.smoker === "ja"
      ? [
          <QuestionTextArea
            key="smoking-amount"
            question="Hvor mye røyker du?"
            name="patient-smoking-amount"
            value={data.smokingAmount}
            onChange={(value) => updateData("smokingAmount", value)}
            placeholder="F.eks. 10 sigaretter per dag"
            rows={2}
          />,
          <ConditionalQuestion
            key="smoking-motivated"
            question="Er du motivert til å slutte med røyking dersom du får hjelp til dette?"
            name="patient-smoking-motivated"
            value={data.smokingMotivated}
            onChange={(value) => updateData("smokingMotivated", value)}
          />,
        ]
      : []),

    // Fysisk aktivitet
    <QuestionRadio
      key="exercise-frequency"
      question="Hvor ofte trener du?"
      name="patient-exercise-frequency"
      options={[
        {
          value: "nesten-aldri",
          label: "Nesten aldri eller mindre enn en gang i uka",
        },
        { value: "en-gang", label: "En gang i uka" },
        { value: "2-3-ganger", label: "2-3 ganger i uka" },
        { value: "nesten-hver-dag", label: "Nesten hver dag" },
      ]}
      value={data.exerciseFrequency}
      onChange={(value) => updateData("exerciseFrequency", value)}
    />,

    <QuestionRadio
      key="exercise-duration"
      question="Hvor lenge trener du hver gang?"
      name="patient-exercise-duration"
      options={[
        { value: "15min", label: "Rundt 15 minutter" },
        { value: "30min", label: "Rundt 30 minutter" },
        { value: "30min-plus", label: "30 minutter eller mer" },
      ]}
      value={data.exerciseDuration}
      onChange={(value) => updateData("exerciseDuration", value)}
    />,

    <QuestionRadio
      key="exercise-intensity"
      question="Hvor hardt trener du?"
      name="patient-exercise-intensity"
      options={[
        {
          value: "rolig",
          label: "Jeg tar det med ro og blir ikke andpusten eller svett",
        },
        { value: "moderat", label: "Jeg blir litt andpusten og svett" },
        { value: "hardt", label: "Jeg tar det helt ut" },
      ]}
      value={data.exerciseIntensity}
      onChange={(value) => updateData("exerciseIntensity", value)}
    />,

    <ConditionalQuestion
      key="physical-limitations"
      question="Har du noen fysiske begrensninger som påvirker dine muligheter til trening?"
      name="patient-physical-limitations"
      value={data.physicalLimitations}
      onChange={(value) => updateData("physicalLimitations", value)}
    >
      <QuestionTextArea
        question="Skriv om begrensninger"
        name="patient-physical-limitations-details"
        value={data.physicalLimitationsDetails}
        onChange={(value) => updateData("physicalLimitationsDetails", value)}
        placeholder="Beskriv dine fysiske begrensninger..."
        rows={3}
      />
    </ConditionalQuestion>,

    <ConditionalQuestion
      key="exercise-barriers"
      question="Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?"
      name="patient-exercise-barriers"
      value={data.exerciseBarriers}
      onChange={(value) => updateData("exerciseBarriers", value)}
    >
      <QuestionTextArea
        question="Skriv litt om dette"
        name="patient-exercise-barriers-details"
        value={data.exerciseBarriersDetails}
        onChange={(value) => updateData("exerciseBarriersDetails", value)}
        placeholder="Beskriv barrierer..."
        rows={3}
      />
    </ConditionalQuestion>,

    <QuestionRadio
      key="exercise-motivated"
      question="Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?"
      name="patient-exercise-motivated"
      options={[
        { value: "ja", label: "Ja" },
        { value: "nei", label: "Nei" },
      ]}
      value={data.exerciseMotivated}
      onChange={(value) => updateData("exerciseMotivated", value)}
    />,

    // Kosthold
    <QuestionRadio
      key="meals-per-day"
      question="Hvor mange måltider spiser du per dag?"
      name="patient-meals-per-day"
      options={[
        { value: "1-2", label: "1-2 måltider" },
        { value: "3", label: "3 måltider" },
        { value: "4-5", label: "4-5 måltider" },
        { value: "6-plus", label: "6 eller flere måltider" },
      ]}
      value={data.mealsPerDay}
      onChange={(value) => updateData("mealsPerDay", value)}
    />,

    <QuestionRadio
      key="skip-meals"
      question="Hvor ofte hopper du over måltider?"
      name="patient-skip-meals"
      options={[
        { value: "aldri", label: "Aldri" },
        { value: "sjelden", label: "Sjelden" },
        { value: "noen-ganger", label: "Noen ganger i uken" },
        { value: "ofte", label: "Ofte" },
      ]}
      value={data.skipMeals}
      onChange={(value) => updateData("skipMeals", value)}
    />,

    <QuestionRadio
      key="appetite"
      question="Hvordan vil du beskrive appetitten din?"
      name="patient-appetite"
      options={[
        { value: "dårlig", label: "Dårlig" },
        { value: "normal", label: "Normal" },
        { value: "god", label: "God" },
        { value: "veldig-god", label: "Veldig god" },
      ]}
      value={data.appetite}
      onChange={(value) => updateData("appetite", value)}
    />,

    <ConditionalQuestion
      key="diet-motivated"
      question="Er du motivert til å forbedre kostholdet ditt?"
      name="patient-diet-motivated"
      value={data.dietMotivated}
      onChange={(value) => updateData("dietMotivated", value)}
    />,

    <QuestionRadio
      key="weight-stable"
      question="Har vekten din vært stabil det siste året?"
      name="patient-weight-stable"
      options={[
        { value: "ja", label: "Ja" },
        { value: "nei-okt", label: "Nei, den har økt" },
        { value: "nei-minsket", label: "Nei, den har minsket" },
      ]}
      value={data.weightStable}
      onChange={(value) => updateData("weightStable", value)}
    />,

    ...(data.weightStable.startsWith("nei")
      ? [
          <QuestionTextArea
            key="weight-change"
            question="Hvor mye har vekten din endret seg?"
            name="patient-weight-change"
            value={data.weightChange}
            onChange={(value) => updateData("weightChange", value)}
            placeholder="F.eks. økt 5 kg siste 6 måneder"
            rows={2}
          />,
        ]
      : []),

    // Vekt
    <QuestionNumber
      key="height"
      question="Hvor høy er du?"
      name="patient-height"
      value={data.height}
      onChange={(value) => updateData("height", value)}
      placeholder="170"
      unit="cm"
    />,

    <QuestionNumber
      key="weight"
      question="Hvor mye veier du?"
      name="patient-weight"
      value={data.weight}
      onChange={(value) => updateData("weight", value)}
      placeholder="70"
      unit="kg"
    />,

    <QuestionNumber
      key="waist"
      question="Hva er din livvidde?"
      name="patient-waist"
      value={data.waistCircumference}
      onChange={(value) => updateData("waistCircumference", value)}
      placeholder="80"
      unit="cm"
    />,

    // Søvn
    <ConditionalQuestion
      key="difficulty-falling-asleep"
      question="Er det vanskelig for deg å sovne om kvelden?"
      name="patient-difficulty-falling-asleep"
      value={data.difficultyFallingAsleep}
      onChange={(value) => updateData("difficultyFallingAsleep", value)}
    />,

    <ConditionalQuestion
      key="wakes-during-night"
      question="Våkner du flere ganger i løpet av natten?"
      name="patient-wakes-during-night"
      value={data.wakesDuringNight}
      onChange={(value) => updateData("wakesDuringNight", value)}
    />,

    <ConditionalQuestion
      key="wakes-too-early"
      question="Våkner du for tidlig om morgenen?"
      name="patient-wakes-too-early"
      value={data.wakesTooEarly}
      onChange={(value) => updateData("wakesTooEarly", value)}
    />,

    <ConditionalQuestion
      key="poor-sleep-quality"
      question="Synes du selv at du sover for dårlig?"
      name="patient-poor-sleep-quality"
      value={data.poorSleepQuality}
      onChange={(value) => updateData("poorSleepQuality", value)}
    />,

    <ConditionalQuestion
      key="sleep-day-awake-night"
      question="Sover du om dagen og er våken om natten?"
      name="patient-sleep-day-awake-night"
      value={data.sleepDayAwakeNight}
      onChange={(value) => updateData("sleepDayAwakeNight", value)}
    >
      <ConditionalQuestion
        question="Jobber du nattskift?"
        name="patient-night-shift"
        value={data.nightShiftWork}
        onChange={(value) => updateData("nightShiftWork", value)}
      />
    </ConditionalQuestion>,

    <QuestionRadio
      key="sleep-problem-frequency"
      question="Hvor ofte har du problemer med søvn?"
      name="patient-sleep-problem-frequency"
      options={[
        { value: "aldri", label: "Aldri" },
        { value: "sjelden", label: "Sjelden" },
        { value: "1-2-uker", label: "1-2 ganger per uke" },
        { value: "3-5-uker", label: "3-5 ganger per uke" },
        { value: "hver-natt", label: "Hver natt" },
      ]}
      value={data.sleepProblemFrequency}
      onChange={(value) => updateData("sleepProblemFrequency", value)}
    />,

    <ConditionalQuestion
      key="sleep-medication"
      question="Tar du sovemedisin?"
      name="patient-sleep-medication"
      value={data.sleepMedication}
      onChange={(value) => updateData("sleepMedication", value)}
    />,

    <ConditionalQuestion
      key="sleep-guidance"
      question="Ønsker du veiledning om søvn?"
      name="patient-sleep-guidance"
      value={data.sleepGuidance}
      onChange={(value) => updateData("sleepGuidance", value)}
    />,

    // Alkohol (AUDIT)
    <QuestionRadio
      key="alcohol-frequency"
      question="Hvor ofte drikker du alkohol?"
      name="patient-alcohol-frequency"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Månedlig eller sjeldnere" },
        { value: "2", label: "2-4 ganger i måneden" },
        { value: "3", label: "2-3 ganger i uken" },
        { value: "4", label: "4 eller flere ganger i uken" },
      ]}
      value={data.alcoholFrequency}
      onChange={(value) => updateData("alcoholFrequency", value)}
    />,

    <QuestionRadio
      key="alcohol-units"
      question="Hvor mange enheter drikker du på en typisk dag når du drikker?"
      name="patient-alcohol-units"
      options={[
        { value: "0", label: "1-2" },
        { value: "1", label: "3-4" },
        { value: "2", label: "5-6" },
        { value: "3", label: "7-9" },
        { value: "4", label: "10 eller flere" },
      ]}
      value={data.alcoholUnitsPerDay}
      onChange={(value) => updateData("alcoholUnitsPerDay", value)}
    />,

    <QuestionRadio
      key="alcohol-binge"
      question="Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?"
      name="patient-alcohol-binge"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholBingeDrinking}
      onChange={(value) => updateData("alcoholBingeDrinking", value)}
    />,

    <QuestionRadio
      key="alcohol-unable-to-stop"
      question="Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?"
      name="patient-alcohol-unable-to-stop"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholUnableToStop}
      onChange={(value) => updateData("alcoholUnableToStop", value)}
    />,

    <QuestionRadio
      key="alcohol-failed-expectations"
      question="Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?"
      name="patient-alcohol-failed-expectations"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholFailedExpectations}
      onChange={(value) => updateData("alcoholFailedExpectations", value)}
    />,

    <QuestionRadio
      key="alcohol-morning-drinking"
      question="Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?"
      name="patient-alcohol-morning"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholMorningDrinking}
      onChange={(value) => updateData("alcoholMorningDrinking", value)}
    />,

    <QuestionRadio
      key="alcohol-guilt"
      question="Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?"
      name="patient-alcohol-guilt"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholGuilt}
      onChange={(value) => updateData("alcoholGuilt", value)}
    />,

    <QuestionRadio
      key="alcohol-memory-loss"
      question="Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?"
      name="patient-alcohol-memory"
      options={[
        { value: "0", label: "Aldri" },
        { value: "1", label: "Sjeldnere enn månedlig" },
        { value: "2", label: "Månedlig" },
        { value: "3", label: "Ukentlig" },
        { value: "4", label: "Daglig eller nesten daglig" },
      ]}
      value={data.alcoholMemoryLoss}
      onChange={(value) => updateData("alcoholMemoryLoss", value)}
    />,

    <QuestionRadio
      key="alcohol-injury"
      question="Har du eller noen andre blitt skadet som følge av at du hadde drukket?"
      name="patient-alcohol-injury"
      options={[
        { value: "0", label: "Nei" },
        { value: "2", label: "Ja, men ikke i løpet av det siste året" },
        { value: "4", label: "Ja, i løpet av det siste året" },
      ]}
      value={data.alcoholInjury}
      onChange={(value) => updateData("alcoholInjury", value)}
    />,

    <QuestionRadio
      key="alcohol-concern"
      question="Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?"
      name="patient-alcohol-concern"
      options={[
        { value: "0", label: "Nei" },
        { value: "2", label: "Ja, men ikke i løpet av det siste året" },
        { value: "4", label: "Ja, i løpet av det siste året" },
      ]}
      value={data.alcoholConcern}
      onChange={(value) => updateData("alcoholConcern", value)}
    />,

    // Rusmidler
    <ConditionalQuestion
      key="uses-substances"
      question="Bruker du rusmidler?"
      name="patient-uses-substances"
      value={data.usesSubstances}
      onChange={(value) => updateData("usesSubstances", value)}
    />,

    ...(data.usesSubstances === "ja"
      ? [
          <ConditionalQuestion
            key="used-opioids-ghb"
            question="Har du noen gang brukt opioider eller GHB?"
            name="patient-used-opioids-ghb"
            value={data.usedOpioidsGHB}
            onChange={(value) => updateData("usedOpioidsGHB", value)}
          />,

          <ConditionalQuestion
            key="used-opioids-recently"
            question="Har du brukt opioider eller GHB i det siste?"
            name="patient-used-opioids-recently"
            value={data.usedOpioidsGHBRecently}
            onChange={(value) => updateData("usedOpioidsGHBRecently", value)}
          />,

          <ConditionalQuestion
            key="uses-injection"
            question="Bruker du sprøyte?"
            name="patient-uses-injection"
            value={data.usesInjection}
            onChange={(value) => updateData("usesInjection", value)}
          />,

          <ConditionalQuestion
            key="substance-motivated"
            question="Er du motivert til å slutte med rusmidler?"
            name="patient-substance-motivated"
            value={data.substanceMotivated}
            onChange={(value) => updateData("substanceMotivated", value)}
          />,
        ]
      : []),
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Patient health data:", data);
    // Handle form submission
    alert("Skjema sendt inn!");
  };

  return (
    <div className="flex">
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Helseskjema
          </h1>

          <QuestionWizard
            currentStep={currentStep}
            totalSteps={questions.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
          >
            {questions[currentStep]}
          </QuestionWizard>
        </div>
      </main>
    </div>
  );
}
