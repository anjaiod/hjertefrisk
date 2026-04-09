using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RefactorToDoRuleToSpecializedTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDoRules_Categories_CategoryId",
                table: "ToDoRules");

            migrationBuilder.DropForeignKey(
                name: "FK_ToDoRules_QuestionOptions_RequiredOptionNavigationQuestionO~",
                table: "ToDoRules");

            migrationBuilder.DropForeignKey(
                name: "FK_ToDoRules_Questions_QuestionId",
                table: "ToDoRules");

            migrationBuilder.DropIndex(
                name: "IX_ToDoRules_CategoryId",
                table: "ToDoRules");

            migrationBuilder.DropIndex(
                name: "IX_ToDoRules_QuestionId",
                table: "ToDoRules");

            migrationBuilder.DropIndex(
                name: "IX_ToDoRules_RequiredOptionNavigationQuestionOptionId",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "RequiredOption",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "RequiredOptionNavigationQuestionOptionId",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "RequiredText",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "RequiredValue",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "ScoreThreshold",
                table: "ToDoRules");

            migrationBuilder.DropColumn(
                name: "TriggerType",
                table: "ToDoRules");

            migrationBuilder.CreateTable(
                name: "CategoryScoreRules",
                columns: table => new
                {
                    ToDoRuleId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    ScoreThreshold = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryScoreRules", x => x.ToDoRuleId);
                    table.ForeignKey(
                        name: "FK_CategoryScoreRules_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryScoreRules_ToDoRules_ToDoRuleId",
                        column: x => x.ToDoRuleId,
                        principalTable: "ToDoRules",
                        principalColumn: "ToDoRuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionAnswerRules",
                columns: table => new
                {
                    ToDoRuleId = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionAnswerRules", x => x.ToDoRuleId);
                    table.ForeignKey(
                        name: "FK_QuestionAnswerRules_QuestionOptions_RequiredOption",
                        column: x => x.RequiredOption,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_QuestionAnswerRules_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionAnswerRules_ToDoRules_ToDoRuleId",
                        column: x => x.ToDoRuleId,
                        principalTable: "ToDoRules",
                        principalColumn: "ToDoRuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryScoreRules_CategoryId",
                table: "CategoryScoreRules",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswerRules_QuestionId",
                table: "QuestionAnswerRules",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswerRules_RequiredOption",
                table: "QuestionAnswerRules",
                column: "RequiredOption");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryScoreRules");

            migrationBuilder.DropTable(
                name: "QuestionAnswerRules");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "ToDoRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "ToDoRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RequiredOption",
                table: "ToDoRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RequiredOptionNavigationQuestionOptionId",
                table: "ToDoRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequiredText",
                table: "ToDoRules",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RequiredValue",
                table: "ToDoRules",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ScoreThreshold",
                table: "ToDoRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TriggerType",
                table: "ToDoRules",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ToDoRules_CategoryId",
                table: "ToDoRules",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ToDoRules_QuestionId",
                table: "ToDoRules",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToDoRules_RequiredOptionNavigationQuestionOptionId",
                table: "ToDoRules",
                column: "RequiredOptionNavigationQuestionOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoRules_Categories_CategoryId",
                table: "ToDoRules",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoRules_QuestionOptions_RequiredOptionNavigationQuestionO~",
                table: "ToDoRules",
                column: "RequiredOptionNavigationQuestionOptionId",
                principalTable: "QuestionOptions",
                principalColumn: "QuestionOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoRules_Questions_QuestionId",
                table: "ToDoRules",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "QuestionId");
        }
    }
}
