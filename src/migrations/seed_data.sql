--/* Define curated image URLs */
--DO $$
--DECLARE
--	restaurant_image_urls TEXT[] := ARRAY[
--	];
--	logo_urls TEXT[] := ARRAY[
--	];
--	menu_item_image_urls TEXT[] := ARRAY[
--	];
--	coupon_logo_urls TEXT[] := ARRAY[
--		''
--	];
--BEGIN
--	PERFORM set_config('custom.restaurant_image_urls', array_to_string(restaurant_image_urls, ','), FALSE);
--	PERFORM set_config('custom.logo_urls', array_to_string(logo_urls, ','), FALSE);
--	PERFORM set_config('custom.menu_item_image_urls', array_to_string(menu_item_image_urls, ','), FALSE);
--	PERFORM set_config('custom.coupon_logo_urls', array_to_string(coupon_logo_urls, ','), FALSE);
--END $$;

CREATE TEMP TABLE temp_image_urls (
	array_name TEXT,
	urls TEXT[]
);

INSERT INTO temp_image_urls (array_name, urls)
VALUES
	('restaurant_image_urls', ARRAY[
		'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b',
		'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
		'https://images.unsplash.com/photo-1647109063447-e01ab743ee8f',
		'https://images.unsplash.com/photo-1552566626-52f8b828add9',
		'https://images.unsplash.com/photo-1567667778211-b19f5a4e1efe',
		'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
		'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
		'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
		'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg',
		'https://images.unsplash.com/photo-1600891964599-f61ba0e24092'
	]),
	('logo_urls', ARRAY[
		'https://images.unsplash.com/photo-1575395311793-ad870d50fbd1',
		'https://images.unsplash.com/photo-1628557010295-dd9198c31b84',
		'https://images.unsplash.com/photo-1527025047-354c31c26312',
		'https://plus.unsplash.com/premium_photo-1675286438306-c228b9c1c636?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://plus.unsplash.com/premium_photo-1668902224065-2fa295ec3a21?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1623156346149-d5cec8b29818',
		'https://images.unsplash.com/photo-1651786837200-1fdd09ce3269',
		'https://images.pexels.com/photos/31856950/pexels-photo-31856950.jpeg',
		'https://images.pexels.com/photos/1336383/pexels-photo-1336383.jpeg',
		'https://images.pexels.com/photos/30759933/pexels-photo-30759933.jpeg',
		'https://images.pexels.com/photos/13023283/pexels-photo-13023283.jpeg',
		'https://plus.unsplash.com/premium_photo-1669075651198-674fab1370b3?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1694346164575-cd60b067290a',
		'https://images.pexels.com/photos/29366216/pexels-photo-29366216.jpeg',
		'https://images.pexels.com/photos/15544931/pexels-photo-15544931.jpeg',
		'https://images.pexels.com/photos/16068256/pexels-photo-16068256.jpeg',
		'https://images.pexels.com/photos/28051801/pexels-photo-28051801.jpeg',
		'https://images.unsplash.com/photo-1740103639679-c36cc567f1db'
	]),
	('menu_item_image_urls', ARRAY[
		'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
		'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
		'https://images.pexels.com/photos/1234535/pexels-photo-1234535.jpeg'
		'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
		'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg',
		'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
		'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
		'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
		'https://images.unsplash.com/photo-1551024601-bec78aea704b',
		'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
		'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg',
		'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
		'https://blog.swiggy.com/wp-content/uploads/2024/03/Biryani-2-1024x538.jpg',
		'https://images.news18.com/ibnlive/uploads/2021/01/1610716314_untitled-design-2021-01-15t184025.049.jpg',
		'https://media.istockphoto.com/id/1488738018/photo/medu-vada-or-medu-vada-with-sambhar-and-coconut-chutney-red-chutney-green-chutney-popular.jpg?s=612x612&w=0&k=20&c=dvWgKhQuw1lfOBxDpR6YFMLSZnWdyqYGV1pvcBt7mZw=',
		'https://asset7.ckassets.com/blog/wp-content/uploads/sites/5/2019/12/Pav-Bhaji.jpg',
		'https://blog.swiggy.com/wp-content/uploads/2024/03/Paav-Bhaji-1024x538.jpg'
	]),
	('coupon_logo_urls', ARRAY[
		'https://plus.unsplash.com/premium_photo-1670509045675-af9f249b1bbe',
		'https://plus.unsplash.com/premium_photo-1670152411569-7cbc00946857',
		'https://images.unsplash.com/photo-1700843699012-0dadd2089fe4',
		'https://plus.unsplash.com/premium_photo-1728613749980-cd3e758183df',
		'https://plus.unsplash.com/premium_photo-1683887064106-531532ecdf20',
		'https://plus.unsplash.com/premium_photo-1683887064374-dc6dd77ece50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGNvdXBvbnN8ZW58MHx8MHx8fDA%3D',
		'https://plus.unsplash.com/premium_photo-1729036509325-61f71a2bf13f',
		'https://images.pexels.com/photos/6675830/pexels-photo-6675830.jpeg',
		'https://images.pexels.com/photos/7957753/pexels-photo-7957753.jpeg',
		'https://images.pexels.com/photos/7957747/pexels-photo-7957747.jpeg',
		'https://images.pexels.com/photos/5650045/pexels-photo-5650045.jpeg'
	]);

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
  '90000000'    || lpad(r::text, 2, '0') AS phone_no,
  'restaurant_hash' AS password_hash,
  'restaurant'::user_role
FROM generate_series(1, 10) AS r;

/* --------------------------------------------------------------------
	3.  SEED CUSTOMER USERS  (50 customers)
-------------------------------------------------------------------- */
INSERT INTO users (name, phone_no, password_hash, role)
SELECT
  'Customer ' || c,
  '80000000'  || lpad(c::text, 2, '0'),
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
  u.name,
  (ARRAY['Indian', 'Italian', 'Japanese', 'Mexican', 'Chinese'])[ceil(random()*5)] AS type,
  round((random()*1.5 + 3)::numeric, 1) AS rating,
	(SELECT urls[ceil(random()*array_length(urls, 1))::int]
		FROM temp_image_urls WHERE array_name = 'restaurant_image_urls') AS image_url,
  (5 + floor(random()*5)) * 10 AS delivery_fee,
  '42 Food Street, City #'||u.id AS address,
  '30-45 min' AS delivery_time,
	(SELECT urls[ceil(random()*array_length(urls, 1))::int]
		FROM temp_image_urls WHERE array_name = 'logo_urls') AS logo_url
FROM users u
WHERE u.role = 'restaurant';

/* --------------------------------------------------------------------
	5.  MENU ITEMS  (20 per restaurant, ~200 rows)
-------------------------------------------------------------------- */
INSERT INTO menu_items (
  restaurant_id, name, description,
  price, image_url, category,
  is_available, is_featured,
	customization_options
)
SELECT
  r.restaurant_id,
  'Dish '||gs,
  'Tasty lorem-ipsum food #'||gs,
  round((random()*15 + 5)::numeric, 2),
	(SELECT urls[ceil(random()*array_length(urls, 1))::int]
		FROM temp_image_urls WHERE array_name = 'menu_item_image_urls') AS image_url,
  (ARRAY['Main', 'Starter', 'Dessert'])[ceil(random()*3)],
  true,
  (random() < 0.25),
	'{}'::jsonb
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
  1 + floor(random()*3)::INT
FROM carts crt
JOIN menu_items mi ON mi.restaurant_id = crt.restaurant_id
JOIN LATERAL (
  SELECT generate_series(1, (3 + floor(random()*2))::INT) AS filler
) g ON TRUE
ON CONFLICT (cart_id, item_id) DO NOTHING;

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
  SELECT 1 + floor(random()*2)::INT AS qty
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
  AND random() < 0.15;

/* --------------------------------------------------------------------
	11.  COUPONS  (10 active / inactive samples)
-------------------------------------------------------------------- */
INSERT INTO coupons (discount_amount, description, logo_url, is_active)
SELECT
  (ARRAY[10, 15, 20, 25, 30, 35, 40, 45, 50, 60])[g] AS discount_amount,
  'Save '|| (ARRAY[10, 15, 20, 25, 30, 35, 40, 45, 50, 60])[g] || '% on your next order' AS description,
	(SELECT urls[g % array_length(urls, 1) + 1]
		FROM temp_image_urls WHERE array_name = 'coupon_logo_urls') AS logo_url,
  (g % 2 = 1) AS is_active
FROM generate_series(1,10) AS g;
