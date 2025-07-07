import { sql } from "bun";
import type { RestaurantInfo } from "../services/cart.service";

export type cartItemsInfo = {
	itemId: string,
	itemName: string,
	itemImage: string,
	quantity: number,
	itemPrice: number
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
			c.restaurant_id AS "restaurantId"
    FROM carts c
    WHERE c.id = ${cartId}
  `;
  return restaurant[0]?.restaurantId ?? 0;
}

export async function getCartMeta(cartId: number): Promise<cartMeta | null> {
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
  return cart ?? null;
}

export async function getCartItems(cartId: number): Promise<cartItemsInfo[]> {
  return await sql`
    SELECT
      ci.item_id AS "itemId",
      mi.name AS "itemName",
      mi.image_url AS "itemImage",
      ci.quantity AS "quantity",
			mi.description AS "itemDescription",
			mi.price AS "itemPrice"
    FROM cart_items ci
    JOIN menu_items mi ON ci.item_id = mi.id
    WHERE ci.cart_id = ${cartId}
  ` as cartItemsInfo[];
}

export async function getRestaurantInfo(restaurantId: number): Promise<RestaurantInfo | null> {
	const [restaurantData]: RestaurantInfo[] = await sql`
		SELECT
			restaurant_id AS "restaurantId",
			image_url AS "restaurantImage",
			name AS "restaurantName",
			address
		FROM restaurant_info
		WHERE restaurant_id = ${restaurantId}
	`;
	return restaurantData ?? null;
}

export async function getMenuItemPrice(itemId: number): Promise<number> {
  const result: { price: number }[] = await sql`
    SELECT price FROM menu_items WHERE id = ${itemId}
  `;
  return result[0]?.price ?? 0;
}

export async function getCartItemQuantity(cartId: number, itemId: number): Promise<number> {
  const result: { quantity: number }[] = await sql`
    SELECT quantity FROM cart_items WHERE cart_id = ${cartId} AND item_id = ${itemId}
  `;
  return result[0]?.quantity ?? 0;
}

export async function calculateAndUpdateCartSubtotal(cartId: number): Promise<void> {
  const subtotal: { subtotal: number }[] = await sql`
    SELECT COALESCE(SUM(ci.quantity * mi.price), 0) as subtotal
    FROM cart_items ci
    JOIN menu_items mi ON ci.item_id = mi.id
    WHERE ci.cart_id = ${cartId}
  `;
  
  await sql`
    UPDATE carts SET subtotal = ${subtotal[0]?.subtotal ?? 0}
    WHERE id = ${cartId}
  `;
}

export async function updateCartSubtotalForItem(cartId: number, itemId: number, newQuantity: number): Promise<void> {
  // Get the current subtotal
  const currentSubtotal: { subtotal: number }[] = await sql`
    SELECT subtotal FROM carts WHERE id = ${cartId}
  `;
  
  // Get the item price
  const itemPrice = await getMenuItemPrice(itemId);
  
  // Get the old quantity
  const oldQuantity = await getCartItemQuantity(cartId, itemId);
  
  // Calculate the difference
  const quantityDifference = newQuantity - oldQuantity;
  const priceDifference = quantityDifference * itemPrice;
  
  // Update the subtotal
  const newSubtotal = (currentSubtotal[0]?.subtotal ?? 0) + priceDifference;
  
  await sql`
    UPDATE carts SET subtotal = ${newSubtotal}
    WHERE id = ${cartId}
  `;
}
