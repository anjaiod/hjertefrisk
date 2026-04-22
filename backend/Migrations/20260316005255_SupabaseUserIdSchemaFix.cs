using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SupabaseUserIdSchemaFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SupabaseUserId",
                table: "Patients",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupabaseUserId",
                table: "Personnel",
                type: "text",
                nullable: true);

            migrationBuilder.Sql("UPDATE \"Patients\" SET \"SupabaseUserId\" = 'legacy-patient-' || \"Id\"::text WHERE \"SupabaseUserId\" IS NULL OR \"SupabaseUserId\" = '';");
            migrationBuilder.Sql("UPDATE \"Personnel\" SET \"SupabaseUserId\" = 'legacy-personnel-' || \"Id\"::text WHERE \"SupabaseUserId\" IS NULL OR \"SupabaseUserId\" = '';");

            migrationBuilder.AlterColumn<string>(
                name: "SupabaseUserId",
                table: "Patients",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SupabaseUserId",
                table: "Personnel",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_SupabaseUserId",
                table: "Patients",
                column: "SupabaseUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Personnel_SupabaseUserId",
                table: "Personnel",
                column: "SupabaseUserId",
                unique: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_SupabaseUserId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Personnel_SupabaseUserId",
                table: "Personnel");

            migrationBuilder.DropColumn(
                name: "SupabaseUserId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "SupabaseUserId",
                table: "Personnel");

        }
    }
}
