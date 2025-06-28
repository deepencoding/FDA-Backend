-- Add missing fields to restaurant_info table
ALTER TABLE restaurant_info 
ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(50) DEFAULT '30-45 min',
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);

-- Add missing fields to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS customization_options JSONB,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing records to have default values
UPDATE restaurant_info 
SET delivery_time = '30-45 min' 
WHERE delivery_time IS NULL;

UPDATE menu_items 
SET is_featured = false 
WHERE is_featured IS NULL; 