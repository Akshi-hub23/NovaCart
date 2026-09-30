BEGIN;

INSERT INTO "Categories" ("Name", "Description", "ParentCategoryId")
SELECT requested."Name", requested."Description", NULL
FROM (VALUES
    ('Home Appliances', 'Large and small appliances for everyday home use.'),
    ('Health', 'Fitness, personal care and health monitoring essentials.'),
    ('Food', 'Pantry staples, snacks and everyday treats.')
) AS requested("Name", "Description")
WHERE NOT EXISTS (
    SELECT 1 FROM "Categories" existing
    WHERE existing."ParentCategoryId" IS NULL
      AND lower(trim(existing."Name")) = lower(trim(requested."Name"))
);

INSERT INTO "Categories" ("Name", "Description", "ParentCategoryId")
SELECT requested."Name", 'Products and essentials in ' || requested."Name" || '.', parent."Id"
FROM (VALUES
    ('Home Appliances', 'Air Conditioners'), ('Home Appliances', 'Refrigerators'),
    ('Home Appliances', 'Washing Machines'), ('Home Appliances', 'Microwave Ovens'),
    ('Home Appliances', 'Air Coolers'), ('Home Appliances', 'Vacuum Cleaners'),
    ('Home Appliances', 'Fans'), ('Home Appliances', 'Water Heaters'),
    ('Health', 'Personal Care'), ('Health', 'Fitness Equipment'),
    ('Health', 'Health Monitoring'), ('Health', 'Wellness'),
    ('Food', 'Snacks'), ('Food', 'Beverages'), ('Food', 'Breakfast'),
    ('Food', 'Dry Fruits'), ('Food', 'Instant Foods'), ('Food', 'Chocolates')
) AS requested("ParentName", "Name")
JOIN "Categories" parent
  ON parent."ParentCategoryId" IS NULL
 AND lower(trim(parent."Name")) = lower(trim(requested."ParentName"))
WHERE NOT EXISTS (
    SELECT 1 FROM "Categories" existing
    WHERE existing."ParentCategoryId" = parent."Id"
      AND lower(trim(existing."Name")) = lower(trim(requested."Name"))
);

WITH seed("RootName", "CategoryName", "Name", "Brand", "Description", "Price", "StockQuantity", "ImageUrl", "AttributesJson") AS (VALUES
    ('Home Appliances', 'Air Conditioners', 'Voltas 1.5 Ton 3 Star Inverter Split AC', 'Voltas', 'Energy-conscious inverter split air conditioner with copper condenser and sleep mode.', 36990, 8, 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=700&auto=format&fit=crop&q=80', '{"productType":"Split AC","capacity":"1.5 Ton","energyRating":"3 star"}'),
    ('Home Appliances', 'Refrigerators', 'LG 242L Double Door Frost Free Refrigerator', 'LG', 'Convertible frost-free refrigerator with a spacious freezer and inverter compressor.', 28990, 7, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=700&auto=format&fit=crop&q=80', '{"productType":"Refrigerator","capacity":"242L","energyRating":"3 star"}'),
    ('Home Appliances', 'Washing Machines', 'Samsung 7kg Fully Automatic Front Load Washer', 'Samsung', 'Front-load washing machine with multiple fabric cycles and a digital inverter motor.', 32990, 6, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&auto=format&fit=crop&q=80', '{"productType":"Front Load Washer","capacity":"7kg","energyRating":"5 star"}'),
    ('Home Appliances', 'Microwave Ovens', 'IFB 25L Convection Microwave Oven', 'IFB', 'Convection microwave with multi-stage cooking and a stainless steel cavity.', 12990, 10, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=700&auto=format&fit=crop&q=80', '{"productType":"Convection Microwave","capacity":"25L"}'),
    ('Home Appliances', 'Air Coolers', 'Bajaj PX 97 Torque Personal Air Cooler', 'Bajaj', 'Compact personal cooler with honeycomb pads and a three-speed fan.', 6499, 12, 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=700&auto=format&fit=crop&q=80', '{"productType":"Personal Air Cooler","capacity":"36L"}'),
    ('Home Appliances', 'Vacuum Cleaners', 'Philips PowerPro Compact Bagless Vacuum Cleaner', 'Philips', 'Bagless vacuum cleaner with cyclonic airflow and a washable filter.', 8999, 9, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=700&auto=format&fit=crop&q=80', '{"productType":"Bagless Vacuum Cleaner","energyRating":"A"}'),
    ('Home Appliances', 'Fans', 'Crompton Energion Hyperjet 1200mm Ceiling Fan', 'Crompton', 'High-speed ceiling fan with an energy-efficient motor and remote control.', 3499, 15, 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=700&auto=format&fit=crop&q=80', '{"productType":"Ceiling Fan","energyRating":"5 star"}'),
    ('Home Appliances', 'Water Heaters', 'Racold Pronto Neo 3L Instant Water Heater', 'Racold', 'Compact instant water heater with safety valve and rust-proof outer body.', 3899, 11, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=700&auto=format&fit=crop&q=80', '{"productType":"Instant Water Heater","capacity":"3L","energyRating":"5 star"}'),
    ('Health', 'Personal Care', 'Philips OneBlade Hybrid Face Trimmer', 'Philips', 'Rechargeable face trimmer with a dual-sided blade for precise grooming.', 2499, 18, 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=700&auto=format&fit=crop&q=80', '{"productType":"Electric Trimmer"}'),
    ('Health', 'Personal Care', 'Braun All-in-One Series 3 Grooming Kit', 'Braun', 'Washable grooming kit with comb attachments for beard and body trimming.', 3999, 12, 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=700&auto=format&fit=crop&q=80', '{"productType":"Grooming Kit"}'),
    ('Health', 'Fitness Equipment', 'Boldfit Premium Anti-Skid Yoga Mat', 'Boldfit', 'Textured exercise mat with cushioning for yoga and floor workouts.', 999, 25, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=700&auto=format&fit=crop&q=80', '{"productType":"Yoga Mat"}'),
    ('Health', 'Fitness Equipment', 'Boldfit Resistance Bands Set of 5', 'Boldfit', 'Five resistance levels for warm-ups, strength work and mobility training.', 799, 30, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=700&auto=format&fit=crop&q=80', '{"productType":"Resistance Bands"}'),
    ('Health', 'Fitness Equipment', 'Kore Adjustable 20kg Dumbbell Set', 'Kore', 'Adjustable home workout dumbbells with secure spin-lock collars.', 3299, 10, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&auto=format&fit=crop&q=80', '{"productType":"Adjustable Dumbbells","weight":"20kg"}'),
    ('Health', 'Health Monitoring', 'Dr Trust Digital Infrared Thermometer', 'Dr Trust', 'Non-contact infrared thermometer with a clear backlit temperature display.', 1299, 20, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&auto=format&fit=crop&q=80', '{"productType":"Digital Thermometer"}'),
    ('Health', 'Health Monitoring', 'Omron HEM-7120 Automatic Blood Pressure Monitor', 'Omron', 'Upper-arm blood pressure monitor with one-touch operation and memory.', 2199, 14, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80', '{"productType":"Blood Pressure Monitor"}'),
    ('Health', 'Health Monitoring', 'Beurer PO 30 Pulse Oximeter', 'Beurer', 'Compact fingertip pulse oximeter with a colour display and automatic shutdown.', 1799, 13, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&auto=format&fit=crop&q=80', '{"productType":"Pulse Oximeter"}'),
    ('Health', 'Health Monitoring', 'HealthSense PS 126 Digital Body Weighing Scale', 'HealthSense', 'Tempered-glass digital scale with a clear display and auto-on function.', 999, 17, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&auto=format&fit=crop&q=80', '{"productType":"Digital Weighing Scale"}'),
    ('Health', 'Wellness', 'Boldfit High-Density Foam Roller', 'Boldfit', 'Textured foam roller for post-workout mobility and muscle recovery routines.', 1199, 16, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80', '{"productType":"Foam Roller"}'),
    ('Food', 'Snacks', 'Tata Sampann Multigrain Munchies', 'Tata Sampann', 'Crunchy roasted multigrain snack with a lightly seasoned flavour.', 120, 40, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80', '{"productType":"Multigrain Snack","dietary":"Vegetarian"}'),
    ('Food', 'Snacks', 'True Elements Roasted Snack Mix', 'True Elements', 'Roasted seed and grain snack mix for a savoury pantry snack.', 249, 28, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&auto=format&fit=crop&q=80', '{"productType":"Snack Mix","dietary":"Vegetarian"}'),
    ('Food', 'Beverages', 'Tata Coffee Grand Premium Filter Coffee', 'Tata Coffee', 'Aromatic ground coffee blend suitable for filter coffee and decoction brewing.', 325, 32, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&auto=format&fit=crop&q=80', '{"productType":"Ground Coffee"}'),
    ('Food', 'Beverages', 'Twinings Green Tea Pure Green Tea Bags', 'Twinings', 'Light, smooth green tea bags packed for convenient daily brewing.', 399, 26, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80', '{"productType":"Green Tea"}'),
    ('Food', 'Breakfast', 'Quaker Oats Rolled Oats', 'Quaker', 'Wholegrain rolled oats for a warm breakfast, overnight oats or baking.', 199, 38, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=700&auto=format&fit=crop&q=80', '{"productType":"Rolled Oats","dietary":"Vegetarian"}'),
    ('Food', 'Breakfast', 'Kellogg''s Crunchy Granola Almonds & Cranberries', 'Kellogg''s', 'Toasted oat granola with almonds and cranberries for breakfast or snacking.', 425, 22, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=700&auto=format&fit=crop&q=80', '{"productType":"Granola"}'),
    ('Food', 'Dry Fruits', 'Happilo Premium California Almonds', 'Happilo', 'Whole California almonds selected for everyday snacking and cooking.', 499, 24, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&auto=format&fit=crop&q=80', '{"productType":"Almonds"}'),
    ('Food', 'Dry Fruits', 'Happilo Whole Cashews', 'Happilo', 'Whole cashews with a naturally rich taste for snacks and recipes.', 549, 20, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&auto=format&fit=crop&q=80', '{"productType":"Cashews"}'),
    ('Food', 'Dry Fruits', 'True Elements Daily Nut Mix', 'True Elements', 'Almonds, cashews, raisins and seeds blended for convenient snacking.', 399, 23, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&auto=format&fit=crop&q=80', '{"productType":"Mixed Nuts"}'),
    ('Food', 'Instant Foods', 'Saffola Masala Oats Classic Masala', 'Saffola', 'Quick-cooking savoury oats with a mild spice blend for an easy meal.', 180, 35, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=700&auto=format&fit=crop&q=80', '{"productType":"Instant Oats"}'),
    ('Food', 'Instant Foods', 'MTR Ready to Eat Vegetable Pulao', 'MTR', 'Shelf-stable ready-to-eat vegetable pulao for a quick pantry meal.', 125, 30, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80', '{"productType":"Instant Meal","dietary":"Vegetarian"}'),
    ('Food', 'Chocolates', 'Amul 55% Dark Chocolate Bar', 'Amul', 'Rich dark chocolate bar with a balanced cocoa flavour.', 120, 34, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80', '{"productType":"Dark Chocolate"}'),
    ('Food', 'Chocolates', 'Cadbury Dairy Milk Chocolate Bar', 'Cadbury', 'Classic smooth milk chocolate made for sharing or an everyday treat.', 100, 42, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80', '{"productType":"Milk Chocolate"}')
), resolved AS (
    SELECT seed.*, category."Id" AS "CategoryId"
    FROM seed
    JOIN "Categories" root
      ON root."ParentCategoryId" IS NULL
     AND lower(trim(root."Name")) = lower(trim(seed."RootName"))
    JOIN "Categories" category
      ON category."ParentCategoryId" = root."Id"
     AND lower(trim(category."Name")) = lower(trim(seed."CategoryName"))
)
INSERT INTO "Products" ("CategoryId", "Name", "Brand", "Description", "Price", "StockQuantity", "ImageUrl", "AttributesJson", "IsActive", "CreatedAt")
SELECT resolved."CategoryId", resolved."Name", resolved."Brand", resolved."Description", resolved."Price", resolved."StockQuantity", resolved."ImageUrl", resolved."AttributesJson", true, CURRENT_TIMESTAMP
FROM resolved
WHERE NOT EXISTS (
    SELECT 1 FROM "Products" existing
    WHERE existing."CategoryId" = resolved."CategoryId"
      AND lower(trim(existing."Name")) = lower(trim(resolved."Name"))
);

COMMIT;
