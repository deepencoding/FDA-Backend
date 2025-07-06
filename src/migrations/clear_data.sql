TRUNCATE TABLE cart_items, order_items, carts, orders, menu_items, restaurant_info, reviews, coupons, users
CASCADE;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
ALTER SEQUENCE carts_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE coupons_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

SELECT count(*) FROM users;
SELECT count(*) FROM restaurant_info;
SELECT count(*) FROM menu_items;
SELECT count(*) FROM carts;
SELECT count(*) FROM cart_items;
SELECT count(*) FROM orders;
SELECT count(*) FROM order_items;
SELECT count(*) FROM coupons;
SELECT count(*) FROM reviews;
