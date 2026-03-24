using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SplitMeasureDefinitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeasureTexts");

            migrationBuilder.DropTable(
                name: "Measures");

            migrationBuilder.CreateTable(
                name: "PatientMeasures",
                columns: table => new
                {
                    PatientMeasureId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: true),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    ScoreThreshold = table.Column<int>(type: "integer", nullable: false),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    TriggerType = table.Column<string>(type: "text", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    FallbackText = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMeasures", x => x.PatientMeasureId);
                    table.ForeignKey(
                        name: "FK_PatientMeasures_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMeasures_QuestionOptions_RequiredOption",
                        column: x => x.RequiredOption,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientMeasures_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PersonnelMeasures",
                columns: table => new
                {
                    PersonnelMeasureId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: true),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    ScoreThreshold = table.Column<int>(type: "integer", nullable: false),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    TriggerType = table.Column<string>(type: "text", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    FallbackText = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelMeasures", x => x.PersonnelMeasureId);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasures_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasures_QuestionOptions_RequiredOption",
                        column: x => x.RequiredOption,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasures_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientMeasureResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientMeasureId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    QueryId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    TriggerQuestionId = table.Column<int>(type: "integer", nullable: true),
                    CategoryScore = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMeasureResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientMeasureResults_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PatientMeasureResults_PatientMeasures_PatientMeasureId",
                        column: x => x.PatientMeasureId,
                        principalTable: "PatientMeasures",
                        principalColumn: "PatientMeasureId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMeasureResults_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMeasureResults_Queries_QueryId",
                        column: x => x.QueryId,
                        principalTable: "Queries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMeasureResults_Questions_TriggerQuestionId",
                        column: x => x.TriggerQuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PatientMeasureTexts",
                columns: table => new
                {
                    PatientMeasureId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMeasureTexts", x => new { x.PatientMeasureId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_PatientMeasureTexts_Language_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Language",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMeasureTexts_PatientMeasures_PatientMeasureId",
                        column: x => x.PatientMeasureId,
                        principalTable: "PatientMeasures",
                        principalColumn: "PatientMeasureId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PersonnelMeasureResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PersonnelMeasureId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    QueryId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    TriggerQuestionId = table.Column<int>(type: "integer", nullable: true),
                    CategoryScore = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PersonnelId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelMeasureResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_PersonnelMeasures_PersonnelMeasureId",
                        column: x => x.PersonnelMeasureId,
                        principalTable: "PersonnelMeasures",
                        principalColumn: "PersonnelMeasureId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_Personnel_PersonnelId",
                        column: x => x.PersonnelId,
                        principalTable: "Personnel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_Queries_QueryId",
                        column: x => x.QueryId,
                        principalTable: "Queries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureResults_Questions_TriggerQuestionId",
                        column: x => x.TriggerQuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PersonnelMeasureTexts",
                columns: table => new
                {
                    PersonnelMeasureId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelMeasureTexts", x => new { x.PersonnelMeasureId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureTexts_Language_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Language",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelMeasureTexts_PersonnelMeasures_PersonnelMeasureId",
                        column: x => x.PersonnelMeasureId,
                        principalTable: "PersonnelMeasures",
                        principalColumn: "PersonnelMeasureId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureResults_CategoryId",
                table: "PatientMeasureResults",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureResults_PatientId",
                table: "PatientMeasureResults",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureResults_PatientMeasureId",
                table: "PatientMeasureResults",
                column: "PatientMeasureId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureResults_QueryId",
                table: "PatientMeasureResults",
                column: "QueryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureResults_TriggerQuestionId",
                table: "PatientMeasureResults",
                column: "TriggerQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasures_CategoryId",
                table: "PatientMeasures",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasures_QuestionId",
                table: "PatientMeasures",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasures_RequiredOption",
                table: "PatientMeasures",
                column: "RequiredOption");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMeasureTexts_LanguageCode",
                table: "PatientMeasureTexts",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_CategoryId",
                table: "PersonnelMeasureResults",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_PatientId",
                table: "PersonnelMeasureResults",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_PersonnelId",
                table: "PersonnelMeasureResults",
                column: "PersonnelId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_PersonnelMeasureId",
                table: "PersonnelMeasureResults",
                column: "PersonnelMeasureId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_QueryId",
                table: "PersonnelMeasureResults",
                column: "QueryId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureResults_TriggerQuestionId",
                table: "PersonnelMeasureResults",
                column: "TriggerQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasures_CategoryId",
                table: "PersonnelMeasures",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasures_QuestionId",
                table: "PersonnelMeasures",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasures_RequiredOption",
                table: "PersonnelMeasures",
                column: "RequiredOption");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelMeasureTexts_LanguageCode",
                table: "PersonnelMeasureTexts",
                column: "LanguageCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientMeasureResults");

            migrationBuilder.DropTable(
                name: "PatientMeasureTexts");

            migrationBuilder.DropTable(
                name: "PersonnelMeasureResults");

            migrationBuilder.DropTable(
                name: "PersonnelMeasureTexts");

            migrationBuilder.DropTable(
                name: "PatientMeasures");

            migrationBuilder.DropTable(
                name: "PersonnelMeasures");

            migrationBuilder.CreateTable(
                name: "Measures",
                columns: table => new
                {
                    MeasureId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    FallbackText = table.Column<string>(type: "text", nullable: false),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measures", x => x.MeasureId);
                    table.ForeignKey(
                        name: "FK_Measures_QuestionOptions_RequiredOption",
                        column: x => x.RequiredOption,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Measures_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeasureTexts",
                columns: table => new
                {
                    MeasureId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasureTexts", x => new { x.MeasureId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_MeasureTexts_Language_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Language",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeasureTexts_Measures_MeasureId",
                        column: x => x.MeasureId,
                        principalTable: "Measures",
                        principalColumn: "MeasureId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measures_QuestionId",
                table: "Measures",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Measures_RequiredOption",
                table: "Measures",
                column: "RequiredOption");

            migrationBuilder.CreateIndex(
                name: "IX_MeasureTexts_LanguageCode",
                table: "MeasureTexts",
                column: "LanguageCode");
        }
    }
}
