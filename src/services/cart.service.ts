import { clearCartItems, createCart, getActiveCartId, getCartItems, getCartMeta, getCartRestaurant, updateCartNotes, upsertCartItems } from "../models/cart.model";

type cartItemPayload = { itemId: number; itemQuantity: number };
type cartPayload = {
	restaurantId: number;
	items: cartItemPayload[];
	noteForRestaurant?: string;
	noteForDeliveryPartner?: string;
	deliveryType?: 'standard' | 'scheduled';
	scheduledDeliveryTime?: string;
};

export async function fetchCartData(userId: number) {
  const [restaurant, cart, items] = await Promise.all([
    getCartRestaurant(userId),
    getCartMeta(userId),
    getCartItems(userId)
  ]);

  // const isCartEmpty = !restaurant;

  return {
    restaurant: restaurant ?? null,
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
	const { restaurantId, items, ...meta } = payload;

	let cartId = await getActiveCartId(userId);
	if (!cartId) {
		cartId = await createCart(userId, restaurantId, meta);
	} else {
		await clearCartItems(cartId);
		await updateCartNotes(cartId, restaurantId, meta);
	}

	for (const { itemId, itemQuantity } of items) {
		await upsertCartItems(cartId, itemId, itemQuantity);
	}
}

export async function updateCartData(userId: number, payload: cartPayload) {
	const { restaurantId, items, ...meta } = payload;
	const cartId = await getActiveCartId(userId);
	if (!cartId) throw new Error('No active cart');

	await updateCartNotes(cartId, restaurantId, meta);

	for (const { itemId, itemQuantity } of items) {
		await upsertCartItems(cartId, itemId, itemQuantity);
	}
}
