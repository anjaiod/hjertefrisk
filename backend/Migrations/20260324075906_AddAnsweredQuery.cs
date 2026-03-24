using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddAnsweredQuery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM \"Responses\";");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Responses",
                table: "Responses");

            migrationBuilder.AddColumn<int>(
                name: "AnsweredQueryId",
                table: "Responses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Responses",
                table: "Responses",
                columns: new[] { "AnsweredQueryId", "PatientId", "QuestionId" });

            migrationBuilder.CreateTable(
                name: "AnsweredQueries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnsweredQueries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnsweredQueries_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Responses_PatientId",
                table: "Responses",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AnsweredQueries_PatientId",
                table: "AnsweredQueries",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Responses_AnsweredQueries_AnsweredQueryId",
                table: "Responses",
                column: "AnsweredQueryId",
                principalTable: "AnsweredQueries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Responses_AnsweredQueries_AnsweredQueryId",
                table: "Responses");

            migrationBuilder.DropTable(
                name: "AnsweredQueries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Responses",
                table: "Responses");

            migrationBuilder.DropIndex(
                name: "IX_Responses_PatientId",
                table: "Responses");

            migrationBuilder.DropColumn(
                name: "AnsweredQueryId",
                table: "Responses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Responses",
                table: "Responses",
                columns: new[] { "PatientId", "QuestionId" });
        }
    }
}
