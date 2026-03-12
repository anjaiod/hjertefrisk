using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    MeasurementId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Unit = table.Column<string>(type: "text", nullable: false),
                    FallbackText = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.MeasurementId);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Personnel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personnel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Queries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Queries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FallbackText = table.Column<string>(type: "text", nullable: false),
                    QuestionType = table.Column<string>(type: "text", nullable: false),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    RequiredRole = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.QuestionId);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementTexts",
                columns: table => new
                {
                    MeasurementId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementTexts", x => new { x.MeasurementId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_MeasurementTexts_Languages_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Languages",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeasurementTexts_Measurements_MeasurementId",
                        column: x => x.MeasurementId,
                        principalTable: "Measurements",
                        principalColumn: "MeasurementId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementResults",
                columns: table => new
                {
                    MeasurementId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Result = table.Column<decimal>(type: "numeric", nullable: false),
                    RegisteredBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementResults", x => new { x.MeasurementId, x.PatientId, x.RegisteredAt });
                    table.ForeignKey(
                        name: "FK_MeasurementResults_Measurements_MeasurementId",
                        column: x => x.MeasurementId,
                        principalTable: "Measurements",
                        principalColumn: "MeasurementId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeasurementResults_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeasurementResults_Personnel_RegisteredBy",
                        column: x => x.RegisteredBy,
                        principalTable: "Personnel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PatientAccesses",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    PersonnelId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAccesses", x => new { x.PatientId, x.PersonnelId });
                    table.ForeignKey(
                        name: "FK_PatientAccesses_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientAccesses_Personnel_PersonnelId",
                        column: x => x.PersonnelId,
                        principalTable: "Personnel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ToDos",
                columns: table => new
                {
                    ToDoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Finished = table.Column<bool>(type: "boolean", nullable: false),
                    ToDoText = table.Column<string>(type: "text", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    PersonnelId = table.Column<int>(type: "integer", nullable: false),
                    Public = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToDos", x => x.ToDoId);
                    table.ForeignKey(
                        name: "FK_ToDos_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ToDos_Personnel_PersonnelId",
                        column: x => x.PersonnelId,
                        principalTable: "Personnel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QueryQuestions",
                columns: table => new
                {
                    QueryId = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QueryQuestions", x => new { x.QueryId, x.QuestionId });
                    table.ForeignKey(
                        name: "FK_QueryQuestions_Queries_QueryId",
                        column: x => x.QueryId,
                        principalTable: "Queries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QueryQuestions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptions",
                columns: table => new
                {
                    QuestionOptionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    FallbackText = table.Column<string>(type: "text", nullable: false),
                    OptionValue = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptions", x => x.QuestionOptionId);
                    table.ForeignKey(
                        name: "FK_QuestionOptions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionTexts",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionTexts", x => new { x.QuestionId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_QuestionTexts_Languages_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Languages",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionTexts_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Measures",
                columns: table => new
                {
                    MeasureId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    FallbackText = table.Column<string>(type: "text", nullable: false)
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
                name: "OptionTexts",
                columns: table => new
                {
                    QuestionOptionId = table.Column<int>(type: "integer", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OptionTexts", x => new { x.QuestionOptionId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_OptionTexts_Languages_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Languages",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OptionTexts_QuestionOptions_QuestionOptionId",
                        column: x => x.QuestionOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionDependencies",
                columns: table => new
                {
                    ParentQueryId = table.Column<int>(type: "integer", nullable: false),
                    ParentQuestionId = table.Column<int>(type: "integer", nullable: false),
                    ChildQueryId = table.Column<int>(type: "integer", nullable: false),
                    ChildQuestionId = table.Column<int>(type: "integer", nullable: false),
                    TriggerOptionId = table.Column<int>(type: "integer", nullable: true),
                    TriggerTextValue = table.Column<string>(type: "text", nullable: true),
                    TriggerNumberValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionDependencies", x => new { x.ParentQueryId, x.ParentQuestionId, x.ChildQueryId, x.ChildQuestionId });
                    table.ForeignKey(
                        name: "FK_QuestionDependencies_Queries_ChildQueryId",
                        column: x => x.ChildQueryId,
                        principalTable: "Queries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionDependencies_Queries_ParentQueryId",
                        column: x => x.ParentQueryId,
                        principalTable: "Queries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionDependencies_QuestionOptions_TriggerOptionId",
                        column: x => x.TriggerOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionDependencies_Questions_ChildQuestionId",
                        column: x => x.ChildQuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuestionDependencies_Questions_ParentQuestionId",
                        column: x => x.ParentQuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Responses",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    SelectedOptionId = table.Column<int>(type: "integer", nullable: true),
                    TextValue = table.Column<string>(type: "text", nullable: true),
                    NumberValue = table.Column<decimal>(type: "numeric", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Responses", x => new { x.PatientId, x.QuestionId });
                    table.ForeignKey(
                        name: "FK_Responses_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Responses_QuestionOptions_SelectedOptionId",
                        column: x => x.SelectedOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Responses_Questions_QuestionId",
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
                        name: "FK_MeasureTexts_Languages_LanguageCode",
                        column: x => x.LanguageCode,
                        principalTable: "Languages",
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
                name: "IX_MeasurementResults_PatientId",
                table: "MeasurementResults",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementResults_RegisteredBy",
                table: "MeasurementResults",
                column: "RegisteredBy");

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementTexts_LanguageCode",
                table: "MeasurementTexts",
                column: "LanguageCode");

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

            migrationBuilder.CreateIndex(
                name: "IX_OptionTexts_LanguageCode",
                table: "OptionTexts",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAccesses_PersonnelId",
                table: "PatientAccesses",
                column: "PersonnelId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_Email",
                table: "Patients",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Personnel_Email",
                table: "Personnel",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QueryQuestions_QuestionId",
                table: "QueryQuestions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionDependencies_ChildQueryId",
                table: "QuestionDependencies",
                column: "ChildQueryId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionDependencies_ChildQuestionId",
                table: "QuestionDependencies",
                column: "ChildQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionDependencies_ParentQuestionId",
                table: "QuestionDependencies",
                column: "ParentQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionDependencies_TriggerOptionId",
                table: "QuestionDependencies",
                column: "TriggerOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_QuestionId",
                table: "QuestionOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTexts_LanguageCode",
                table: "QuestionTexts",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_QuestionId",
                table: "Responses",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_SelectedOptionId",
                table: "Responses",
                column: "SelectedOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToDos_PatientId",
                table: "ToDos",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_ToDos_PersonnelId",
                table: "ToDos",
                column: "PersonnelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeasurementResults");

            migrationBuilder.DropTable(
                name: "MeasurementTexts");

            migrationBuilder.DropTable(
                name: "MeasureTexts");

            migrationBuilder.DropTable(
                name: "OptionTexts");

            migrationBuilder.DropTable(
                name: "PatientAccesses");

            migrationBuilder.DropTable(
                name: "QueryQuestions");

            migrationBuilder.DropTable(
                name: "QuestionDependencies");

            migrationBuilder.DropTable(
                name: "QuestionTexts");

            migrationBuilder.DropTable(
                name: "Responses");

            migrationBuilder.DropTable(
                name: "ToDos");

            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.DropTable(
                name: "Measures");

            migrationBuilder.DropTable(
                name: "Queries");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Personnel");

            migrationBuilder.DropTable(
                name: "QuestionOptions");

            migrationBuilder.DropTable(
                name: "Questions");
        }
    }
}
