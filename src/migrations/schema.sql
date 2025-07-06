CREATE TYPE user_role AS ENUM ('user', 'restaurant');

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	phone_no VARCHAR(50) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role user_role NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_info (
  restaurant_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0.0,
  image_url TEXT,
	delivery_fee INTEGER, -- might need to change it to NUMERIC(5,2)
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	delivery_time VARCHAR(50) DEFAULT '30-45 min',
	logo_url VARCHAR(255),
  CONSTRAINT restaurant_info_user_id_fkey
    FOREIGN KEY (restaurant_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	restaurant_id INTEGER NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'pending',
	total_amount NUMERIC(10,2) NOT NULL,
	delivery_address TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (restaurant_id) REFERENCES restaurant_info(restaurant_id) ON DELETE CASCADE,
	CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS menu_items (
	id SERIAL PRIMARY KEY,
	restaurant_id INTEGER NOT NULL,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	price NUMERIC(10,2) NOT NULL,
	image_url TEXT,
	category VARCHAR(50) NOT NULL,
	is_available BOOLEAN DEFAULT true,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	customization_options JSONB,
	is_featured BOOLEAN DEFAULT false,
	FOREIGN KEY (restaurant_id) REFERENCES restaurant_info(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	restaurant_id INTEGER REFERENCES users(id),
	note_for_restaurant TEXT,
	note_for_delivery_partner TEXT,
	delivery_type VARCHAR(20) DEFAULT 'standard',
	scheduled_delivery_time TIMESTAMP WITH TIME ZONE,
	subtotal DECIMAL(10,2) DEFAULT 0.0,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
	id SERIAL PRIMARY KEY,
	order_id INTEGER NOT NULL,
	menu_item_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	unit_price NUMERIC(10,2) NOT NULL,
	total_price NUMERIC(10,2) NOT NULL,
	special_instructions TEXT,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS cart_items (
	id SERIAL PRIMARY KEY,
	cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
	item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT cart_items_cart_item_uc UNIQUE (cart_id, item_id)
);

CREATE TABLE IF NOT EXISTS coupons(
	id SERIAL PRIMARY KEY,
	discount_amount INTEGER NOT NULL,
	description VARCHAR(255),
	logo_url TEXT,
	is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS reviews (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	restaurant_id INTEGER NOT NULL,
	rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
	comment TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (restaurant_id) REFERENCES restaurant_info(restaurant_id) ON DELETE CASCADE,
	UNIQUE (user_id, restaurant_id)
);
