using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    public partial class SeedHelseskjemaSpørsmål : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Language
            migrationBuilder.Sql(@"
                INSERT INTO ""Language"" (""Code"", ""Name"")
                VALUES ('no', 'Norsk')
                ON CONFLICT (""Code"") DO NOTHING;
            ");

            // Query
            migrationBuilder.InsertData(
                table: "Queries",
                columns: new[] { "Name" },
                values: new object[] { "Helseskjema" });

            // Questions
            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "FallbackText", "QuestionType", "IsRequired", "RequiredRole" },
                values: new object[,]
                {
                    { "Røyker du fast?", "boolean", true, null },
                    { "Hvor mye røyker du?", "text", false, null },
                    { "Er du motivert til å slutte med røyking dersom du får hjelp til dette?", "boolean", false, null },
                    { "Hvor ofte trener du?", "radio", true, null },
                    { "Hvor lenge trener du hver gang?", "radio", true, null },
                    { "Hvor hardt trener du?", "radio", true, null },
                    { "Har du noen fysiske begrensninger som påvirker dine muligheter til trening?", "boolean", true, null },
                    { "Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?", "boolean", true, null },
                    { "Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?", "radio", true, null },
                    { "Hvor mange måltider spiser du per dag?", "radio", true, null },
                    { "Hvor ofte hopper du over måltider?", "radio", true, null },
                    { "Hvordan vil du beskrive appetitten din?", "radio", true, null },
                    { "Er du motivert til å forbedre kostholdet ditt?", "boolean", true, null },
                    { "Har vekten din vært stabil det siste året?", "radio", true, null },
                    { "Hvor mye har vekten din endret seg?", "text", false, null },
                    { "Hvor høy er du?", "number", true, null },
                    { "Hvor mye veier du?", "number", true, null },
                    { "Hva er din livvidde?", "number", true, null },
                    { "Er det vanskelig for deg å sovne om kvelden?", "boolean", true, null },
                    { "Våkner du flere ganger i løpet av natten?", "boolean", true, null },
                    { "Våkner du for tidlig om morgenen?", "boolean", true, null },
                    { "Synes du selv at du sover for dårlig?", "boolean", true, null },
                    { "Sover du om dagen og er våken om natten?", "boolean", true, null },
                    { "Jobber du nattskift?", "boolean", false, null },
                    { "Hvor ofte har du problemer med søvn?", "radio", true, null },
                    { "Tar du sovemedisin?", "boolean", true, null },
                    { "Ønsker du veiledning om søvn?", "boolean", true, null },
                    { "Hvor ofte drikker du alkohol?", "radio", true, null },
                    { "Hvor mange enheter drikker du på en typisk dag når du drikker?", "radio", true, null },
                    { "Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?", "radio", true, null },
                    { "Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?", "radio", true, null },
                    { "Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?", "radio", true, null },
                    { "Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?", "radio", true, null },
                    { "Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?", "radio", true, null },
                    { "Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?", "radio", true, null },
                    { "Har du eller noen andre blitt skadet som følge av at du hadde drukket?", "radio", true, null },
                    { "Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?", "radio", true, null },
                    { "Bruker du rusmidler?", "boolean", true, null },
                    { "Har du noen gang brukt opioider eller GHB?", "boolean", false, null },
                    { "Har du brukt opioider eller GHB i det siste?", "boolean", false, null },
                    { "Bruker du sprøyte?", "boolean", false, null },
                    { "Er du motivert til å slutte med rusmidler?", "boolean", false, null },
                });

            // Bruk raw SQL for resten siden vi trenger genererte IDs
            migrationBuilder.Sql(@"
DO $$
DECLARE
    qid INTEGER;
    q1 INTEGER; q2 INTEGER; q3 INTEGER; q4 INTEGER; q5 INTEGER;
    q6 INTEGER; q7 INTEGER; q8 INTEGER; q9 INTEGER; q10 INTEGER;
    q11 INTEGER; q12 INTEGER; q13 INTEGER; q14 INTEGER; q15 INTEGER;
    q16 INTEGER; q17 INTEGER; q18 INTEGER; q19 INTEGER; q20 INTEGER;
    q21 INTEGER; q22 INTEGER; q23 INTEGER; q24 INTEGER; q25 INTEGER;
    q26 INTEGER; q27 INTEGER; q28 INTEGER; q29 INTEGER; q30 INTEGER;
    q31 INTEGER; q32 INTEGER; q33 INTEGER; q34 INTEGER; q35 INTEGER;
    q36 INTEGER; q37 INTEGER; q38 INTEGER; q39 INTEGER; q40 INTEGER;
    q41 INTEGER; q42 INTEGER;
BEGIN
    SELECT ""Id"" INTO qid FROM ""Queries"" WHERE ""Name"" = 'Helseskjema' ORDER BY ""Id"" DESC LIMIT 1;

    SELECT ""QuestionId"" INTO q1  FROM ""Questions"" WHERE ""FallbackText"" = 'Røyker du fast?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q2  FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor mye røyker du?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q3  FROM ""Questions"" WHERE ""FallbackText"" = 'Er du motivert til å slutte med røyking dersom du får hjelp til dette?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q4  FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte trener du?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q5  FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor lenge trener du hver gang?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q6  FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor hardt trener du?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q7  FROM ""Questions"" WHERE ""FallbackText"" = 'Har du noen fysiske begrensninger som påvirker dine muligheter til trening?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q8  FROM ""Questions"" WHERE ""FallbackText"" = 'Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q9  FROM ""Questions"" WHERE ""FallbackText"" = 'Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q10 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor mange måltider spiser du per dag?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q11 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte hopper du over måltider?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q12 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvordan vil du beskrive appetitten din?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q13 FROM ""Questions"" WHERE ""FallbackText"" = 'Er du motivert til å forbedre kostholdet ditt?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q14 FROM ""Questions"" WHERE ""FallbackText"" = 'Har vekten din vært stabil det siste året?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q15 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor mye har vekten din endret seg?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q16 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor høy er du?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q17 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor mye veier du?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q18 FROM ""Questions"" WHERE ""FallbackText"" = 'Hva er din livvidde?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q19 FROM ""Questions"" WHERE ""FallbackText"" = 'Er det vanskelig for deg å sovne om kvelden?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q20 FROM ""Questions"" WHERE ""FallbackText"" = 'Våkner du flere ganger i løpet av natten?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q21 FROM ""Questions"" WHERE ""FallbackText"" = 'Våkner du for tidlig om morgenen?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q22 FROM ""Questions"" WHERE ""FallbackText"" = 'Synes du selv at du sover for dårlig?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q23 FROM ""Questions"" WHERE ""FallbackText"" = 'Sover du om dagen og er våken om natten?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q24 FROM ""Questions"" WHERE ""FallbackText"" = 'Jobber du nattskift?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q25 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte har du problemer med søvn?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q26 FROM ""Questions"" WHERE ""FallbackText"" = 'Tar du sovemedisin?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q27 FROM ""Questions"" WHERE ""FallbackText"" = 'Ønsker du veiledning om søvn?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q28 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte drikker du alkohol?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q29 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor mange enheter drikker du på en typisk dag når du drikker?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q30 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q31 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q32 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q33 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q34 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q35 FROM ""Questions"" WHERE ""FallbackText"" = 'Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q36 FROM ""Questions"" WHERE ""FallbackText"" = 'Har du eller noen andre blitt skadet som følge av at du hadde drukket?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q37 FROM ""Questions"" WHERE ""FallbackText"" = 'Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q38 FROM ""Questions"" WHERE ""FallbackText"" = 'Bruker du rusmidler?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q39 FROM ""Questions"" WHERE ""FallbackText"" = 'Har du noen gang brukt opioider eller GHB?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q40 FROM ""Questions"" WHERE ""FallbackText"" = 'Har du brukt opioider eller GHB i det siste?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q41 FROM ""Questions"" WHERE ""FallbackText"" = 'Bruker du sprøyte?' ORDER BY ""QuestionId"" DESC LIMIT 1;
    SELECT ""QuestionId"" INTO q42 FROM ""Questions"" WHERE ""FallbackText"" = 'Er du motivert til å slutte med rusmidler?' ORDER BY ""QuestionId"" DESC LIMIT 1;

    -- QuestionTexts
    INSERT INTO ""QuestionTexts"" (""QuestionId"", ""LanguageCode"", ""Text"") VALUES
        (q1,'no','Røyker du fast?'),(q2,'no','Hvor mye røyker du?'),(q3,'no','Er du motivert til å slutte med røyking dersom du får hjelp til dette?'),
        (q4,'no','Hvor ofte trener du?'),(q5,'no','Hvor lenge trener du hver gang?'),(q6,'no','Hvor hardt trener du?'),
        (q7,'no','Har du noen fysiske begrensninger som påvirker dine muligheter til trening?'),
        (q8,'no','Har du noen andre barrierer (angst, smerter, sosiale utfordringer) som påvirker trening?'),
        (q9,'no','Er du motivert til å bli mer fysisk aktiv i hverdagen dersom du får hjelp til dette?'),
        (q10,'no','Hvor mange måltider spiser du per dag?'),(q11,'no','Hvor ofte hopper du over måltider?'),
        (q12,'no','Hvordan vil du beskrive appetitten din?'),(q13,'no','Er du motivert til å forbedre kostholdet ditt?'),
        (q14,'no','Har vekten din vært stabil det siste året?'),(q15,'no','Hvor mye har vekten din endret seg?'),
        (q16,'no','Hvor høy er du?'),(q17,'no','Hvor mye veier du?'),(q18,'no','Hva er din livvidde?'),
        (q19,'no','Er det vanskelig for deg å sovne om kvelden?'),(q20,'no','Våkner du flere ganger i løpet av natten?'),
        (q21,'no','Våkner du for tidlig om morgenen?'),(q22,'no','Synes du selv at du sover for dårlig?'),
        (q23,'no','Sover du om dagen og er våken om natten?'),(q24,'no','Jobber du nattskift?'),
        (q25,'no','Hvor ofte har du problemer med søvn?'),(q26,'no','Tar du sovemedisin?'),(q27,'no','Ønsker du veiledning om søvn?'),
        (q28,'no','Hvor ofte drikker du alkohol?'),(q29,'no','Hvor mange enheter drikker du på en typisk dag når du drikker?'),
        (q30,'no','Hvor ofte drikker du 6 eller flere enheter ved en og samme anledning?'),
        (q31,'no','Hvor ofte i løpet av det siste året har du opplevd at du ikke klarte å stoppe å drikke når du først hadde begynt?'),
        (q32,'no','Hvor ofte i løpet av det siste året har du ikke klart å gjøre det som normalt forventes av deg på grunn av alkoholbruk?'),
        (q33,'no','Hvor ofte i løpet av det siste året har du trengt å drikke alkohol på morgenen for å komme i gang etter å ha drukket mye dagen før?'),
        (q34,'no','Hvor ofte i løpet av det siste året har du hatt skyldfølelse eller dårlig samvittighet etter å ha drukket?'),
        (q35,'no','Hvor ofte i løpet av det siste året har du ikke kunnet huske hva som skjedde kvelden før fordi du hadde drukket?'),
        (q36,'no','Har du eller noen andre blitt skadet som følge av at du hadde drukket?'),
        (q37,'no','Har en slektning, venn, lege eller annet helsepersonell vist bekymring for alkoholvanene dine eller foreslått at du burde trappe ned?'),
        (q38,'no','Bruker du rusmidler?'),(q39,'no','Har du noen gang brukt opioider eller GHB?'),
        (q40,'no','Har du brukt opioider eller GHB i det siste?'),(q41,'no','Bruker du sprøyte?'),
        (q42,'no','Er du motivert til å slutte med rusmidler?');

    -- QuestionOptions
    INSERT INTO ""QuestionOptions"" (""QuestionId"", ""FallbackText"", ""OptionValue"", ""DisplayOrder"") VALUES
        (q4,'Nesten aldri eller mindre enn en gang i uka','nesten-aldri',1),(q4,'En gang i uka','en-gang',2),(q4,'2-3 ganger i uka','2-3-ganger',3),(q4,'Nesten hver dag','nesten-hver-dag',4),
        (q5,'Rundt 15 minutter','15min',1),(q5,'Rundt 30 minutter','30min',2),(q5,'30 minutter eller mer','30min-plus',3),
        (q6,'Jeg tar det med ro og blir ikke andpusten eller svett','rolig',1),(q6,'Jeg blir litt andpusten og svett','moderat',2),(q6,'Jeg tar det helt ut','hardt',3),
        (q9,'Ja','ja',1),(q9,'Nei','nei',2),
        (q10,'1-2 måltider','1-2',1),(q10,'3 måltider','3',2),(q10,'4-5 måltider','4-5',3),(q10,'6 eller flere måltider','6-plus',4),
        (q11,'Aldri','aldri',1),(q11,'Sjelden','sjelden',2),(q11,'Noen ganger i uken','noen-ganger',3),(q11,'Ofte','ofte',4),
        (q12,'Dårlig','dårlig',1),(q12,'Normal','normal',2),(q12,'God','god',3),(q12,'Veldig god','veldig-god',4),
        (q14,'Ja','ja',1),(q14,'Nei, den har økt','nei-okt',2),(q14,'Nei, den har minsket','nei-minsket',3),
        (q25,'Aldri','aldri',1),(q25,'Sjelden','sjelden',2),(q25,'1-2 ganger per uke','1-2-uker',3),(q25,'3-5 ganger per uke','3-5-uker',4),(q25,'Hver natt','hver-natt',5),
        (q28,'Aldri','0',1),(q28,'Månedlig eller sjeldnere','1',2),(q28,'2-4 ganger i måneden','2',3),(q28,'2-3 ganger i uken','3',4),(q28,'4 eller flere ganger i uken','4',5),
        (q29,'1-2','0',1),(q29,'3-4','1',2),(q29,'5-6','2',3),(q29,'7-9','3',4),(q29,'10 eller flere','4',5),
        (q30,'Aldri','0',1),(q30,'Sjeldnere enn månedlig','1',2),(q30,'Månedlig','2',3),(q30,'Ukentlig','3',4),(q30,'Daglig eller nesten daglig','4',5),
        (q31,'Aldri','0',1),(q31,'Sjeldnere enn månedlig','1',2),(q31,'Månedlig','2',3),(q31,'Ukentlig','3',4),(q31,'Daglig eller nesten daglig','4',5),
        (q32,'Aldri','0',1),(q32,'Sjeldnere enn månedlig','1',2),(q32,'Månedlig','2',3),(q32,'Ukentlig','3',4),(q32,'Daglig eller nesten daglig','4',5),
        (q33,'Aldri','0',1),(q33,'Sjeldnere enn månedlig','1',2),(q33,'Månedlig','2',3),(q33,'Ukentlig','3',4),(q33,'Daglig eller nesten daglig','4',5),
        (q34,'Aldri','0',1),(q34,'Sjeldnere enn månedlig','1',2),(q34,'Månedlig','2',3),(q34,'Ukentlig','3',4),(q34,'Daglig eller nesten daglig','4',5),
        (q35,'Aldri','0',1),(q35,'Sjeldnere enn månedlig','1',2),(q35,'Månedlig','2',3),(q35,'Ukentlig','3',4),(q35,'Daglig eller nesten daglig','4',5),
        (q36,'Nei','0',1),(q36,'Ja, men ikke i løpet av det siste året','2',2),(q36,'Ja, i løpet av det siste året','4',3),
        (q37,'Nei','0',1),(q37,'Ja, men ikke i løpet av det siste året','2',2),(q37,'Ja, i løpet av det siste året','4',3);

    -- QueryQuestions
    INSERT INTO ""QueryQuestions"" (""QueryId"", ""QuestionId"", ""DisplayOrder"") VALUES
        (qid,q1,1),(qid,q2,2),(qid,q3,3),(qid,q4,4),(qid,q5,5),(qid,q6,6),(qid,q7,7),(qid,q8,8),(qid,q9,9),
        (qid,q10,10),(qid,q11,11),(qid,q12,12),(qid,q13,13),(qid,q14,14),(qid,q15,15),(qid,q16,16),(qid,q17,17),
        (qid,q18,18),(qid,q19,19),(qid,q20,20),(qid,q21,21),(qid,q22,22),(qid,q23,23),(qid,q24,24),(qid,q25,25),
        (qid,q26,26),(qid,q27,27),(qid,q28,28),(qid,q29,29),(qid,q30,30),(qid,q31,31),(qid,q32,32),(qid,q33,33),
        (qid,q34,34),(qid,q35,35),(qid,q36,36),(qid,q37,37),(qid,q38,38),(qid,q39,39),(qid,q40,40),(qid,q41,41),(qid,q42,42);

    -- QuestionDependencies
    INSERT INTO ""QuestionDependencies"" (""ParentQueryId"", ""ParentQuestionId"", ""ChildQueryId"", ""ChildQuestionId"", ""TriggerTextValue"", ""Operator"") VALUES
        (qid,q1,qid,q2,'ja','='),(qid,q1,qid,q3,'ja','='),
        (qid,q14,qid,q15,'nei-okt','OR'),
        (qid,q23,qid,q24,'ja','='),
        (qid,q38,qid,q39,'ja','='),(qid,q38,qid,q40,'ja','='),(qid,q38,qid,q41,'ja','='),(qid,q38,qid,q42,'ja','=');

END $$;
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""Queries"" WHERE ""Name"" = 'Helseskjema';
                DELETE FROM ""Language"" WHERE ""Code"" = 'no';
            ");
        }
    }
}