using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaCart.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductAttributesJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttributesJson",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "{}");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttributesJson",
                table: "Products");
        }
    }
}
