using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurementIdToQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MeasurementId",
                table: "Questions",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Questions_MeasurementId",
                table: "Questions",
                column: "MeasurementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Measurements_MeasurementId",
                table: "Questions",
                column: "MeasurementId",
                principalTable: "Measurements",
                principalColumn: "MeasurementId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Measurements_MeasurementId",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_MeasurementId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "MeasurementId",
                table: "Questions");
        }
    }
}
