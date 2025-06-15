import { getCartItems, getCartMeta, getCartRestaurant } from "../models/cart.model";

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
