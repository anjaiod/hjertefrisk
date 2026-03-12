-- ============================================
-- INSERT QUERY (Helseskjema)
-- ============================================
INSERT INTO "Queries" ("Name")
VALUES ('Helseskjema');

DO $$
DECLARE
    qid INTEGER;

    -- Question IDs
    q_smoker INTEGER;
    q_smoking_amount INTEGER;
    q_smoking_motivated INTEGER;
    q_exercise_frequency INTEGER;
    q_exercise_duration INTEGER;
    q_exercise_intensity INTEGER;
    q_physical_limitations INTEGER;
    q_exercise_barriers INTEGER;
    q_exercise_motivated INTEGER;
    q_meals_per_day INTEGER;
    q_skip_meals INTEGER;
    q_appetite INTEGER;
    q_diet_motivated INTEGER;
    q_weight_stable INTEGER;
    q_weight_change INTEGER;
    q_height INTEGER;
    q_weight INTEGER;
    q_waist INTEGER;
    q_difficulty_falling_asleep INTEGER;
    q_wakes_during_night INTEGER;
    q_wakes_too_early INTEGER;
    q_poor_sleep_quality INTEGER;
    q_sleep_day_awake_night INTEGER;
    q_night_shift INTEGER;
    q_sleep_problem_frequency INTEGER;
    q_sleep_medication INTEGER;
    q_sleep_guidance INTEGER;
    q_alcohol_frequency INTEGER;
    q_alcohol_units INTEGER;
    q_alcohol_binge INTEGER;
    q_alcohol_unable_to_stop INTEGER;
    q_alcohol_failed_expectations INTEGER;
    q_alcohol_morning INTEGER;
    q_alcohol_guilt INTEGER;
    q_alcohol_memory INTEGER;
    q_alcohol_injury INTEGER;
    q_alcohol_concern INTEGER;
    q_uses_substances INTEGER;
    q_used_opioids_ghb INTEGER;
    q_used_opioids_recently INTEGER;
    q_uses_injection INTEGER;
    q_substance_motivated INTEGER;

BEGIN

-- Hent Id fra Queries-tabellen
SELECT "Id" INTO qid FROM "Queries" WHERE "Name" = 'Helseskjema';

-- ============================================
-- RØYKING
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Røyker du fast?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_smoker;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_smoker, 'no', 'Røyker du fast?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor mye røyker du?', 'text', false, NULL)
RETURNING "QuestionId" INTO q_smoking_amount;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_smoking_amount, 'no', 'Hvor mye røyker du?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Er du motivert til å slutte med røyking dersom du får hjelp til dette?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_smoking_motivated;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_smoking_motivated, 'no', 'Er du motivert til å slutte med røyking dersom du får hjelp til dette?');

-- ============================================
-- FYSISK AKTIVITET
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte trener du?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_exercise_frequency;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_exercise_frequency, 'no', 'Hvor ofte trener du?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_exercise_frequency, 'Nesten aldri eller mindre enn en gang i uka', 'nesten-aldri', 1),
    (q_exercise_frequency, 'En gang i uka', 'en-gang', 2),
    (q_exercise_frequency, '2-3 ganger i uka', '2-3-ganger', 3),
    (q_exercise_frequency, 'Nesten hver dag', 'nesten-hver-dag', 4);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor lenge trener du hver gang?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_exercise_duration;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_exercise_duration, 'no', 'Hvor lenge trener du hver gang?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_exercise_duration, 'Rundt 15 minutter', '15min', 1),
    (q_exercise_duration, 'Rundt 30 minutter', '30min', 2),
    (q_exercise_duration, '30 minutter eller mer', '30min-plus', 3);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor hardt trener du?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_exercise_intensity;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_exercise_intensity, 'no', 'Hvor hardt trener du?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_exercise_intensity, 'Jeg tar det med ro og blir ikke andpusten eller svett', 'rolig', 1),
    (q_exercise_intensity, 'Jeg blir litt andpusten og svett', 'moderat', 2),
    (q_exercise_intensity, 'Jeg tar det helt ut', 'hardt', 3);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har du noen fysiske begrensninger som påvirker dine muligheter til trening?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_physical_limitations;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_physical_limitations, 'no', 'Har du noen fysiske begrensninger som påvirker dine muligheter til trening?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_exercise_barriers;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_exercise_barriers, 'no', 'Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_exercise_motivated;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_exercise_motivated, 'no', 'Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_exercise_motivated, 'Ja', 'ja', 1),
    (q_exercise_motivated, 'Nei', 'nei', 2);

-- ============================================
-- KOSTHOLD
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor mange måltider spiser du per dag?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_meals_per_day;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_meals_per_day, 'no', 'Hvor mange måltider spiser du per dag?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_meals_per_day, '1-2 måltider', '1-2', 1),
    (q_meals_per_day, '3 måltider', '3', 2),
    (q_meals_per_day, '4-5 måltider', '4-5', 3),
    (q_meals_per_day, '6 eller flere måltider', '6-plus', 4);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte hopper du over måltider?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_skip_meals;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_skip_meals, 'no', 'Hvor ofte hopper du over måltider?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_skip_meals, 'Aldri', 'aldri', 1),
    (q_skip_meals, 'Sjelden', 'sjelden', 2),
    (q_skip_meals, 'Noen ganger i uken', 'noen-ganger', 3),
    (q_skip_meals, 'Ofte', 'ofte', 4);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvordan vil du beskrive appetitten din?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_appetite;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_appetite, 'no', 'Hvordan vil du beskrive appetitten din?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_appetite, 'Dårlig', 'dårlig', 1),
    (q_appetite, 'Normal', 'normal', 2),
    (q_appetite, 'God', 'god', 3),
    (q_appetite, 'Veldig god', 'veldig-god', 4);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Er du motivert til å forbedre kostholdet ditt?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_diet_motivated;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_diet_motivated, 'no', 'Er du motivert til å forbedre kostholdet ditt?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har vekten din vært stabil det siste året?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_weight_stable;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_weight_stable, 'no', 'Har vekten din vært stabil det siste året?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_weight_stable, 'Ja', 'ja', 1),
    (q_weight_stable, 'Nei, den har økt', 'nei-okt', 2),
    (q_weight_stable, 'Nei, den har minsket', 'nei-minsket', 3);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor mye har vekten din endret seg?', 'text', false, NULL)
RETURNING "QuestionId" INTO q_weight_change;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_weight_change, 'no', 'Hvor mye har vekten din endret seg?');

-- ============================================
-- VEKT
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor høy er du?', 'number', true, NULL)
RETURNING "QuestionId" INTO q_height;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_height, 'no', 'Hvor høy er du?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor mye veier du?', 'number', true, NULL)
RETURNING "QuestionId" INTO q_weight;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_weight, 'no', 'Hvor mye veier du?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hva er din livvidde?', 'number', true, NULL)
RETURNING "QuestionId" INTO q_waist;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_waist, 'no', 'Hva er din livvidde?');

-- ============================================
-- SØVN
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Er det vanskelig for deg å sovne om kvelden?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_difficulty_falling_asleep;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_difficulty_falling_asleep, 'no', 'Er det vanskelig for deg å sovne om kvelden?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Våkner du flere ganger i løpet av natten?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_wakes_during_night;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_wakes_during_night, 'no', 'Våkner du flere ganger i løpet av natten?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Våkner du for tidlig om morgenen?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_wakes_too_early;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_wakes_too_early, 'no', 'Våkner du for tidlig om morgenen?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Synes du selv at du sover for dårlig?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_poor_sleep_quality;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_poor_sleep_quality, 'no', 'Synes du selv at du sover for dårlig?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Sover du om dagen og er våken om natten?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_sleep_day_awake_night;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_sleep_day_awake_night, 'no', 'Sover du om dagen og er våken om natten?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Jobber du nattskift?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_night_shift;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_night_shift, 'no', 'Jobber du nattskift?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte har du problemer med søvn?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_sleep_problem_frequency;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_sleep_problem_frequency, 'no', 'Hvor ofte har du problemer med søvn?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_sleep_problem_frequency, 'Aldri', 'aldri', 1),
    (q_sleep_problem_frequency, 'Sjelden', 'sjelden', 2),
    (q_sleep_problem_frequency, '1-2 ganger per uke', '1-2-uker', 3),
    (q_sleep_problem_frequency, '3-5 ganger per uke', '3-5-uker', 4),
    (q_sleep_problem_frequency, 'Hver natt', 'hver-natt', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Tar du sovemedisin?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_sleep_medication;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_sleep_medication, 'no', 'Tar du sovemedisin?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Ønsker du veiledning om søvn?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_sleep_guidance;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_sleep_guidance, 'no', 'Ønsker du veiledning om søvn?');

-- ============================================
-- ALKOHOL (AUDIT)
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte drikker du alkohol?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_frequency;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_frequency, 'no', 'Hvor ofte drikker du alkohol?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_frequency, 'Aldri', '0', 1),
    (q_alcohol_frequency, 'Månedlig eller sjeldnere', '1', 2),
    (q_alcohol_frequency, '2-4 ganger i måneden', '2', 3),
    (q_alcohol_frequency, '2-3 ganger i uken', '3', 4),
    (q_alcohol_frequency, '4 eller flere ganger i uken', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor mange enheter drikker du på en typisk dag når du drikker?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_units;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_units, 'no', 'Hvor mange enheter drikker du på en typisk dag når du drikker?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_units, '1-2', '0', 1),
    (q_alcohol_units, '3-4', '1', 2),
    (q_alcohol_units, '5-6', '2', 3),
    (q_alcohol_units, '7-9', '3', 4),
    (q_alcohol_units, '10 eller flere', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_binge;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_binge, 'no', 'Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_binge, 'Aldri', '0', 1),
    (q_alcohol_binge, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_binge, 'Månedlig', '2', 3),
    (q_alcohol_binge, 'Ukentlig', '3', 4),
    (q_alcohol_binge, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_unable_to_stop;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_unable_to_stop, 'no', 'Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_unable_to_stop, 'Aldri', '0', 1),
    (q_alcohol_unable_to_stop, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_unable_to_stop, 'Månedlig', '2', 3),
    (q_alcohol_unable_to_stop, 'Ukentlig', '3', 4),
    (q_alcohol_unable_to_stop, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_failed_expectations;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_failed_expectations, 'no', 'Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_failed_expectations, 'Aldri', '0', 1),
    (q_alcohol_failed_expectations, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_failed_expectations, 'Månedlig', '2', 3),
    (q_alcohol_failed_expectations, 'Ukentlig', '3', 4),
    (q_alcohol_failed_expectations, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_morning;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_morning, 'no', 'Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_morning, 'Aldri', '0', 1),
    (q_alcohol_morning, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_morning, 'Månedlig', '2', 3),
    (q_alcohol_morning, 'Ukentlig', '3', 4),
    (q_alcohol_morning, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_guilt;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_guilt, 'no', 'Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_guilt, 'Aldri', '0', 1),
    (q_alcohol_guilt, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_guilt, 'Månedlig', '2', 3),
    (q_alcohol_guilt, 'Ukentlig', '3', 4),
    (q_alcohol_guilt, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_memory;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_memory, 'no', 'Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_memory, 'Aldri', '0', 1),
    (q_alcohol_memory, 'Sjeldnere enn månedlig', '1', 2),
    (q_alcohol_memory, 'Månedlig', '2', 3),
    (q_alcohol_memory, 'Ukentlig', '3', 4),
    (q_alcohol_memory, 'Daglig eller nesten daglig', '4', 5);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har du eller noen andre blitt skadet som følge av at du hadde drukket?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_injury;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_injury, 'no', 'Har du eller noen andre blitt skadet som følge av at du hadde drukket?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_injury, 'Nei', '0', 1),
    (q_alcohol_injury, 'Ja, men ikke i løpet av det siste året', '2', 2),
    (q_alcohol_injury, 'Ja, i løpet av det siste året', '4', 3);

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?', 'radio', true, NULL)
RETURNING "QuestionId" INTO q_alcohol_concern;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_alcohol_concern, 'no', 'Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?');

INSERT INTO "QuestionOptions" ("QuestionId", "FallbackText", "OptionValue", "DisplayOrder")
VALUES
    (q_alcohol_concern, 'Nei', '0', 1),
    (q_alcohol_concern, 'Ja, men ikke i løpet av det siste året', '2', 2),
    (q_alcohol_concern, 'Ja, i løpet av det siste året', '4', 3);

-- ============================================
-- RUSMIDLER
-- ============================================
INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Bruker du rusmidler?', 'boolean', true, NULL)
RETURNING "QuestionId" INTO q_uses_substances;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_uses_substances, 'no', 'Bruker du rusmidler?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har du noen gang brukt opioider eller GHB?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_used_opioids_ghb;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_used_opioids_ghb, 'no', 'Har du noen gang brukt opioider eller GHB?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Har du brukt opioider eller GHB i det siste?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_used_opioids_recently;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_used_opioids_recently, 'no', 'Har du brukt opioider eller GHB i det siste?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Bruker du sprøyte?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_uses_injection;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_uses_injection, 'no', 'Bruker du sprøyte?');

INSERT INTO "Questions" ("FallbackText", "QuestionType", "IsRequired", "RequiredRole")
VALUES ('Er du motivert til å slutte med rusmidler?', 'boolean', false, NULL)
RETURNING "QuestionId" INTO q_substance_motivated;

INSERT INTO "QuestionTexts" ("QuestionId", "LanguageCode", "Text")
VALUES (q_substance_motivated, 'no', 'Er du motivert til å slutte med rusmidler?');

-- ============================================
-- QUERYQUESTIONS (kobler spørsmål til Query)
-- ============================================
INSERT INTO "QueryQuestions" ("QueryId", "QuestionId", "DisplayOrder")
VALUES
    (qid, q_smoker, 1),
    (qid, q_smoking_amount, 2),
    (qid, q_smoking_motivated, 3),
    (qid, q_exercise_frequency, 4),
    (qid, q_exercise_duration, 5),
    (qid, q_exercise_intensity, 6),
    (qid, q_physical_limitations, 7),
    (qid, q_exercise_barriers, 8),
    (qid, q_exercise_motivated, 9),
    (qid, q_meals_per_day, 10),
    (qid, q_skip_meals, 11),
    (qid, q_appetite, 12),
    (qid, q_diet_motivated, 13),
    (qid, q_weight_stable, 14),
    (qid, q_weight_change, 15),
    (qid, q_height, 16),
    (qid, q_weight, 17),
    (qid, q_waist, 18),
    (qid, q_difficulty_falling_asleep, 19),
    (qid, q_wakes_during_night, 20),
    (qid, q_wakes_too_early, 21),
    (qid, q_poor_sleep_quality, 22),
    (qid, q_sleep_day_awake_night, 23),
    (qid, q_night_shift, 24),
    (qid, q_sleep_problem_frequency, 25),
    (qid, q_sleep_medication, 26),
    (qid, q_sleep_guidance, 27),
    (qid, q_alcohol_frequency, 28),
    (qid, q_alcohol_units, 29),
    (qid, q_alcohol_binge, 30),
    (qid, q_alcohol_unable_to_stop, 31),
    (qid, q_alcohol_failed_expectations, 32),
    (qid, q_alcohol_morning, 33),
    (qid, q_alcohol_guilt, 34),
    (qid, q_alcohol_memory, 35),
    (qid, q_alcohol_injury, 36),
    (qid, q_alcohol_concern, 37),
    (qid, q_uses_substances, 38),
    (qid, q_used_opioids_ghb, 39),
    (qid, q_used_opioids_recently, 40),
    (qid, q_uses_injection, 41),
    (qid, q_substance_motivated, 42);

-- ============================================
-- QUESTIONDEPENDENCIES (betingede spørsmål)
-- ============================================

-- Røyking: vises kun hvis smoker = "ja"
INSERT INTO "QuestionDependencies" ("ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId", "TriggerTextValue", "Operator")
VALUES
    (qid, q_smoker, qid, q_smoking_amount, 'ja', '='),
    (qid, q_smoker, qid, q_smoking_motivated, 'ja', '=');

-- Kosthold: weight_change vises kun hvis weight_stable = "nei-okt" eller "nei-minsket"
INSERT INTO "QuestionDependencies" ("ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId", "TriggerTextValue", "Operator")
VALUES
    (qid, q_weight_stable, qid, q_weight_change, 'nei-okt', 'OR');

-- Søvn: night_shift vises kun hvis sleep_day_awake_night = "ja"
INSERT INTO "QuestionDependencies" ("ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId", "TriggerTextValue", "Operator")
VALUES
    (qid, q_sleep_day_awake_night, qid, q_night_shift, 'ja', '=');

-- Rusmidler: følgespørsmål vises kun hvis uses_substances = "ja"
INSERT INTO "QuestionDependencies" ("ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId", "TriggerTextValue", "Operator")
VALUES
    (qid, q_uses_substances, qid, q_used_opioids_ghb, 'ja', '='),
    (qid, q_uses_substances, qid, q_used_opioids_recently, 'ja', '='),
    (qid, q_uses_substances, qid, q_uses_injection, 'ja', '='),
    (qid, q_uses_substances, qid, q_substance_motivated, 'ja', '=');

END $$;