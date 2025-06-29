/* --------------------------------------------------------------------
	1.  ENUM & CLEAN START  (skip if already present / populated)
-------------------------------------------------------------------- */
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
		CREATE TYPE user_role AS ENUM ('user', 'restaurant');
  END IF;
END$$;

/* --------------------------------------------------------------------
	2.  SEED RESTAURANT USERS  (10 restaurants)
-------------------------------------------------------------------- */
INSERT INTO users (name, phone_no, password_hash, role)
SELECT
  'Restaurant ' || r AS name,
  '90000000'     || lpad(r::text, 2, '0')         AS phone_no,
  'restaurant_hash'                                AS password_hash,
  'restaurant'::user_role
FROM generate_series(1, 10) AS r;

/* --------------------------------------------------------------------
	3.  SEED CUSTOMER USERS  (50 customers)
-------------------------------------------------------------------- */
INSERT INTO users (name, phone_no, password_hash, role)
SELECT
  'Customer '   || c,
  '80000000'    || lpad(c::text, 2, '0'),
  'customer_hash',
  'user'::user_role
FROM generate_series(1, 50) AS c;

/* --------------------------------------------------------------------
	4.  RESTAURANT‑INFO rows  (match each restaurant user)
-------------------------------------------------------------------- */
INSERT INTO restaurant_info (
  restaurant_id, name, type, rating,
  image_url, delivery_fee, address,
  delivery_time, logo_url
)
SELECT
  u.id,
  u.name,                                             -- same name
  (ARRAY['Indian', 'Italian', 'Japanese', 'Mexican',
		'Chinese'])[ceil(random()*5)]               AS type,
  round( (random()*1.5 + 3)::numeric, 1 )            AS rating,   -- 3.0‑4.5
  'https://picsum.photos/seed/resto'||u.id||'/200',
  (5 + floor(random()*5)) * 10                       AS delivery_fee,
  '42 Food Street, City #'||u.id                     AS address,
  '30-45 min'                                        AS delivery_time,
  'https://picsum.photos/seed/logo'||u.id||'/100'
FROM users u
WHERE u.role = 'restaurant';

/* --------------------------------------------------------------------
	5.  MENU ITEMS  (20 per restaurant, ~200 rows)
-------------------------------------------------------------------- */
INSERT INTO menu_items (
  restaurant_id, name, description,
  price, image_url, category,
  is_available, is_featured
)
SELECT
  r.restaurant_id,
  'Dish '||gs,
  'Tasty lorem‑ipsum food #'||gs,
  round( (random()*15 + 5)::numeric, 2 ),           -- 5.00‑20.00
  'https://picsum.photos/seed/item'||r.restaurant_id||'_'||gs||'/300',
  (ARRAY['Main', 'Starter', 'Dessert'])[ceil(random()*3)],
  true,
  (random() < 0.25)                                 -- 25 % featured
FROM restaurant_info r
CROSS JOIN generate_series(1, 20) AS gs;

/* --------------------------------------------------------------------
	6.  CARTS  (one cart for 25 random customers)
-------------------------------------------------------------------- */
INSERT INTO carts (
  user_id, restaurant_id,
  note_for_restaurant, note_for_delivery_partner,
  delivery_type, subtotal
)
SELECT
  c.id,
  r.restaurant_id,
  NULL,
  NULL,
  'standard',
  0
FROM (
  SELECT id FROM users WHERE role = 'user' ORDER BY random() LIMIT 25
) AS c
JOIN LATERAL (
  SELECT restaurant_id
  FROM restaurant_info
  ORDER BY random()
  LIMIT 1
) r ON TRUE;

/* --------------------------------------------------------------------
	7.  CART ITEMS  (3‑5 items per cart)
-------------------------------------------------------------------- */
INSERT INTO cart_items (cart_id, item_id, quantity)
SELECT
  crt.id,
  mi.id,
  1 + floor(random()*3)::INT                       -- 1‑3 qty
FROM carts crt
JOIN menu_items mi ON mi.restaurant_id = crt.restaurant_id
JOIN LATERAL (
  SELECT generate_series(1, (3 + floor(random()*2))::INT) AS filler  -- 3‑5 rows
) g ON TRUE
ORDER BY crt.id;

/* --------------------------------------------------------------------
	8.  ORDERS  (create 40 closed orders from existing carts)
-------------------------------------------------------------------- */

WITH orders_temp AS (
  INSERT INTO orders (
    user_id, restaurant_id,
    status, total_amount, delivery_address
  )
  SELECT
    p.user_id,
    p.restaurant_id,
    'delivered',
    round( (random()*30 + 10)::numeric, 2 ),
    'Delivered to 123 Example Lane'
  FROM (
    SELECT id, user_id, restaurant_id
    FROM carts
    ORDER BY random()
    LIMIT 40
  ) p
  RETURNING id, restaurant_id
)
--WITH picked AS (
--  SELECT id, user_id, restaurant_id
--  FROM carts
--  ORDER BY random()
--  LIMIT 40
--)
--INSERT INTO orders (
--  user_id, restaurant_id,
--  status, total_amount, delivery_address
--)
--SELECT
--  p.user_id,
--  p.restaurant_id,
--  'delivered',
--  round( (random()*30 + 10)::numeric, 2 ),
--  'Delivered to 123 Example Lane'
--FROM picked p
--RETURNING id, restaurant_id INTO TEMP orders_temp;

/* --------------------------------------------------------------------
	9.  ORDER ITEMS  (copy 2‑4 random items per order)
-------------------------------------------------------------------- */
INSERT INTO order_items (
  order_id, menu_item_id, quantity,
  unit_price, total_price, special_instructions
)
SELECT
  o.id,
  mi.id,
  q.qty,
  mi.price,
  mi.price * q.qty,
  NULL
FROM orders_temp o
JOIN LATERAL (
  SELECT mi.*
  FROM menu_items mi
  WHERE mi.restaurant_id = o.restaurant_id
  ORDER BY random()
  LIMIT 4
) mi ON TRUE
JOIN LATERAL (
  SELECT 1 + floor(random()*2)::INT AS qty          -- 1‑2 qty
) q ON TRUE;

/* --------------------------------------------------------------------
	10.  REVIEW TABLE  (optional demo reviews)
-------------------------------------------------------------------- */
INSERT INTO reviews (user_id, restaurant_id, rating, comment)
SELECT
  u.id,
  r.restaurant_id,
  ceil(random()*5),
  'Nice food!'
FROM users u
JOIN restaurant_info r ON TRUE
WHERE u.role = 'user'
  AND random() < 0.15;                             -- ~15 % of combos

/* --------------------------------------------------------------------
	11.  COUPONS  (10 active / inactive samples)
-------------------------------------------------------------------- */
INSERT INTO coupons (discount_amount, description, logo_url, is_active)
SELECT
  (ARRAY[10, 15, 20, 25, 30, 35, 40, 45, 50, 60])[g]          AS discount_amount,
  'Save '|| (ARRAY[10, 15, 20, 25, 30, 35, 40, 45, 50, 60])[g] || '% on your next order' AS description,
  'https://picsum.photos/seed/coupon'||g||'/120'               AS logo_url,
  (g % 2 = 1)                                                  AS is_active              -- alternate active/inactive
FROM generate_series(1,10) AS g;
