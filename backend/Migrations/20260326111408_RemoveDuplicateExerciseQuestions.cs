using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDuplicateExerciseQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Title columns were already added via raw SQL in the previous migration –
            // use IF NOT EXISTS so this stays idempotent.
            migrationBuilder.Sql(@"
                ALTER TABLE ""PersonnelMeasureTexts"" ADD COLUMN IF NOT EXISTS ""Title"" text;
                ALTER TABLE ""PersonnelMeasures""     ADD COLUMN IF NOT EXISTS ""Title"" text;
                ALTER TABLE ""PatientMeasureTexts""   ADD COLUMN IF NOT EXISTS ""Title"" text;
                ALTER TABLE ""PatientMeasures""       ADD COLUMN IF NOT EXISTS ""Title"" text;
            ");

            // Remove the duplicate exercise questions (IDs 140-145) that were created
            // by the FixFysiskAktivitetQuestions migration. The real questions were
            // already present in the database and have been re-added to QueryQuestions
            // by the database owner. The duplicates appear as "Uten kategori" because
            // they were inserted without a CategoryId.
            migrationBuilder.Sql(@"
                DELETE FROM ""QueryQuestions""  WHERE ""QuestionId"" BETWEEN 140 AND 145;
                DELETE FROM ""QuestionTexts""   WHERE ""QuestionId"" BETWEEN 140 AND 145;
                DELETE FROM ""QuestionOptions"" WHERE ""QuestionId"" BETWEEN 140 AND 145;
                DELETE FROM ""Questions""       WHERE ""QuestionId"" BETWEEN 140 AND 145;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""PersonnelMeasureTexts"" DROP COLUMN IF EXISTS ""Title"";
                ALTER TABLE ""PersonnelMeasures""     DROP COLUMN IF EXISTS ""Title"";
                ALTER TABLE ""PatientMeasureTexts""   DROP COLUMN IF EXISTS ""Title"";
                ALTER TABLE ""PatientMeasures""       DROP COLUMN IF EXISTS ""Title"";
            ");
        }
    }
}
