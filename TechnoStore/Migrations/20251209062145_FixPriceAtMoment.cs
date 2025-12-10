using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnoStore.Migrations
{
    /// <inheritdoc />
    public partial class FixPriceAtMoment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PriceAtMoment",
                table: "OrderItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceAtMoment",
                table: "OrderItems");
        }
    }
}
