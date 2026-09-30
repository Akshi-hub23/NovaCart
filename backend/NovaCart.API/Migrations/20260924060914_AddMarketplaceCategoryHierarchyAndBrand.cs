using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaCart.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceCategoryHierarchyAndBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentCategoryId",
                table: "Categories",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql("""
                INSERT INTO "Categories" ("Name", "Description", "ParentCategoryId")
                SELECT seed."Name", seed."Description", NULL
                FROM (VALUES
                    ('Fashion', 'Clothing, footwear and accessories for the family.'),
                    ('Mobiles', 'Mobile phones and related products.'),
                    ('Electronics', 'Consumer electronics and accessories.'),
                    ('Beauty', 'Beauty and personal care products.'),
                    ('Toys', 'Toys, games and sports products.')
                ) AS seed("Name", "Description")
                WHERE NOT EXISTS (SELECT 1 FROM "Categories" current WHERE lower(current."Name") = lower(seed."Name") AND current."ParentCategoryId" IS NULL);

                INSERT INTO "Categories" ("Name", "Description", "ParentCategoryId")
                SELECT seed."Name", '', parent."Id"
                FROM (VALUES
                    ('Men', 'Fashion'), ('Women', 'Fashion'), ('Kids', 'Fashion'),
                    ('Earphones', 'Electronics'), ('Laptops', 'Electronics'), ('Tablets', 'Electronics'), ('Mouse', 'Electronics'), ('Chargers', 'Electronics'), ('Headphones', 'Electronics'), ('Power Banks', 'Electronics'),
                    ('Lip Balm', 'Beauty'), ('Lipstick', 'Beauty'), ('Eyeliner', 'Beauty'), ('Eyeshadow', 'Beauty'), ('Foundation', 'Beauty'), ('Powder', 'Beauty'), ('Sunscreen', 'Beauty'),
                    ('Cars', 'Toys'), ('Dolls', 'Toys'), ('Indoor Games', 'Toys'), ('Bat', 'Toys'), ('Ball', 'Toys'), ('Football', 'Toys'), ('Shuttle', 'Toys')
                ) AS seed("Name", "ParentName")
                JOIN "Categories" parent ON lower(parent."Name") = lower(seed."ParentName") AND parent."ParentCategoryId" IS NULL
                WHERE NOT EXISTS (SELECT 1 FROM "Categories" current WHERE lower(current."Name") = lower(seed."Name") AND current."ParentCategoryId" = parent."Id");

                INSERT INTO "Categories" ("Name", "Description", "ParentCategoryId")
                SELECT seed."Name", '', parent."Id"
                FROM (VALUES
                    ('Shirts', 'Men'), ('T-Shirts', 'Men'), ('Shoes', 'Men'), ('Bags', 'Men'), ('Sunglasses', 'Men'),
                    ('Dresses', 'Women'), ('Kurtis', 'Women'), ('Kurti Sets', 'Women'), ('Pants', 'Women'), ('Skirts', 'Women'), ('Shirts', 'Women'), ('T-Shirts', 'Women'), ('Shoes', 'Women'), ('Bags', 'Women'), ('Sunglasses', 'Women'),
                    ('Boys', 'Kids'), ('Girls', 'Kids')
                ) AS seed("Name", "ParentName")
                JOIN "Categories" parent ON lower(parent."Name") = lower(seed."ParentName")
                JOIN "Categories" root ON root."Id" = parent."ParentCategoryId" AND lower(root."Name") = 'fashion'
                WHERE NOT EXISTS (SELECT 1 FROM "Categories" current WHERE lower(current."Name") = lower(seed."Name") AND current."ParentCategoryId" = parent."Id");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ParentCategoryId",
                table: "Categories");
        }
    }
}
