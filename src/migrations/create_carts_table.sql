CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES users(id),
    note_for_restaurant TEXT,
    note_for_delivery_partner TEXT,
    delivery_type VARCHAR(20) DEFAULT 'standard',
    scheduled_delivery_time TIMESTAMP,
    subtotal DECIMAL(10,2) DEFAULT 0.0,
    -- status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
