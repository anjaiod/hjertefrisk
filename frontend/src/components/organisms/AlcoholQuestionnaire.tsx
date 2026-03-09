"use client";

import QuestionRadio from "../molecules/QuestionRadio";

interface AlcoholData {
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
}

interface AlcoholQuestionnaireProps {
  data: AlcoholData;
  onChange: (data: AlcoholData) => void;
}

export default function AlcoholQuestionnaire({
  data,
  onChange,
}: AlcoholQuestionnaireProps) {
  const updateData = (field: keyof AlcoholData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-navy">
        Alkoholbruk (AUDIT)
      </h2>

      <QuestionRadio
        question="1. Hvor ofte drikker pasienten alkohol?"
        name="frequency"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Månedlig eller sjeldnere" },
          { value: "2", label: "2-4 ganger i måneden" },
          { value: "3", label: "2-3 ganger i uken" },
          { value: "4", label: "4 eller flere ganger i uken" },
        ]}
        value={data.frequency}
        onChange={(value) => updateData("frequency", value)}
        required
      />

      <QuestionRadio
        question="2. Hvor mange enheter drikker pasienten på en typisk dag når hen drikker?"
        name="units-per-day"
        options={[
          { value: "0", label: "1-2" },
          { value: "1", label: "3-4" },
          { value: "2", label: "5-6" },
          { value: "3", label: "7-9" },
          { value: "4", label: "10 eller flere" },
        ]}
        value={data.unitsPerDay}
        onChange={(value) => updateData("unitsPerDay", value)}
        required
      />

      <QuestionRadio
        question="3. Hvor ofte drikker pasienten 6 eller flere enheter ved en og samme anledning?"
        name="binge-drinking"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.bingeDrinking}
        onChange={(value) => updateData("bingeDrinking", value)}
        required
      />

      <QuestionRadio
        question="4. Hvor ofte i løpet av det siste året har pasienten opplevd at hen ikke klarte å stoppe å drikke når hen først hadde begynt?"
        name="unable-to-stop"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.unableToStop}
        onChange={(value) => updateData("unableToStop", value)}
        required
      />

      <QuestionRadio
        question="5. Hvor ofte i løpet av det siste året har pasienten latt være å gjøre det som normalt forventes av hen på grunn av drikking?"
        name="failed-expectations"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.failedExpectations}
        onChange={(value) => updateData("failedExpectations", value)}
        required
      />

      <QuestionRadio
        question="6. Hvor ofte i løpet av det siste året har pasienten hatt behov for å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?"
        name="morning-drinking"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.morningDrinking}
        onChange={(value) => updateData("morningDrinking", value)}
        required
      />

      <QuestionRadio
        question="7. Hvor ofte i løpet av det siste året har pasienten hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?"
        name="guilt"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.guilt}
        onChange={(value) => updateData("guilt", value)}
        required
      />

      <QuestionRadio
        question="8. Hvor ofte i løpet av det siste året har pasienten vært ute av stand til å huske hva som skjedde kvelden før fordi hen hadde drukket?"
        name="memory-loss"
        options={[
          { value: "0", label: "Aldri" },
          { value: "1", label: "Sjeldnere enn månedlig" },
          { value: "2", label: "Månedlig" },
          { value: "3", label: "Ukentlig" },
          { value: "4", label: "Daglig eller nesten daglig" },
        ]}
        value={data.memoryLoss}
        onChange={(value) => updateData("memoryLoss", value)}
        required
      />

      <QuestionRadio
        question="9. Har pasienten eller noen andre blitt skadet som følge av at pasienten hadde drukket?"
        name="injury"
        options={[
          { value: "0", label: "Nei" },
          { value: "2", label: "Ja, men ikke i løpet av det siste året" },
          { value: "4", label: "Ja, i løpet av det siste året" },
        ]}
        value={data.injuryDueToAlcohol}
        onChange={(value) => updateData("injuryDueToAlcohol", value)}
        required
      />

      <QuestionRadio
        question="10. Har noen i pasientens familie, en venn, en lege eller annet helsepersonell vært bekymret for pasientens drikking eller foreslått at hen burde trappe ned?"
        name="concern"
        options={[
          { value: "0", label: "Nei" },
          { value: "2", label: "Ja, men ikke i løpet av det siste året" },
          { value: "4", label: "Ja, i løpet av det siste året" },
        ]}
        value={data.concernFromOthers}
        onChange={(value) => updateData("concernFromOthers", value)}
        required
      />
    </div>
  );
}
