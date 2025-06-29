CREATE TABLE IF NOT EXISTS coupons(
	id SERIAL PRIMARY KEY,
	discount_amount INTEGER NOT NULL,
	description VARCHAR(255),
	logo_url TEXT,
	is_active BOOLEAN
);