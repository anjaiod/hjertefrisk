using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MakeBloodPressureQuestionsAvailableToPatients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Gjør blodtrykk-spørsmålene (systolisk og diastolisk) tilgjengelige
            // for pasienter i Helseskjema ved å fjerne clinician-rollen.
            migrationBuilder.Sql(@"
                UPDATE ""Questions""
                SET ""RequiredRole"" = NULL
                WHERE ""QuestionId"" IN (89, 90)
                  AND ""RequiredRole"" = 'clinician';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Questions""
                SET ""RequiredRole"" = 'clinician'
                WHERE ""QuestionId"" IN (89, 90);
            ");
        }
    }
}
