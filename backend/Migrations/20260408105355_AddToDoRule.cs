using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddToDoRule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDos_Personnel_PersonnelId",
                table: "ToDos");

            migrationBuilder.AlterColumn<int>(
                name: "PersonnelId",
                table: "ToDos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateTable(
                name: "ToDoRules",
                columns: table => new
                {
                    ToDoRuleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: true),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    ScoreThreshold = table.Column<int>(type: "integer", nullable: true),
                    TriggerType = table.Column<int>(type: "integer", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    ToDoText = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: false),
                    RequiredOptionNavigationQuestionOptionId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToDoRules", x => x.ToDoRuleId);
                    table.ForeignKey(
                        name: "FK_ToDoRules_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId");
                    table.ForeignKey(
                        name: "FK_ToDoRules_QuestionOptions_RequiredOptionNavigationQuestionO~",
                        column: x => x.RequiredOptionNavigationQuestionOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId");
                    table.ForeignKey(
                        name: "FK_ToDoRules_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId");
                });

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
                name: "FK_ToDos_Personnel_PersonnelId",
                table: "ToDos",
                column: "PersonnelId",
                principalTable: "Personnel",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDos_Personnel_PersonnelId",
                table: "ToDos");

            migrationBuilder.DropTable(
                name: "ToDoRules");

            migrationBuilder.AlterColumn<int>(
                name: "PersonnelId",
                table: "ToDos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ToDos_Personnel_PersonnelId",
                table: "ToDos",
                column: "PersonnelId",
                principalTable: "Personnel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
