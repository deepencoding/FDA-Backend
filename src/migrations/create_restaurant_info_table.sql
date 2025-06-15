CREATE TABLE IF NOT EXISTS restaurant_info (
  restaurant_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0.0,
  image_url TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT restaurant_info_user_id_fkey
    FOREIGN KEY (restaurant_id) REFERENCES users(id) ON DELETE CASCADE
);