import { sql } from "bun";
import { clearCartItems, createCart, getActiveCartId, getCartItems, getCartMeta, getCartRestaurant, getRestaurantInfo, updateCartNotes, upsertCartItem, type cartItemsInfo, calculateAndUpdateCartSubtotal } from "../models/cart.model";

type cartPayload = {
	restaurantId: string;
	itemId: string;
	itemQuantity: number;
	noteForRestaurant?: string;
	noteForDeliveryPartner?: string;
	deliveryType?: 'standard' | 'scheduled';
	scheduledDeliveryTime?: string;
};

export type RestaurantInfo = {
	restaurantId: string;
	restaurantImage: string;
	restaurantName: string;
	address?: string;
};

type cartDataResponse = {
	restaurantData: RestaurantInfo | null;
	cartItemCount: string;
	noteForRestaurant: string;
	noteForDeliveryPartner: string;
	deliveryType: "standard" | "scheduled";
	scheduledDeliveryTime: string;
	subtotal: string;
	items: cartItemsInfo[];
};

export async function fetchCartData(userId: number): Promise<cartDataResponse> {
	let cartId = await getActiveCartId(userId);
	if (!cartId) {
		cartId = await createCart(userId, null, {});
	}
  const [restaurantId, cart, items] = await Promise.all([
    getCartRestaurant(cartId),
    getCartMeta(cartId),
    getCartItems(cartId)
  ]);

	let restaurant: RestaurantInfo | null = null;
	if (restaurantId) restaurant = await getRestaurantInfo(restaurantId);

  return {
    restaurantData: restaurant,
    cartItemCount: String(items.length),
    noteForRestaurant: cart?.noteForRestaurant ?? "",
    noteForDeliveryPartner: cart?.noteForDeliveryPartner ?? "",
    deliveryType: cart?.deliveryType ?? "standard",
    scheduledDeliveryTime: cart?.scheduledDeliveryTime ?? "",
    subtotal: String(cart?.subtotal),
    items
  };
}

export async function addCartData(userId: number, payload: cartPayload) {
	const { restaurantId, itemId, itemQuantity, ...meta } = payload;

	let cartId = await getActiveCartId(userId);
	if (!cartId) {
		cartId = await createCart(userId, Number(restaurantId), meta);
	}

	let oldRestaurantId = await getCartRestaurant(cartId);
	if (+restaurantId !== oldRestaurantId) {
		await clearCartItems(cartId);
		// Reset subtotal when changing restaurants
		await sql`UPDATE carts SET subtotal = 0 WHERE id = ${cartId}`;
	}

	await updateCartNotes(cartId, Number(restaurantId), meta);
	await upsertCartItem(cartId, Number(itemId), itemQuantity);
	
	// Calculate and update subtotal after adding item
	await calculateAndUpdateCartSubtotal(cartId);
}

export async function updateCartData(userId: number, payload: Omit<cartPayload, 'restaurantId'>) {
	const cartId = await getActiveCartId(userId);
	if (!cartId) throw new Error('No active cart');

	await upsertCartItem(cartId, Number(payload.itemId), payload.itemQuantity);
	
	// Calculate and update subtotal after updating item
	await calculateAndUpdateCartSubtotal(cartId);
}
