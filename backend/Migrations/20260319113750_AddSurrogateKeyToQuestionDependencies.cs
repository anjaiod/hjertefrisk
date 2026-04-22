using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddSurrogateKeyToQuestionDependencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionDependencies",
                table: "QuestionDependencies");

            // Column already exists with a default value from manual SQL — nothing to do here

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionDependencies",
                table: "QuestionDependencies",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionDependencies_ParentQueryId_ParentQuestionId_ChildQu~",
                table: "QuestionDependencies",
                columns: new[] { "ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId", "TriggerOptionId" },
                unique: true);
        }
        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionDependencies",
                table: "QuestionDependencies");

            migrationBuilder.DropIndex(
                name: "IX_QuestionDependencies_ParentQueryId_ParentQuestionId_ChildQu~",
                table: "QuestionDependencies");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "QuestionDependencies");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionDependencies",
                table: "QuestionDependencies",
                columns: new[] { "ParentQueryId", "ParentQuestionId", "ChildQueryId", "ChildQuestionId" });
        }
    }
}
