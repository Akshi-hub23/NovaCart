using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaCart.API.Migrations
{
    /// <inheritdoc />
    public partial class OrganizeExistingMarketplaceCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Categories" legacy
                SET "ParentCategoryId" = parent."Id"
                FROM "Categories" parent
                WHERE legacy."ParentCategoryId" IS NULL
                  AND lower(legacy."Name") IN ('mobiles & accessories', 'laptops & computers', 'audio', 'wearables', 'beauty & personal care')
                  AND lower(parent."Name") = lower(CASE lower(legacy."Name")
                    WHEN 'mobiles & accessories' THEN 'Mobiles'
                    WHEN 'laptops & computers' THEN 'Electronics'
                    WHEN 'audio' THEN 'Electronics'
                    WHEN 'wearables' THEN 'Electronics'
                    WHEN 'beauty & personal care' THEN 'Beauty'
                  END)
                  AND parent."ParentCategoryId" IS NULL;

                UPDATE "Products" product
                SET "CategoryId" = target."Id"
                FROM "Categories" oldCategory
                JOIN "Categories" target ON lower(target."Name") = 'laptops'
                JOIN "Categories" electronics ON electronics."Id" = target."ParentCategoryId" AND lower(electronics."Name") = 'electronics'
                WHERE product."CategoryId" = oldCategory."Id"
                  AND lower(oldCategory."Name") = 'laptops & computers'
                  AND (lower(product."Name") LIKE '%laptop%' OR lower(product."Name") LIKE '%macbook%' OR lower(product."Description") LIKE '%laptop%');

                UPDATE "Products" product
                SET "CategoryId" = target."Id"
                FROM "Categories" target
                WHERE target."ParentCategoryId" = (SELECT "Id" FROM "Categories" WHERE lower("Name") = 'electronics' AND "ParentCategoryId" IS NULL LIMIT 1)
                  AND ((lower(target."Name") = 'mouse' AND lower(product."Name") LIKE '%mouse%')
                    OR (lower(target."Name") = 'chargers' AND lower(product."Name") LIKE '%charger%')
                    OR (lower(target."Name") = 'headphones' AND (lower(product."Name") LIKE '%headphone%' OR lower(product."Name") LIKE '%headset%'))
                    OR (lower(target."Name") = 'earphones' AND (lower(product."Name") LIKE '%earbud%' OR lower(product."Name") LIKE '%earphone%')))
                  AND product."CategoryId" IN (
                    SELECT "Id" FROM "Categories" WHERE lower("Name") = 'electronics' AND "ParentCategoryId" IS NULL
                    UNION SELECT "Id" FROM "Categories" WHERE lower("Name") = 'audio'
                  );

                UPDATE "Products"
                SET "Brand" = CASE
                    WHEN lower("Name") LIKE 'apple %' THEN 'Apple'
                    WHEN lower("Name") LIKE 'samsung %' THEN 'Samsung'
                    WHEN lower("Name") LIKE 'oneplus %' THEN 'OnePlus'
                    WHEN lower("Name") LIKE 'spigen %' THEN 'Spigen'
                    WHEN lower("Name") LIKE 'logitech %' THEN 'Logitech'
                    WHEN lower("Name") LIKE 'anker %' THEN 'Anker'
                    WHEN lower("Name") LIKE 'dell %' THEN 'Dell'
                    WHEN lower("Name") LIKE 'keychron %' THEN 'Keychron'
                    WHEN lower("Name") LIKE 'sony %' THEN 'Sony'
                    WHEN lower("Name") LIKE 'boat %' THEN 'boAt'
                    WHEN lower("Name") LIKE 'jbl %' THEN 'JBL'
                    WHEN lower("Name") LIKE 'marshall %' THEN 'Marshall'
                    WHEN lower("Name") LIKE 'fitbit %' THEN 'Fitbit'
                    WHEN lower("Name") LIKE 'philips %' THEN 'Philips'
                    WHEN lower("Name") LIKE 'ikea %' THEN 'IKEA'
                    WHEN lower("Name") LIKE 'levi''s %' THEN 'Levi''s'
                    WHEN lower("Name") LIKE 'puma %' THEN 'Puma'
                    WHEN lower("Name") LIKE 'herschel %' THEN 'Herschel'
                    WHEN lower("Name") LIKE 'minimalist %' THEN 'Minimalist'
                    ELSE "Brand"
                END
                WHERE "Brand" IS NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Products"
                SET "Brand" = NULL
                WHERE ("Brand" = 'Apple' AND lower("Name") LIKE 'apple %')
                   OR ("Brand" = 'Samsung' AND lower("Name") LIKE 'samsung %')
                   OR ("Brand" = 'OnePlus' AND lower("Name") LIKE 'oneplus %')
                   OR ("Brand" = 'Spigen' AND lower("Name") LIKE 'spigen %')
                   OR ("Brand" = 'Logitech' AND lower("Name") LIKE 'logitech %')
                   OR ("Brand" = 'Anker' AND lower("Name") LIKE 'anker %')
                   OR ("Brand" = 'Dell' AND lower("Name") LIKE 'dell %')
                   OR ("Brand" = 'Keychron' AND lower("Name") LIKE 'keychron %')
                   OR ("Brand" = 'Sony' AND lower("Name") LIKE 'sony %')
                   OR ("Brand" = 'boAt' AND lower("Name") LIKE 'boat %')
                   OR ("Brand" = 'JBL' AND lower("Name") LIKE 'jbl %')
                   OR ("Brand" = 'Marshall' AND lower("Name") LIKE 'marshall %')
                   OR ("Brand" = 'Fitbit' AND lower("Name") LIKE 'fitbit %')
                   OR ("Brand" = 'Philips' AND lower("Name") LIKE 'philips %')
                   OR ("Brand" = 'IKEA' AND lower("Name") LIKE 'ikea %')
                   OR ("Brand" = 'Levi''s' AND lower("Name") LIKE 'levi''s %')
                   OR ("Brand" = 'Puma' AND lower("Name") LIKE 'puma %')
                   OR ("Brand" = 'Herschel' AND lower("Name") LIKE 'herschel %')
                   OR ("Brand" = 'Minimalist' AND lower("Name") LIKE 'minimalist %');
                """);
        }
    }
}
