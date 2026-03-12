using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeverityForMeasurements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Severities_Questions_QuestionId",
                table: "Severities");

            migrationBuilder.AlterColumn<int>(
                name: "QuestionId",
                table: "Severities",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "MeasurementId",
                table: "Severities",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Severities_MeasurementId",
                table: "Severities",
                column: "MeasurementId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Severity_QuestionOrMeasurement",
                table: "Severities",
                sql: "(\"QuestionId\" IS NOT NULL AND \"MeasurementId\" IS NULL) OR (\"QuestionId\" IS NULL AND \"MeasurementId\" IS NOT NULL)");

            migrationBuilder.AddForeignKey(
                name: "FK_Severities_Measurements_MeasurementId",
                table: "Severities",
                column: "MeasurementId",
                principalTable: "Measurements",
                principalColumn: "MeasurementId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Severities_Questions_QuestionId",
                table: "Severities",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "QuestionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Severities_Measurements_MeasurementId",
                table: "Severities");

            migrationBuilder.DropForeignKey(
                name: "FK_Severities_Questions_QuestionId",
                table: "Severities");

            migrationBuilder.DropIndex(
                name: "IX_Severities_MeasurementId",
                table: "Severities");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Severity_QuestionOrMeasurement",
                table: "Severities");

            migrationBuilder.DropColumn(
                name: "MeasurementId",
                table: "Severities");

            migrationBuilder.AlterColumn<int>(
                name: "QuestionId",
                table: "Severities",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Severities_Questions_QuestionId",
                table: "Severities",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "QuestionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
