import { sql } from "bun";
import type { RestaurantInfo } from "../services/cart.service";

type cartItemsInfo = {
	itemId: number,
	itemName: string,
	itemImage: string,
	quantity: number
};

type cartMeta = {
	noteForRestaurant: string,
	noteForDeliveryPartner: string,
	deliveryType: 'standard' | 'scheduled',
	scheduledDeliveryTime: string,
	subtotal: number
};

export async function getActiveCartId(userId: number): Promise<number | null> {
	const cartId: { id: number }[] = await sql`
		SELECT id FROM carts WHERE user_id = ${userId} LIMIT 1
	`;
	return cartId[0]?.id ?? null;
}

export async function createCart(userId: number, restaurantId: number | null,
meta: {
	noteForRestaurant?: string;
	noteForDeliveryPartner?: string;
	deliveryType?: 'standard' | 'scheduled';
	scheduledDeliveryTime?: string;
}): Promise<number> {
	const cartId: { id: number }[] = await sql`
		INSERT INTO carts (
			user_id, restaurant_id,
			note_for_restaurant,
			note_for_delivery_partner,
			delivery_type,
			scheduled_delivery_time
		) VALUES (
			${userId}, ${restaurantId},
			${meta.noteForRestaurant ?? null},
			${meta.noteForDeliveryPartner ?? null},
			${meta.deliveryType ?? 'standard'},
			${meta.scheduledDeliveryTime ?? null}
		) RETURNING id
	`;
	return cartId[0]?.id ?? 0;
}

export async function clearCartItems(cartId: number) {
	await sql`
		DELETE FROM cart_items WHERE cart_id = ${cartId}
	`;
}

export async function upsertCartItem(cartId: number, itemId: number, quantity: number) {
	if (quantity <= 0) {
		await sql`
			DELETE FROM cart_items WHERE cart_id = ${cartId} AND item_id = ${itemId}
		`;
		return;
	}

	await sql`
		INSERT INTO cart_items (cart_id, item_id, quantity)
		VALUES (${cartId}, ${itemId}, ${quantity})
		ON CONFLICT (cart_id, item_id)
		DO UPDATE SET quantity = ${quantity}
	`;
}

export async function updateCartNotes(
  cartId: number,
  restaurantId: number,
  meta: {
    noteForRestaurant?: string;
    noteForDeliveryPartner?: string;
    deliveryType?: 'standard' | 'scheduled';
    scheduledDeliveryTime?: string;
  }
) {
  await sql`
    UPDATE carts SET
      restaurant_id            = ${restaurantId},
      note_for_restaurant      = ${meta.noteForRestaurant ?? null},
      note_for_delivery_partner= ${meta.noteForDeliveryPartner ?? null},
      delivery_type            = ${meta.deliveryType ?? 'standard'},
      scheduled_delivery_time  = ${meta.scheduledDeliveryTime ?? null}
    WHERE id = ${cartId}
  `;
}

export async function getCartRestaurant(cartId: number): Promise<number> {
  const restaurant: { restaurantId: number }[] = await sql`
    SELECT
			c.restaurant_id AS restaurantId
    FROM carts c
    WHERE c.id = ${cartId}
  `;
  return restaurant[0]?.restaurantId ?? 0;
}

export async function getCartMeta(cartId: number): Promise<cartMeta | undefined> {
  const [cart]: cartMeta[] = await sql`
    SELECT
      note_for_restaurant,
      note_for_delivery_partner,
      delivery_type,
      scheduled_delivery_time,
      subtotal
    FROM carts
    WHERE id = ${cartId}
  `;
  return cart;
}

export async function getCartItems(cartId: number): Promise<cartItemsInfo[]> {
  return await sql`
    SELECT
      ci.item_id AS itemId,
      mi.name AS itemName,
      mi.image_url AS itemImage,
      ci.quantity AS itemQuantity
    FROM cart_items ci
    JOIN menu_items mi ON ci.item_id = mi.id
    WHERE ci.cart_id = ${cartId}
  ` as cartItemsInfo[];
}

export async function getRestaurantInfo(restaurantId: number): Promise<RestaurantInfo> {
	return await sql`
		SELECT
			restaurant_id AS id,
			image_url AS image,
			name,
			address
		FROM restaurant_info
		WHERE restaurant_id = ${restaurantId}
	` as RestaurantInfo;
}
