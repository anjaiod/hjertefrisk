using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ResourceURLMeasures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResourceUrl",
                table: "PersonnelMeasures",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResourceUrl",
                table: "PatientMeasures",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResourceUrl",
                table: "PersonnelMeasures");

            migrationBuilder.DropColumn(
                name: "ResourceUrl",
                table: "PatientMeasures");
        }
    }
}
