using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddBlodtrykkMeasures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── PASIENTTILTAK (PatientMeasures) ─────────────────────────────
            // Kolonnerekkefølge: CategoryId, TriggerType, ScoreThreshold, IsExclusive, Priority,
            //                    FallbackText, Title, Operator, QuestionId, RequiredOption,
            //                    RequiredText, RequiredValue, ResourceUrl
            migrationBuilder.Sql(@"
                INSERT INTO ""PatientMeasures""
                    (""CategoryId"", ""TriggerType"", ""ScoreThreshold"", ""IsExclusive"", ""Priority"",
                     ""FallbackText"", ""Title"", ""Operator"", ""QuestionId"", ""RequiredOption"",
                     ""RequiredText"", ""RequiredValue"", ""ResourceUrl"")
                VALUES
                    (14, 'Custom', 0, false, 1,
                     'Blodtrykket ditt er innenfor normalområdet. Fortsett med sunne livsstilsvaner.',
                     'blodtrykk_lav', '', NULL, NULL, NULL, NULL, NULL),

                    (14, 'Custom', 1, false, 1,
                     'Blodtrykket ditt er noe forhøyet. Reduser saltinntak, øk fysisk aktivitet og unngå røyk og alkohol. Be om individuelle pasienttiltakskort for livsstil og hypertensjon.',
                     'blodtrykk_middels', '', NULL, NULL, NULL, NULL, NULL),

                    (14, 'Custom', 2, false, 2,
                     'Blodtrykket ditt er høyt. Reduser saltinntak, unngå stress og kontakt legen din umiddelbart for vurdering av medikamentell behandling.',
                     'blodtrykk_hoy', '', NULL, NULL, NULL, NULL, NULL),

                    (14, 'Custom', 1, false, 1,
                     'Tips for korrekt blodtrykksmåling: Sitt rolig i minst 5 minutter, pust rolig og unngå å snakke under målingen. Ta gjerne 2–3 målinger og noter gjennomsnittet.',
                     'blodtrykk_malingsteknikk', '', NULL, NULL, NULL, NULL, NULL);
            ");

            // ── BEHANDLERTILTAK (PersonnelMeasures) ─────────────────────────
            migrationBuilder.Sql(@"
                INSERT INTO ""PersonnelMeasures""
                    (""CategoryId"", ""TriggerType"", ""ScoreThreshold"", ""IsExclusive"", ""Priority"",
                     ""FallbackText"", ""Title"", ""Operator"", ""QuestionId"", ""RequiredOption"",
                     ""RequiredText"", ""RequiredValue"", ""ResourceUrl"")
                VALUES
                    (14, 'Custom', 0, false, 1,
                     'Blodtrykket er innenfor normalområdet. Kontroll anbefales om 12 uker.',
                     'blodtrykk_lav', '', NULL, NULL, NULL, NULL, NULL),

                    (14, 'Custom', 2, false, 2,
                     'Blodtrykk >= 140/100 gir indikasjon for medikamentell behandling. Vurder tillegg av antihypertensiva og henvis til spesialisthelsetjenesten ved behov.',
                     'blodtrykk_hoy', '', NULL, NULL, NULL, NULL, NULL),

                    (14, 'Custom', 1, false, 1,
                     'Pasienten har kun én blodtrykksmåling. Vurder 24-timers blodtrykksregistrering eller hjemmemålinger over minst 7 dager. Kartlegg øvrige kardiovaskulære risikofaktorer.',
                     'blodtrykk_hjemmemaling', '', NULL, NULL, NULL, NULL, NULL);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""PatientMeasures""
                WHERE ""CategoryId"" = 14
                  AND ""TriggerType"" = 'Custom'
                  AND ""Title"" IN ('blodtrykk_lav', 'blodtrykk_middels', 'blodtrykk_hoy', 'blodtrykk_malingsteknikk');

                DELETE FROM ""PersonnelMeasures""
                WHERE ""CategoryId"" = 14
                  AND ""TriggerType"" = 'Custom'
                  AND ""Title"" IN ('blodtrykk_lav', 'blodtrykk_hoy', 'blodtrykk_hjemmemaling');
            ");
        }
    }
}
