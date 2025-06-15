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
    -- Ensure one review per user per restaurant
    UNIQUE (user_id, restaurant_id)
);