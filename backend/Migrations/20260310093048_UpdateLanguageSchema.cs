using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLanguageSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeasurementTexts_Languages_LanguageCode",
                table: "MeasurementTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasureTexts_Languages_LanguageCode",
                table: "MeasureTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_OptionTexts_Languages_LanguageCode",
                table: "OptionTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionTexts_Languages_LanguageCode",
                table: "QuestionTexts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Languages",
                table: "Languages");

            migrationBuilder.RenameTable(
                name: "Languages",
                newName: "Language");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Language",
                table: "Language",
                column: "Code");

            migrationBuilder.AddForeignKey(
                name: "FK_MeasurementTexts_Language_LanguageCode",
                table: "MeasurementTexts",
                column: "LanguageCode",
                principalTable: "Language",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeasureTexts_Language_LanguageCode",
                table: "MeasureTexts",
                column: "LanguageCode",
                principalTable: "Language",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OptionTexts_Language_LanguageCode",
                table: "OptionTexts",
                column: "LanguageCode",
                principalTable: "Language",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionTexts_Language_LanguageCode",
                table: "QuestionTexts",
                column: "LanguageCode",
                principalTable: "Language",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeasurementTexts_Language_LanguageCode",
                table: "MeasurementTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasureTexts_Language_LanguageCode",
                table: "MeasureTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_OptionTexts_Language_LanguageCode",
                table: "OptionTexts");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionTexts_Language_LanguageCode",
                table: "QuestionTexts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Language",
                table: "Language");

            migrationBuilder.RenameTable(
                name: "Language",
                newName: "Languages");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Languages",
                table: "Languages",
                column: "Code");

            migrationBuilder.AddForeignKey(
                name: "FK_MeasurementTexts_Languages_LanguageCode",
                table: "MeasurementTexts",
                column: "LanguageCode",
                principalTable: "Languages",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeasureTexts_Languages_LanguageCode",
                table: "MeasureTexts",
                column: "LanguageCode",
                principalTable: "Languages",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OptionTexts_Languages_LanguageCode",
                table: "OptionTexts",
                column: "LanguageCode",
                principalTable: "Languages",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionTexts_Languages_LanguageCode",
                table: "QuestionTexts",
                column: "LanguageCode",
                principalTable: "Languages",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
