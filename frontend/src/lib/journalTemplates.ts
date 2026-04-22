import type { JournalNoteType } from "@/types";

export type JournalTemplate = {
  id: string;
  label: string;
  content: string;
};

function line(label: string) {
  return `<p>${label}</p>`;
}

const G = "#9ca3af"; // grey for hint text

function field(label: string) {
  return `<li><strong>${label}:</strong> </li>`;
}

function hint(label: string, hintText: string) {
  return `<li><strong>${label}:</strong> <span style="color:${G};font-style:italic">${hintText}</span></li>`;
}

function nb(text: string) {
  return `<p><em style="color:${G}">NB: ${text}</em></p>`;
}

const TEMPLATES: Record<JournalNoteType, JournalTemplate[]> = {
  JournalNotat: [
    {
      id: "hjertefrisk-kardiometabolsk",
      label: "Hjertefrisk – Kardiometabolsk risikovurdering",
      content: [
        `<h2>Hjertefrisk – Kardiometabolsk risikovurdering</h2>`,

        `<h3>Pasientinformasjon</h3>`,
        `<ul>`,
        field("Aktuell diagnose / diagnoser"),
        field("Aktuell antipsykotisk medikasjon"),
        `</ul>`,

        `<h3>1. Røyking</h3>`,
        `<ul>`,
        hint("Status", "≥1 sigarett daglig = faresone"),
        hint(
          "Tiltak iverksatt",
          "Råd/veiledning, minimal intervensjon, motivasjonsstøtte, legemiddel",
        ),
        hint("Mål", "Røykeslutt"),
        field("Henvist frisklivssentral / slutta.no"),
        `</ul>`,

        `<h3>2. Overvekt og livsstil</h3>`,
        `<ul>`,
        field("Vekt (kg)"),
        field("Høyde (cm)"),
        hint("KMI (kg/m²)", "Overvekt: 25–29,9 | Fedme: ≥30 – faresone"),
        hint("Livvidde (cm)", "Faresone: ≥102 cm menn / ≥88 cm kvinner"),
        hint(
          "Endring siden sist",
          "Vektøkning >3–4 kg / 3 mnd eller livviddeøkning 5 cm = faresone",
        ),
        hint("Fysisk aktivitet", "Inaktiv livsstil = faresone"),
        hint("Kosthold", "Uheldig kosthold = faresone"),
        hint(
          "Tiltak iverksatt",
          "Fysisk aktivitet, kostholdsråd (Predimed), frisklivssentral",
        ),
        hint("Mål", "5 % nedgang i vekt som vedlikeholdes"),
        hint(
          "Henvist sykehus ved sykelig overvekt",
          "KMI ≥40 eller KMI ≥35 + komorbiditet",
        ),
        `</ul>`,

        `<h3>3. Blodtrykk</h3>`,
        `<ul>`,
        hint("BT (mmHg)", "Faresone: ≥140 systolisk og/eller ≥90 diastolisk"),
        field("Antall målinger tatt"),
        hint(
          "Tiltak iverksatt",
          "Redusert saltinntak, fysisk aktivitet, kosthold, antihypertensiva",
        ),
        hint("Mål", "&lt;140/90 mmHg"),
        `</ul>`,
        nb("BT ≥160/100 – antihypertensiva skal gis"),

        `<h3>4. Glukoseregulering</h3>`,
        `<ul>`,
        hint("HbA1c (mmol/mol)", "Faresone: ≥48 mmol/mol"),
        field("Fastende/ikke-fastende prøve"),
        hint(
          "Tiltak iverksatt",
          "Livsstilsendringer, vurdert metformin (vanligvis ved fastlege)",
        ),
        hint("Mål", "HbA1c ≤53 mmol/mol, individuell utforming"),
        `</ul>`,
        nb(
          "Ved overvekt og utilstrekkelig effekt av metformin – velg tilleggsmedisin som ikke øker vekten",
        ),

        `<h3>5. Blodlipider</h3>`,
        `<ul>`,
        hint("Totalkolesterol (mmol/l)", "Faresone: ≥7,0 mmol/l"),
        field("LDL-kolesterol (mmol/l)"),
        field("HDL-kolesterol (mmol/l)"),
        hint("Triglyserider (mmol/l)", "Henvis spesialist ved TG ≥10 mmol/l"),
        hint(
          "Tiltak iverksatt",
          "Revidert medikasjon, livsstilsendringer, statinbehandling vurdert",
        ),
        hint("Mål – primærprevensjon", "&gt;30 % nedgang i LDL-kolesterol"),
        hint("Mål – ved HKS", "LDL &lt;1,8 mmol/l"),
        hint("Mål – ved DM (uten HKS)", "LDL &lt;2,5 mmol/l"),
        `</ul>`,
        nb("Atorvastatin 20–80 mg ved HKS og definerte høyrisikogrupper"),

        `<h3>Medikamentvurdering</h3>`,
        `<ul>`,
        field(
          "Er det gjort vurdering av antipsykotika opp mot somatisk risiko",
        ),
        hint("Rask vektøkning etter oppstart", "≥3–4 kg &lt;3 mnd"),
        hint("Rask forverring av lipider, BT eller blodsukker", "&lt;3 mnd"),
        field("Vurdering og evt. planlagte endringer"),
        `</ul>`,

        `<h3>Samarbeid og plan</h3>`,
        `<ul>`,
        field("Fastlege informert / involvert"),
        field("Henvist indremedisiner / annen spesialist"),
        field("Plan og tiltak"),
        field("Neste kontroll"),
        `</ul>`,
      ].join(""),
    },
    {
      id: "hjertefrisk-oppstart-antipsykotika",
      label: "Hjertefrisk – Oppstart/endring av antipsykotika",
      content: [
        `<h2>Hjertefrisk – Anamneseopptak og undersøkelse ved oppstart/endring av antipsykotika</h2>`,

        `<h3>Pasientinformasjon</h3>`,
        `<ul>`,
        field("Aktuelt antipsykotikum / endring"),
        field("Årsak til oppstart / endring"),
        `</ul>`,

        `<h3>Anamnese</h3>`,
        `<ul>`,
        hint("Vekthistorie", "Spør særlig om rask økning: ≥3–4 kg innen 3 mnd"),
        field("Røyking"),
        field("Fysisk aktivitet"),
        field("Kosthold"),
        hint(
          "Familiehistorie",
          "Diabetes, fedme, hjertekarsykdom hos 1.-gradsslektninger &lt;55 år (menn) / &lt;65 år (kvinner)",
        ),
        field("Svangerskapsdiabetes"),
        field("Etnisitet"),
        field("Reseptfrie eller alternative medisiner"),
        field("Symptomer på søvnapné"),
        `</ul>`,

        `<h3>Somatisk status</h3>`,
        `<ul>`,
        field("Vekt (kg)"),
        field("Høyde (cm)"),
        field("KMI (kg/m²)"),
        field("Livvidde (cm)"),
        field("Blodtrykk (mmHg)"),
        field("Puls (slag/min)"),
        `</ul>`,

        `<h3>Blodprøver</h3>`,
        `<ul>`,
        field("HbA1c (mmol/mol)"),
        field("Totalkolesterol (mmol/l)"),
        field("LDL-kolesterol (mmol/l)"),
        field("HDL-kolesterol (mmol/l)"),
        hint(
          "Triglyserider (mmol/l)",
          "Fastende prøver kreves dersom TG &gt;5 mmol/l",
        ),
        field("Fastende / ikke-fastende prøve"),
        `</ul>`,

        `<h3>EKG</h3>`,
        `<ul>`,
        hint(
          "EKG tatt",
          "Bør tas før oppstart. Viktig ved hjertesykdom eller familiær hjertesykdom",
        ),
        field("Funn / vurdering"),
        `</ul>`,
        nb("Visse antipsykotika har økt risiko for arytmi – sjekk preparat."),

        `<h3>Kronisk nyrelidelse <span style="color:${G};font-weight:normal">(undersøkes ved risikofaktorer)</span></h3>`,
        `<p style="color:${G}"><em>Risikofaktorer: diabetes, hypertensjon, HKS, nyresykdom i familien, strukturell nyrelidelse</em></p>`,
        `<ul>`,
        field("Kreatinin og elektrolytter"),
        field("Estimert GFR"),
        field("Proteinuri (dip-stick)"),
        field("Albumin-kreatininratio"),
        `</ul>`,

        `<h3>Monitoreringsplan ved bruk av antipsykotika</h3>`,
        `<ul>`,
        hint("Bakgrunn og sykehistorie", "Oppstart, Årlig"),
        hint(
          "Gjennomgang av livsstil",
          "Oppstart, Ukentlig (6 uker), 12 uker, Årlig",
        ),
        hint("Vekt", "Oppstart, Ukentlig (6 uker), 12 uker, Årlig"),
        hint("Livvidde", "Oppstart, Årlig"),
        hint("Blodtrykk", "Oppstart, Ukentlig (6 uker), Årlig"),
        hint("HbA1c", "Oppstart, 12 uker, Årlig"),
        hint("Lipider", "Oppstart, 12 uker, Årlig"),
        `</ul>`,

        `<h3>Vurdering og tiltak</h3>`,
        `<ul>`,
        field("Somatisk risikoprofil ved oppstart"),
        field("Planlagte tiltak"),
        field("Fastlege informert / involvert"),
        field("Neste kontroll / oppfølgingstidspunkt"),
        hint(
          "Ansvarlig for somatisk oppfølging",
          "Fastlegen bør kobles inn tidlig, men psykiateren har ansvar for somatisk monitorering minimum de første 12 månedene.",
        ),
        `</ul>`,
      ].join(""),
    },
    {
      id: "samlenotat-legemidler",
      label: "Samlenotat legemidler",
      content: [
        `<h2>Samlenotat legemidler</h2>`,
        `<h3>Aktuell diagnostisk vurdering og mål for legemiddelbehandling</h3>`,
        line(""),
        `<h3>Aktuelle legemidler</h3>`,
        line(""),
        `<h3>Siste serumkonsentrasjonsmåling</h3>`,
        line(""),
        `<h3>Interaksjonsvurdering aktuelle legemidler</h3>`,
        line(""),
        `<h3>Genetiske varianter for legemiddelmetabolisme</h3>`,
        line("eks CYP-polymorfismer"),
        `<h3>Bivirkninger av aktuelle legemidler</h3>`,
        line(""),
        `<h3>Legemiddelhistorie faste psykofarmaka</h3>`,
        line("dose-evt serumspeil-varighet-effekt-bieffekt"),
        `<h3>Legemiddelhistorie behovs-psykofarmaka</h3>`,
        line("dose-varighet-effekt-bieffekt"),
        `<h3>Somatiske sykdommer og legemiddelbehandlinger</h3>`,
        line(""),
        `<h3>Naturpreparater/helsekost</h3>`,
        line(""),
        `<h3>Plan for legemiddelbehandling og forslag til endringer ved forverring</h3>`,
        line(""),
      ].join(""),
    },
  ],

  Konsultasjon: [
    {
      id: "konsultasjon-poliklinikk",
      label: "Konsultasjon poliklinikk",
      content: [
        `<h2>Konsultasjon poliklinikk</h2>`,
        `<h3>Aktuelt</h3>`,
        line(""),
        `<h3>Status</h3>`,
        line(""),
        `<h3>Vurdering</h3>`,
        line(""),
        `<h3>Tiltak</h3>`,
        line(""),
      ].join(""),
    },
    {
      id: "somatisk-status",
      label: "Somatisk status",
      content: [
        `<h2>Somatisk status</h2>`,
        `<ul>`,
        `<li>Generelle observasjoner:</li>`,
        `<li>Bevissthetsnivå, orienteringsevne:</li>`,
        `<li>Vekt, høyde, BMI(kg/m2):</li>`,
        `<li>Puls. BT:</li>`,
        `<li>Hud (temperatur, farge, eksanthem, hydrering):</li>`,
        `<li>Øyne/syn:</li>`,
        `<li>Ører:</li>`,
        `<li>Munnhule. Slimhinner. Tannstatus:</li>`,
        `<li>Collum:</li>`,
        `<li>Thorax:</li>`,
        `<li>Pulmones:</li>`,
        `<li>Cor:</li>`,
        `<li>Abdomen:</li>`,
        `<li>Ekstremiteter:</li>`,
        `</ul>`,

        `<h3>Supplerende undersøkelser</h3>`,
        line(""),
        `<h3>Orienterende nevrologisk undersøkelse</h3>`,
        line(""),
        `<h3>Blodprøver</h3>`,
        line(""),
        `<h3>Urinprøver</h3>`,
        line(""),
        `<h3>Andre undersøkelser</h3>`,
        line(""),
        `<h3>Vurdering og tiltak</h3>`,
      ].join(""),
    },
    {
      id: "oppfolging-pakkeforlop",
      label: "Oppfølging somatisk helse – Pakkeforløp",
      content: [
        `<h2>Oppfølging somatisk helse og levevaner ihht Pakkeforløp</h2>`,
        `<p>Det er gjort en kartlegging av pasientens somatiske helse i henhold til føringer i Pakkeforløp, og ut fra kartleggingen gjort en vurdering og tiltaksbeskrivelse.</p>`,
        `<h3>Kartlegging</h3>`,
        `<ul>`,
        `<li>Røyking:</li>`,
        `<li>Fysisk aktivitet og kosthold:</li>`,
        `<li>BMI:</li>`,
        `<li>Blodtrykk:</li>`,
        `<li>Glukose:</li>`,
        `<li>Blodlipider:</li>`,
        `<li>Søvn:</li>`,
        `<li>Problematisk alkoholbruk:</li>`,
        `<li>Injisering av rusmidler:</li>`,
        `<li>Tannhelse:</li>`,
        `</ul>`,
        `<h3>Vurdering og tiltak</h3>`,
        line("Disse områdene krever videre tiltak:"),
        line("Beskrivelse av planlagte tiltak:"),
        line("Mål:"),
      ].join(""),
    },
  ],

  Epikrise: [
    {
      id: "utredning-sammenfatning",
      label: "Utredning – Sammenfatning",
      content: [
        `<h2>Utredning, Sammenfatning</h2>`,
        line(
          "Utredningen er gjort i forbindelse med følgende behandlingsforløp:",
        ),
        line("Kilder til utredningen:"),
        `<h3>Bakgrunn</h3>`,
        `<ul>`,
        `<li>Svangerskap/fødsel:</li>`,
        `<li>Utviklingshistorie (motorikk, språkutvikling, tilknytning):</li>`,
        `<li>Familie, omsorgsforhold, mindreårige barn/søsken:</li>`,
        `<li>Kulturell bakgrunn, religion, migrasjonserfaring:</li>`,
        `<li>Bosituasjon:</li>`,
        `<li>Økonomi, stønader:</li>`,
        `<li>Dagaktivitet. Barnehage / skole / arbeid / andre tiltak / fritidsaktivitet:</li>`,
        `<li>Førerkort:</li>`,
        `<li>Ressurser og interesser:</li>`,
        `<li>Oppvekst og livshistorie:</li>`,
        `<li>Utdannings- og arbeidshistorie:</li>`,
        `<li>Seksualitet/kjønnsidentitet:</li>`,
        `</ul>`,
        `<h3>Hereditet</h3>`,
        line(""),
        `<h3>Psykiatrisk sykehistorie</h3>`,
        `<ul>`,
        `<li>Traumer:</li>`,
        `<li>Symptomutvikling og sykdomsepisoder:</li>`,
        `<li>Behandlingshistorikk:</li>`,
        `<li>Tidligere utredninger:</li>`,
        `<li>Juridiske vurderinger:</li>`,
        `<li>Selvskading:</li>`,
        `<li>Suicidalitet:</li>`,
        `<li>Atferdsvansker, kriminalitet:</li>`,
        `<li>Voldshistorikk og tidligere utredning av vold:</li>`,
        `</ul>`,
        `<h3>Rusmiddelbrukshistorie</h3>`,
        line(""),
        `<h3>Somatisk sykehistorie</h3>`,
        line(""),
        `<h3>Legemiddelanamnese</h3>`,
        line(""),
        `<h3>Resultat av gjennomførte undersøkelser og utredningsverktøy, oppsummering</h3>`,
        line(""),
        `<h3>Samlet vurdering og foreløpig diagnose</h3>`,
      ].join(""),
    },
  ],

  Henvisning: [
    {
      id: "tilbakemelding-fastlege",
      label: "Henvisning – Tilbakemelding til fastlege",
      content: [
        `<h3>Oppsummering av forløp ved [navn på avdeling]</h3>`,
        line(""),
        `<h3>Tilbakemelding til fastlege</h3>`,
        line(""),
        `<h3>Planer for videre utredning/behandling:</h3>`,
        line(""),
        `<h3>Medikamenter (hvis aktuelt)</h3>`,
        line(""),
        `<h3>Behov for oppfølging i førstelinjetjenesten</h3>`,
      ].join(""),
    },
  ],
};

export function getTemplates(type: JournalNoteType): JournalTemplate[] {
  return TEMPLATES[type] ?? [];
}
