using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using NovaCart.API.Data;

#nullable disable

namespace NovaCart.API.Migrations;

[DbContext(typeof(NovaCartDbContext))]
[Migration("20260913000000_AddPaymentMethod")]
public partial class AddPaymentMethod : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "PaymentMethod",
            table: "Order",
            type: "text",
            nullable: false,
            defaultValue: "Cash on Delivery");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "PaymentMethod",
            table: "Order");
    }
}
