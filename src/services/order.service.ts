import * as orderModel from '../models/order.model';
import * as restaurantModel from '../models/restaurant.model';
import type { OrderStatus } from '../models/order.model';

export const createOrder = async (
  userId: number,
  restaurantId: number,
  items: any[],
  deliveryAddress: string
) => {
  // Validate restaurant exists
  const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
  if (!restaurant) {
    throw { status: 404, message: 'Restaurant not found' };
  }

  // Calculate total amount and validate menu items
  let totalAmount = 0;
  const orderItems = [];
  const menuItemsMap = new Map(restaurant.menu_items.map(item => [item.id, item]));

  for (const item of items) {
    const menuItem = menuItemsMap.get(item.menuItemId);
    if (!menuItem) {
      throw { status: 400, message: `Menu item ${item.menuItemId} not found` };
    }

    if (!menuItem.is_available) {
      throw { status: 400, message: `Menu item ${menuItem.name} is not available` };
    }

    const itemTotal = menuItem.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      unit_price: menuItem.price,
      special_instructions: item.specialInstructions
    });
  }

  // Create order
  const order = await orderModel.createOrder(
    {
      user_id: userId,
      restaurant_id: restaurantId,
      status: 'pending',
      total_amount: totalAmount,
      delivery_address: deliveryAddress
    },
    orderItems
  );

  // Get full order details
  return await orderModel.getOrderById(order.id);
};

export const getUserOrders = async (userId: number) => {
  return await orderModel.getOrdersByUserId(userId);
};

export const getRestaurantOrders = async (restaurantId: number, userRole: string) => {
  if (userRole !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to view restaurant orders' };
  }
  return await orderModel.getOrdersByRestaurantId(restaurantId);
};

export const updateOrderStatus = async (
  orderId: number,
  restaurantId: number,
  userRole: string,
  newStatus: OrderStatus
) => {
  if (userRole !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to update order status' };
  }

  // Validate status transition
  const validStatuses: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw { status: 400, message: 'Invalid order status' };
  }

  const updatedOrder = await orderModel.updateOrderStatus(orderId, restaurantId, newStatus);
  if (!updatedOrder) {
    throw { status: 404, message: 'Order not found' };
  }
  return updatedOrder;
}; 