BEGIN;

DO $$
DECLARE
    home_kitchen_id integer;
    home_appliances_id integer;
    home_kitchen_count integer;
    home_appliances_count integer;
BEGIN
    SELECT COUNT(*) INTO home_kitchen_count
    FROM "Categories"
    WHERE "ParentCategoryId" IS NULL AND lower(trim("Name")) = 'home & kitchen';

    IF home_kitchen_count = 0 THEN
        RETURN;
    ELSIF home_kitchen_count <> 1 THEN
        RAISE EXCEPTION 'Expected one Home & Kitchen root category; found %', home_kitchen_count;
    END IF;

    SELECT COUNT(*) INTO home_appliances_count
    FROM "Categories"
    WHERE "ParentCategoryId" IS NULL AND lower(trim("Name")) = 'home appliances';

    IF home_appliances_count <> 1 THEN
        RAISE EXCEPTION 'Expected one Home Appliances root category; found %', home_appliances_count;
    END IF;

    SELECT "Id" INTO home_kitchen_id
    FROM "Categories"
    WHERE "ParentCategoryId" IS NULL AND lower(trim("Name")) = 'home & kitchen';

    SELECT "Id" INTO home_appliances_id
    FROM "Categories"
    WHERE "ParentCategoryId" IS NULL AND lower(trim("Name")) = 'home appliances';

    IF EXISTS (SELECT 1 FROM "Categories" WHERE "ParentCategoryId" = home_kitchen_id) THEN
        RAISE EXCEPTION 'Home & Kitchen still has child categories; refusing to delete it';
    END IF;

    UPDATE "Products"
    SET "CategoryId" = home_appliances_id
    WHERE "CategoryId" = home_kitchen_id;

    DELETE FROM "Categories"
    WHERE "Id" = home_kitchen_id
      AND NOT EXISTS (SELECT 1 FROM "Products" WHERE "CategoryId" = home_kitchen_id)
      AND NOT EXISTS (SELECT 1 FROM "Categories" WHERE "ParentCategoryId" = home_kitchen_id);

    IF FOUND IS NOT TRUE THEN
        RAISE EXCEPTION 'Home & Kitchen was not deleted after moving its products';
    END IF;
END $$;

COMMIT;
