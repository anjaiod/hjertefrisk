using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddSeverityModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Severities",
                columns: table => new
                {
                    SeverityId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    RequiredOption = table.Column<int>(type: "integer", nullable: true),
                    RequiredText = table.Column<string>(type: "text", nullable: true),
                    RequiredValue = table.Column<decimal>(type: "numeric", nullable: true),
                    Operator = table.Column<string>(type: "text", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Severities", x => x.SeverityId);
                    table.ForeignKey(
                        name: "FK_Severities_QuestionOptions_RequiredOption",
                        column: x => x.RequiredOption,
                        principalTable: "QuestionOptions",
                        principalColumn: "QuestionOptionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Severities_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Severities_QuestionId",
                table: "Severities",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Severities_RequiredOption",
                table: "Severities",
                column: "RequiredOption");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Severities");
        }
    }
}
