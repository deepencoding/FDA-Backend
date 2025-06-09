import { sql } from "bun";

type cartRestaurantInfo = {
  name: string;
  address: string
};

export async function getCartRestaurant(userId: number): Promise<cartRestaurantInfo | undefined> {
  const [restaurant]: cartRestaurantInfo[] = await sql`
    SELECT
      r.name AS name,
      r.address AS address
    FROM restaurant_info r
    JOIN carts c ON c.restaurant_id = r.restaurant_id
    WHERE c.user_id = ${userId} AND c.restaurant_id IS NOT NULL
  `;
  return restaurant;
}

type cartMeta = {
  noteForRestaurant: string,
  noteForDeliveryPartner: string,
  deliveryType: 'standard' | 'scheduled',
  scheduledDeliveryTime: string,
  subtotal: number
};

export async function getCartMeta(userId: number): Promise<cartMeta | undefined> {
  const [cart]: cartMeta[] = await sql`
    SELECT
      note_for_restaurant,
      note_for_delivery_partner,
      delivery_type,
      scheduled_delivery_time,
      subtotal
    FROM carts
    WHERE user_id = ${userId}
  `;
  return cart;
}

type cartItemsInfo = {
  itemId: number,
  itemName: string,
  itemImage: string,
  quantity: number
};

export async function getCartItems(userId: number): Promise<cartItemsInfo[]> {
  return await sql`
    SELECT
      ci.item_id AS itemId,
      mi.name AS itemName,
      mi.image_url AS itemImage,
      ci.quantity
    FROM cart_items ci
    JOIN menu_items mi ON ci.item_id = mi.id
    WHERE ci.user_id = ${userId}
  ` as cartItemsInfo[];
}
