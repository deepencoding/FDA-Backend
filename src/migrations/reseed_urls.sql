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
	1.  RESTAURANT‑INFO rows  (match each restaurant user)
-------------------------------------------------------------------- */
UPDATE restaurant_info ri
SET image_url = (
	SELECT urls[(ri.restaurant_id - 1) % array_length(urls, 1) + 1]
	FROM temp_image_urls
	WHERE array_name = 'restaurant_image_urls'
),
logo_url = (
	SELECT urls[(ri.restaurant_id - 1) % array_length(urls, 1) + 1]
	FROM temp_image_urls
	WHERE array_name = 'logo_urls'
);

/* --------------------------------------------------------------------
    2. MENU ITEMS (20 per restaurant, ~200 rows)
-------------------------------------------------------------------- */
UPDATE menu_items mi
SET image_url = (
	SELECT urls[(mi.id - 1) % array_length(urls, 1) + 1]
	FROM temp_image_urls
	WHERE array_name = 'menu_item_image_urls'
);

/* --------------------------------------------------------------------
    3. COUPONS (10 active / inactive samples)
-------------------------------------------------------------------- */
UPDATE coupons c
SET logo_url = (
	SELECT urls[(c.id - 1) % array_length(urls, 1) + 1]
	FROM temp_image_urls
	WHERE array_name = 'coupon_logo_urls'
);