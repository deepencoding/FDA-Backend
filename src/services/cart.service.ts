import { clearCartItems, createCart, getActiveCartId, getCartItems, getCartMeta, getCartRestaurant, getRestaurantInfo, updateCartNotes, upsertCartItem } from "../models/cart.model";

type cartPayload = {
	restaurantId: number;
	itemId: number;
	itemQuantity: number;
	noteForRestaurant?: string;
	noteForDeliveryPartner?: string;
	deliveryType?: 'standard' | 'scheduled';
	scheduledDeliveryTime?: string;
};

export type RestaurantInfo = {
	restaurantId: number;
	restaurantImage: string;
	restaurantName: string;
	address?: string;
};

export async function fetchCartData(userId: number) {
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
    restaurantData: restaurant ?? null,
    cartItemCount: items.length,
    noteForRestaurant: cart?.noteForRestaurant,
    noteForDeliveryPartner: cart?.noteForDeliveryPartner,
    deliveryType: cart?.deliveryType,
    scheduledDeliveryTime: cart?.scheduledDeliveryTime,
    subtotal: cart?.subtotal,
    items
  };
}

export async function addCartData(userId: number, payload: cartPayload) {
	const { restaurantId, itemId, itemQuantity, ...meta } = payload;

	let cartId = await getActiveCartId(userId);
	if (!cartId) {
		cartId = await createCart(userId, restaurantId, meta);
	}

	console.log(cartId);
	let oldRestaurantId = await getCartRestaurant(cartId);
	console.log(restaurantId, oldRestaurantId);
	if (restaurantId !== oldRestaurantId) {
		await clearCartItems(cartId);
	}

	await updateCartNotes(cartId, restaurantId, meta);
	await upsertCartItem(cartId, itemId, itemQuantity);
}

export async function updateCartData(userId: number, payload: Omit<cartPayload, 'restaurantId'>) {
	const cartId = await getActiveCartId(userId);
	if (!cartId) throw new Error('No active cart');

	await upsertCartItem(cartId, payload.itemId, payload.itemQuantity);
}
