using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddToDoRuleIdForeignKeyConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ToDos_ToDoRuleId",
                table: "ToDos",
                column: "ToDoRuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDos_ToDoRules_ToDoRuleId",
                table: "ToDos",
                column: "ToDoRuleId",
                principalTable: "ToDoRules",
                principalColumn: "ToDoRuleId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDos_ToDoRules_ToDoRuleId",
                table: "ToDos");

            migrationBuilder.DropIndex(
                name: "IX_ToDos_ToDoRuleId",
                table: "ToDos");
        }
    }
}
