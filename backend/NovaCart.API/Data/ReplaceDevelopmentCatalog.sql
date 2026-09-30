BEGIN;

-- Preserve development products that are already part of purchase, review, cart,
-- or wishlist history. The other known sample rows can be removed safely.
UPDATE "Products" AS product
SET "IsActive" = false
WHERE product."Name" IN (
    'Wireless Mouse Updated', 'Wireless Headphones', 'Legacy Mobile Phone', 'Legacy Mobile',
    'Apple iPhone 16', 'Samsung Galaxy S25', 'OnePlus 13R', 'Spigen Ultra Hybrid Phone Case',
    'Logitech MX Master 3S', 'Anker 735 Nano II Charger', 'Dell Inspiron 14', 'Apple MacBook Air 13',
    'Keychron K2 Mechanical Keyboard', 'Sony WH-1000XM5', 'boAt Airdopes 141',
    'JBL Flip 6 Portable Speaker', 'Marshall Emberton II', 'Apple Watch Series 10',
    'Samsung Galaxy Watch 7', 'Fitbit Charge 6', 'Philips Air Fryer',
    'Borosilicate Glass Storage Set', 'Levi''s 511 Slim Jeans', 'Puma Smash v2 Sneakers',
    'Herschel Classic Backpack', 'Philips OneBlade Trimmer', 'Minimalist Skincare Essentials Set',
    'IKEA Raskog Utility Trolley'
)
AND (
    EXISTS (SELECT 1 FROM "OrderItem" item WHERE item."ProductId" = product."Id") OR
    EXISTS (SELECT 1 FROM "CartItem" item WHERE item."ProductId" = product."Id") OR
    EXISTS (SELECT 1 FROM "WishlistItem" item WHERE item."ProductId" = product."Id") OR
    EXISTS (SELECT 1 FROM "Review" item WHERE item."ProductId" = product."Id")
);

DELETE FROM "Products" AS product
WHERE product."Name" IN (
    'Wireless Mouse Updated', 'Wireless Headphones', 'Legacy Mobile Phone', 'Legacy Mobile',
    'Apple iPhone 16', 'Samsung Galaxy S25', 'OnePlus 13R', 'Spigen Ultra Hybrid Phone Case',
    'Logitech MX Master 3S', 'Anker 735 Nano II Charger', 'Dell Inspiron 14', 'Apple MacBook Air 13',
    'Keychron K2 Mechanical Keyboard', 'Sony WH-1000XM5', 'boAt Airdopes 141',
    'JBL Flip 6 Portable Speaker', 'Marshall Emberton II', 'Apple Watch Series 10',
    'Samsung Galaxy Watch 7', 'Fitbit Charge 6', 'Philips Air Fryer',
    'Borosilicate Glass Storage Set', 'Levi''s 511 Slim Jeans', 'Puma Smash v2 Sneakers',
    'Herschel Classic Backpack', 'Philips OneBlade Trimmer', 'Minimalist Skincare Essentials Set',
    'IKEA Raskog Utility Trolley'
)
AND NOT EXISTS (SELECT 1 FROM "OrderItem" item WHERE item."ProductId" = product."Id")
AND NOT EXISTS (SELECT 1 FROM "CartItem" item WHERE item."ProductId" = product."Id")
AND NOT EXISTS (SELECT 1 FROM "WishlistItem" item WHERE item."ProductId" = product."Id")
AND NOT EXISTS (SELECT 1 FROM "Review" item WHERE item."ProductId" = product."Id");

WITH seed("CategoryName", "ParentName", "RootName", "Name", "Brand", "Description", "Price", "StockQuantity", "ImageUrl", "AttributesJson") AS (VALUES
    ('Shirts', 'Men', 'Fashion', 'Allen Solly Men Slim Fit Oxford Shirt', 'Allen Solly', 'A crisp cotton-rich Oxford shirt with a tailored fit for work and weekend wear.', 1899, 24, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80', '{"gender":"Men","productType":"Shirt","size":"M","color":"Light Blue"}'),
    ('T-Shirts', 'Men', 'Fashion', 'Roadster Men Classic Cotton T-Shirt', 'Roadster', 'Soft everyday cotton jersey with a regular fit and reinforced neckline.', 699, 38, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&auto=format&fit=crop&q=80', '{"gender":"Men","productType":"T-Shirt","size":"M","color":"Navy"}'),
    ('Shoes', 'Men', 'Fashion', 'Puma Men Anzarun Lite Running Shoes', 'Puma', 'Lightweight mesh running shoes with cushioned midsoles for daily training.', 3299, 16, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80', '{"gender":"Men","productType":"Running Shoes","size":"9","color":"Black"}'),
    ('Bags', 'Men', 'Fashion', 'American Tourister Urban Laptop Backpack', 'American Tourister', 'A water-resistant commuter backpack with a padded 15.6-inch laptop sleeve.', 2499, 14, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80', '{"gender":"Men","productType":"Backpack","color":"Charcoal"}'),
    ('Sunglasses', 'Men', 'Fashion', 'Fastrack Men UV-Protected Aviators', 'Fastrack', 'Classic lightweight aviator frames with UV-protective lenses.', 1599, 20, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=80', '{"gender":"Men","productType":"Sunglasses","color":"Gunmetal"}'),
    ('Dresses', 'Women', 'Fashion', 'Aurelia Women Floral A-Line Dress', 'Aurelia', 'A breathable printed A-line dress with a comfortable knee-length cut.', 2199, 18, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Dress","size":"M","color":"Blue Floral"}'),
    ('Kurtis', 'Women', 'Fashion', 'Biba Women Printed Straight Kurta', 'Biba', 'A soft cotton straight kurta with a subtle floral print and three-quarter sleeves.', 1499, 26, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Kurti","size":"M","color":"Maroon"}'),
    ('Kurti Sets', 'Women', 'Fashion', 'Aurelia Women Embroidered Kurta Set', 'Aurelia', 'A coordinated kurta, trouser and dupatta set with light festive embroidery.', 3299, 12, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Kurti Set","size":"M","color":"Teal"}'),
    ('Pants', 'Women', 'Fashion', 'Van Heusen Women Straight Fit Trousers', 'Van Heusen', 'Stretch-blend straight fit trousers designed for comfortable office wear.', 1999, 16, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Trousers","size":"M","color":"Black"}'),
    ('Skirts', 'Women', 'Fashion', 'Max Women Pleated Midi Skirt', 'Max', 'A lightweight pleated midi skirt with an elasticated waist for easy styling.', 1299, 20, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Skirt","size":"M","color":"Olive"}'),
    ('Shirts', 'Women', 'Fashion', 'Allen Solly Women Relaxed Cotton Shirt', 'Allen Solly', 'A relaxed cotton shirt with a curved hem and button cuffs.', 1699, 17, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Shirt","size":"M","color":"White"}'),
    ('T-Shirts', 'Women', 'Fashion', 'Adidas Women Essentials Logo T-Shirt', 'Adidas', 'A soft cotton-blend training tee with a classic crew neck.', 1299, 22, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"T-Shirt","size":"M","color":"Pink"}'),
    ('Shoes', 'Women', 'Fashion', 'Adidas Women Runfalcon 3.0 Shoes', 'Adidas', 'Supportive everyday running shoes with a breathable upper and cushioned ride.', 3999, 13, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Running Shoes","size":"7","color":"White"}'),
    ('Bags', 'Women', 'Fashion', 'Lavie Women Structured Everyday Handbag', 'Lavie', 'A structured faux-leather handbag with organised compartments and a zip closure.', 2299, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Handbag","color":"Tan"}'),
    ('Sunglasses', 'Women', 'Fashion', 'Fastrack Women UV-Protected Cat-Eye Sunglasses', 'Fastrack', 'Lightweight cat-eye sunglasses with UV-protected lenses.', 1799, 19, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&auto=format&fit=crop&q=80', '{"gender":"Women","productType":"Sunglasses","color":"Brown"}'),
    ('Boys', 'Kids', 'Fashion', 'Max Boys Cotton Graphic T-Shirt', 'Max', 'A comfortable cotton jersey tee with a playful front graphic.', 499, 30, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&auto=format&fit=crop&q=80', '{"gender":"Boys","productType":"T-Shirt","size":"8Y","color":"Green"}'),
    ('Girls', 'Kids', 'Fashion', 'Max Girls Party Dress', 'Max', 'A soft occasion dress with a layered skirt and comfortable lining.', 1299, 16, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&auto=format&fit=crop&q=80', '{"gender":"Girls","productType":"Dress","size":"8Y","color":"Pink"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Samsung Galaxy A56 5G 256GB', 'Samsung', 'A vivid AMOLED smartphone with a versatile camera system and all-day battery.', 41999, 18, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"256","batteryMah":"5000","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Apple iPhone 16 128GB', 'Apple', 'A 128GB iPhone with an advanced dual-camera system and USB-C connectivity.', 79900, 12, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"128","batteryMah":"3561","supports5G":"true","operatingSystem":"iOS"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'OnePlus Nord 4 5G 256GB', 'OnePlus', 'A fast-charging 5G phone with a bright display and 256GB storage.', 32999, 20, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"256","batteryMah":"5500","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Xiaomi Redmi Note 14 Pro 5G', 'Xiaomi', 'A feature-rich 5G phone with a high-resolution camera and large battery.', 24999, 23, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"256","batteryMah":"5500","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Motorola Edge 50 Fusion 5G', 'Motorola', 'A slim 5G smartphone with a pOLED display and clean Android software.', 22999, 14, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"12","storageGb":"256","batteryMah":"5000","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Nothing Phone (2a) 5G', 'Nothing', 'A distinctive 5G smartphone with a smooth display and customisable light interface.', 23999, 11, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"128","batteryMah":"5000","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Realme 13+ 5G 256GB', 'Realme', 'A responsive 5G phone with fast charging and generous storage.', 22999, 21, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"8","storageGb":"256","batteryMah":"5000","supports5G":"true","operatingSystem":"Android"}'),
    ('Mobiles & Accessories', 'Mobiles', NULL, 'Samsung Galaxy M35 5G 128GB', 'Samsung', 'A long-lasting 5G phone with a Super AMOLED display and dependable cameras.', 19999, 24, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', '{"ramGb":"6","storageGb":"128","batteryMah":"6000","supports5G":"true","operatingSystem":"Android"}'),
    ('Earphones', 'Electronics', NULL, 'Sony WF-C700N Noise-Cancelling Earbuds', 'Sony', 'Compact wireless earbuds with active noise cancellation and balanced sound.', 8990, 14, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700&auto=format&fit=crop&q=80', '{"productType":"Wireless Earphones","connectionType":"Wireless"}'),
    ('Earphones', 'Electronics', NULL, 'JBL Wave Beam True Wireless Earbuds', 'JBL', 'Comfortable true wireless earbuds with punchy bass and a pocket charging case.', 3999, 25, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700&auto=format&fit=crop&q=80', '{"productType":"Wireless Earphones","connectionType":"Wireless"}'),
    ('Laptops', 'Electronics', NULL, 'Dell Inspiron 14 Intel Core i5 Laptop', 'Dell', 'A 14-inch productivity laptop with an Intel Core i5 processor and fast SSD storage.', 67990, 9, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80', '{"productType":"Laptop","ramGb":"16","storageGb":"512","processor":"Intel Core i5","operatingSystem":"Windows 11"}'),
    ('Laptops', 'Electronics', NULL, 'Lenovo IdeaPad Slim 3 Ryzen 5 Laptop', 'Lenovo', 'A slim everyday laptop with a Ryzen 5 processor, 16GB RAM and 512GB SSD.', 54990, 11, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80', '{"productType":"Laptop","ramGb":"16","storageGb":"512","processor":"AMD Ryzen 5","operatingSystem":"Windows 11"}'),
    ('Tablets', 'Electronics', NULL, 'Samsung Galaxy Tab S9 FE 128GB', 'Samsung', 'A versatile 10.9-inch tablet with S Pen support and expandable storage.', 36999, 10, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&auto=format&fit=crop&q=80', '{"productType":"Tablet","ramGb":"6","storageGb":"128","screenSizeInches":"10.9","operatingSystem":"Android"}'),
    ('Tablets', 'Electronics', NULL, 'Apple iPad 11-inch Wi-Fi 128GB', 'Apple', 'An 11-inch iPad for creative projects, entertainment and everyday productivity.', 34900, 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&auto=format&fit=crop&q=80', '{"productType":"Tablet","storageGb":"128","screenSizeInches":"11","operatingSystem":"iPadOS"}'),
    ('Mouse', 'Electronics', NULL, 'Logitech M650 Wireless Mouse', 'Logitech', 'A comfortable wireless mouse with silent clicks and customisable side buttons.', 2495, 28, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&auto=format&fit=crop&q=80', '{"productType":"Mouse","connectionType":"Wireless"}'),
    ('Mouse', 'Electronics', NULL, 'Logitech G304 Lightspeed Gaming Mouse', 'Logitech', 'A lightweight wireless gaming mouse with a high-precision sensor.', 3995, 16, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&auto=format&fit=crop&q=80', '{"productType":"Gaming Mouse","connectionType":"Wireless"}'),
    ('Chargers', 'Electronics', NULL, 'Anker 323 33W USB-C Charger', 'Anker', 'A compact 33W USB-C fast charger with built-in temperature protection.', 1999, 30, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=80', '{"productType":"USB-C Charger","connectionType":"Wired"}'),
    ('Chargers', 'Electronics', NULL, 'boAt 20W Type-C Wall Charger', 'boAt', 'A compact 20W wall adapter for compatible phones and small devices.', 899, 34, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=80', '{"productType":"Wall Charger","connectionType":"Wired"}'),
    ('Headphones', 'Electronics', NULL, 'Sony WH-CH720N Wireless Noise-Cancelling Headphones', 'Sony', 'Over-ear wireless headphones with noise cancelling and comfortable all-day cushions.', 9990, 13, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80', '{"productType":"Headphones","connectionType":"Wireless"}'),
    ('Headphones', 'Electronics', NULL, 'JBL Tune 520BT Wireless On-Ear Headphones', 'JBL', 'Lightweight Bluetooth headphones with signature JBL sound and long battery life.', 3999, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80', '{"productType":"Headphones","connectionType":"Wireless"}'),
    ('Power Banks', 'Electronics', NULL, 'Anker PowerCore 20K 20W Power Bank', 'Anker', 'A 20,000mAh portable battery with 20W USB-C fast charging.', 3499, 18, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=700&auto=format&fit=crop&q=80', '{"productType":"Power Bank","capacity":"20000mAh"}'),
    ('Power Banks', 'Electronics', NULL, 'Ambrane Stylo 10K 22.5W Power Bank', 'Ambrane', 'A compact 10,000mAh power bank with fast charging and dual output ports.', 1499, 27, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=700&auto=format&fit=crop&q=80', '{"productType":"Power Bank","capacity":"10000mAh"}'),
    ('Lip Balm', 'Beauty', NULL, 'Nivea Original Care Moisturising Lip Balm', 'Nivea', 'A daily lip balm that helps protect dry lips and provides lasting moisture.', 199, 45, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&auto=format&fit=crop&q=80', '{"productType":"Lip Balm"}'),
    ('Lipstick', 'Beauty', NULL, 'Maybelline SuperStay Matte Ink Lipstick', 'Maybelline', 'Long-wear liquid lipstick with a precise applicator and rich matte colour.', 699, 32, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=700&auto=format&fit=crop&q=80', '{"productType":"Lipstick","shade":"Lover","skinType":"All skin types"}'),
    ('Eyeliner', 'Beauty', NULL, 'Lakme Insta Eye Liner Black', 'Lakme', 'A quick-drying black liquid eyeliner with a fine applicator tip.', 120, 40, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=80', '{"productType":"Eyeliner","shade":"Black"}'),
    ('Eyeshadow', 'Beauty', NULL, 'L''Oreal Paris Color Riche Eyeshadow Palette', 'L''Oreal Paris', 'A blendable neutral eyeshadow palette with matte and shimmer finishes.', 999, 19, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=700&auto=format&fit=crop&q=80', '{"productType":"Eyeshadow","shade":"Nude neutrals"}'),
    ('Foundation', 'Beauty', NULL, 'Maybelline Fit Me Matte + Poreless Foundation', 'Maybelline', 'A buildable foundation with a natural matte finish for everyday wear.', 549, 24, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=80', '{"productType":"Foundation","shade":"Natural Beige","skinType":"Normal to oily"}'),
    ('Powder', 'Beauty', NULL, 'Lakme 9 to 5 Compact Powder', 'Lakme', 'A lightweight compact powder for a smooth, shine-controlled finish.', 425, 29, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=80', '{"productType":"Compact Powder","shade":"Natural"}'),
    ('Sunscreen', 'Beauty', NULL, 'Minimalist SPF 50 PA++++ Sunscreen', 'Minimalist', 'A lightweight broad-spectrum sunscreen with SPF 50 and a non-greasy finish.', 399, 26, 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700&auto=format&fit=crop&q=80', '{"productType":"Sunscreen","skinType":"All skin types"}'),
    ('Cars', 'Toys', NULL, 'Hot Wheels 5-Car Gift Pack', 'Hot Wheels', 'A five-car die-cast set with assorted vehicle designs for imaginative play.', 799, 31, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=700&auto=format&fit=crop&q=80', '{"productType":"Toy Cars","ageGroup":"5+ years"}'),
    ('Dolls', 'Toys', NULL, 'Barbie Fashionistas Doll', 'Barbie', 'A poseable fashion doll with a modern outfit for storytelling and play.', 999, 17, 'https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=700&auto=format&fit=crop&q=80', '{"productType":"Doll","ageGroup":"3+ years"}'),
    ('Indoor Games', 'Toys', NULL, 'Funskool Sequence Board Game', 'Funskool', 'A family strategy board game that encourages planning and friendly competition.', 699, 15, 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=700&auto=format&fit=crop&q=80', '{"productType":"Board Game","ageGroup":"7+ years"}'),
    ('Bat', 'Toys', NULL, 'Cosco Kashmir Willow Cricket Bat', 'Cosco', 'A lightweight junior cricket bat designed for practice and recreational play.', 1499, 12, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&auto=format&fit=crop&q=80', '{"productType":"Cricket Bat","ageGroup":"8+ years"}'),
    ('Ball', 'Toys', NULL, 'Cosco Super Volley Rubber Ball', 'Cosco', 'A durable rubber ball suitable for casual outdoor games and practice.', 399, 36, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=700&auto=format&fit=crop&q=80', '{"productType":"Play Ball","ageGroup":"6+ years"}'),
    ('Football', 'Toys', NULL, 'Nivia Storm Football Size 5', 'Nivia', 'A durable machine-stitched football for school and recreational matches.', 999, 20, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=700&auto=format&fit=crop&q=80', '{"productType":"Football","ageGroup":"12+ years"}'),
    ('Shuttle', 'Toys', NULL, 'Cosco Nylon Badminton Shuttlecocks 6-Pack', 'Cosco', 'A six-piece nylon shuttlecock set for recreational badminton sessions.', 399, 25, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&auto=format&fit=crop&q=80', '{"productType":"Shuttlecock","ageGroup":"8+ years"}'),
    ('Home Appliances', NULL, NULL, 'Philips 3000 Series Air Fryer', 'Philips', 'A compact air fryer with rapid air circulation for convenient everyday cooking.', 8995, 8, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&auto=format&fit=crop&q=80', '{"productType":"Air Fryer","capacity":"4.1L"}'),
    ('Home Appliances', NULL, NULL, 'Prestige Iris 750W Mixer Grinder', 'Prestige', 'A 750W mixer grinder with multiple jars for everyday food preparation.', 3495, 11, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&auto=format&fit=crop&q=80', '{"productType":"Mixer Grinder","capacity":"750W"}'),
    ('Home Appliances', NULL, NULL, 'Bajaj Frore 1200mm Ceiling Fan', 'Bajaj', 'A high-air-delivery ceiling fan with a durable motor for everyday home use.', 2199, 13, 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=700&auto=format&fit=crop&q=80', '{"productType":"Ceiling Fan","energyRating":"3 star"}'),
    ('Home Appliances', NULL, NULL, 'LG 20L Solo Microwave Oven', 'LG', 'A 20-litre solo microwave with simple controls for reheating and everyday cooking.', 6990, 6, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=700&auto=format&fit=crop&q=80', '{"productType":"Microwave Oven","capacity":"20L"}')
), resolved AS (
    SELECT seed.*, category."Id" AS "CategoryId"
    FROM seed
    JOIN LATERAL (
        SELECT c."Id"
        FROM "Categories" c
        LEFT JOIN "Categories" parent ON parent."Id" = c."ParentCategoryId"
        LEFT JOIN "Categories" root ON root."Id" = parent."ParentCategoryId"
        WHERE lower(trim(c."Name")) = lower(trim(seed."CategoryName"))
          AND ((seed."ParentName" IS NULL AND c."ParentCategoryId" IS NULL)
            OR lower(trim(parent."Name")) = lower(trim(seed."ParentName")))
          AND ((seed."RootName" IS NULL AND (parent."Id" IS NULL OR parent."ParentCategoryId" IS NULL))
            OR lower(trim(root."Name")) = lower(trim(seed."RootName")))
        ORDER BY c."Id"
        LIMIT 1
    ) category ON true
)
INSERT INTO "Products" ("CategoryId", "Name", "Brand", "Description", "Price", "StockQuantity", "ImageUrl", "AttributesJson", "IsActive", "CreatedAt")
SELECT resolved."CategoryId", resolved."Name", resolved."Brand", resolved."Description", resolved."Price", resolved."StockQuantity", resolved."ImageUrl", resolved."AttributesJson", true, CURRENT_TIMESTAMP
FROM resolved
WHERE NOT EXISTS (
    SELECT 1 FROM "Products" existing
    WHERE existing."CategoryId" = resolved."CategoryId" AND lower(existing."Name") = lower(resolved."Name")
);

COMMIT;
