using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddPersonnelIdToAnsweredQuery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PersonnelId",
                table: "AnsweredQueries",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AnsweredQueries_PersonnelId",
                table: "AnsweredQueries",
                column: "PersonnelId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnsweredQueries_Personnel_PersonnelId",
                table: "AnsweredQueries",
                column: "PersonnelId",
                principalTable: "Personnel",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnsweredQueries_Personnel_PersonnelId",
                table: "AnsweredQueries");

            migrationBuilder.DropIndex(
                name: "IX_AnsweredQueries_PersonnelId",
                table: "AnsweredQueries");

            migrationBuilder.DropColumn(
                name: "PersonnelId",
                table: "AnsweredQueries");
        }
    }
}
