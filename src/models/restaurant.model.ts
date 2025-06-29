import { sql } from "bun";
import type { Restaurant } from "..";

export type MenuItem = {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  is_featured?: boolean;
  customization_options?: any;
  created_at: string;
};

// Create menu item
export async function createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem | null> {
  const result: MenuItem[] = await sql`
    INSERT INTO menu_items ${sql(menuItem)}
    RETURNING *
  `;
  return result[0] || null;
}

// Get menu items by restaurant
export async function getMenuItems(restaurant_id: number): Promise<MenuItem[]> {
  return await sql`
    SELECT * FROM menu_items
    WHERE restaurant_id = ${restaurant_id}
    AND is_available = true
    ORDER BY category, name
  `;
}

// Update menu item
export async function updateMenuItem(
  id: number,
  restaurant_id: number,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const result: MenuItem[] = await sql`
    UPDATE menu_items =
    SET ${sql(updates)}
    WHERE id = ${id} AND restaurant_id = ${restaurant_id}
    RETURNING *
  `;
  return result[0] || null;
}

// Delete menu item
export async function deleteMenuItem(id: number, restaurant_id: number): Promise<boolean> {
  const result: MenuItem[] = await sql`
    DELETE FROM menu_items
    WHERE id = ${id} AND restaurant_id = ${restaurant_id}
    RETURNING id
  `;
  return result.length > 0;
}

// Get menu item by ID
export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const result: MenuItem[] = await sql`
    SELECT * FROM menu_items
    WHERE id = ${id}
  `;
  return result[0] || null;
}

// Get restaurant details with menu items
export async function getRestaurantWithMenu(restaurant_id: number): Promise<{
  restaurant: any;
  menu_items: MenuItem[];
}> {
  const restaurant = await sql`
    SELECT r.*, u.name as owner_name
    FROM restaurant_info r
    JOIN users u ON u.id = r.restaurant_id
    WHERE r.restaurant_id = ${restaurant_id}
  `;

  const menu_items = await getMenuItems(restaurant_id);

  return {
    restaurant: restaurant[0],
    menu_items
  };
}

// Update restaurant info
export async function updateRestaurantInfo(
  restaurant_id: number,
  updates: {
    type?: string;
    image_url?: string;
    address?: string;
  }
): Promise<any> {
  const result = await sql`
    UPDATE restaurant_info
    SET ${sql(updates)}
    WHERE restaurant_id = ${restaurant_id}
    RETURNING *
  `;
  return result[0];
}

export async function getTopRestaurants(limit: number = 7): Promise<Restaurant[]> {
  return await sql`
    SELECT
      restaurant_id::text AS "id",
      name,
      type,
      rating,
      image_url AS "image",
			delivery_fee::text AS "deliveryFee"
    FROM restaurant_info
    ORDER BY rating DESC
    LIMIT ${limit}
  ` as Restaurant[];
}
