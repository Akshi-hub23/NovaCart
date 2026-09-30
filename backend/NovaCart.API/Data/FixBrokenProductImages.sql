BEGIN;

UPDATE "Products" product
SET "ImageUrl" = fixes."NewImageUrl"
FROM (VALUES
    ('https://images.unsplash.com/photo-1609592806596-b43bada2f722?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1609592806596-b43bada6b8c6?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1583391733956-6c78276477e7?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1631545806609-0c2a5a3a0269?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1599599810694-b5ac4ddcb3e4?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1599058917212-d750089bc07f?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1606503153255-59d8b8b82165?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1511703879575-2e5c7e5f0a55?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1621939514649-280e2aa7f9ae?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80')
) AS fixes("OldImageUrl", "NewImageUrl")
WHERE product."ImageUrl" = fixes."OldImageUrl";

UPDATE "Products" product
SET "ImageUrl" = fixes."NewImageUrl"
FROM (VALUES
    ('https://images.unsplash.com/photo-1506629905607-d9e7ad4a5f3a?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1631214540242-7d3b3c72f2f8?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=80'),
    ('https://images.unsplash.com/photo-1548907040-4d42baa0d8d4?w=700&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80')
) AS fixes("OldImageUrl", "NewImageUrl")
WHERE product."ImageUrl" = fixes."OldImageUrl";
COMMIT;