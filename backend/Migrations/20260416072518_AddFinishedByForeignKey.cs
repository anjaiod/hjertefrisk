using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddFinishedByForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ToDos_FinishedBy",
                table: "ToDos",
                column: "FinishedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDos_Personnel_FinishedBy",
                table: "ToDos",
                column: "FinishedBy",
                principalTable: "Personnel",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDos_Personnel_FinishedBy",
                table: "ToDos");

            migrationBuilder.DropIndex(
                name: "IX_ToDos_FinishedBy",
                table: "ToDos");
        }
    }
}
