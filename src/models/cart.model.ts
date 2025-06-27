import { sql } from "bun";

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

export async function createCart(userId: number, restaurantId: number,
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
			scheduled_delivery_type
		) VALUES (
			${userId}, ${restaurantId},
			${meta.noteForRestaurant ?? null},
			${meta.noteForDeliveryPartner ?? null},
			${meta.deliveryType ?? 'standard'},
			${meta.scheduledDeliveryTime ?? null},
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

export async function getCartRestaurant(userId: number): Promise<number> {
  const restaurant: { restaurantId: number }[] = await sql`
    SELECT
			c.restaurant_id AS restaurantId
    FROM carts c
    WHERE c.user_id = ${userId}
  `;
  return restaurant[0]?.restaurantId ?? 0;
}

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
