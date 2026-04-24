using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddNameNoDigitsCheckConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Personnel_Name_NoDigits",
                table: "Personnel",
                sql: "\"Name\" !~ '\\d'");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Patients_Name_NoDigits",
                table: "Patients",
                sql: "\"Name\" !~ '\\d'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Personnel_Name_NoDigits",
                table: "Personnel");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Patients_Name_NoDigits",
                table: "Patients");
        }
    }
}
