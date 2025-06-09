import type { Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as orderModel from '../models/order.model';
import * as restaurantModel from '../models/restaurant.model';
import type { CustomRequest } from '../middlewares/auth.middleware';
import type { OrderStatus } from '../models/order.model';

// Create a new order
export const createOrder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user.id);
    const { restaurantId, items, deliveryAddress } = req.body;

    // Validate restaurant exists
    const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    // Calculate total amount and validate menu items
    let totalAmount = 0;
    const orderItems = [];
    const menuItemsMap = new Map(restaurant.menu_items.map(item => [item.id, item]));

    for (const item of items) {
      const menuItem = menuItemsMap.get(item.menuItemId);
      if (!menuItem) {
        res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItemId} not found`
        });
        return;
      }

      if (!menuItem.is_available) {
        res.status(400).json({
          success: false,
          message: `Menu item ${menuItem.name} is not available`
        });
        return;
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
    const orderWithItems = await orderModel.getOrderById(order.id);

    res.status(201).json({
      success: true,
      data: {
        order: orderWithItems,
        message: 'Order created successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user.id);
    const orders = await orderModel.getOrdersByUserId(userId);

    res.status(200).json({
      success: true,
      data: {
        orders,
        message: 'Orders retrieved successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get restaurant's orders
export const getRestaurantOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.user.id);
    
    // Check if user is a restaurant
    if (req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view restaurant orders'
      });
      return;
    }

    const orders = await orderModel.getOrdersByRestaurantId(restaurantId);

    res.status(200).json({
      success: true,
      data: {
        orders,
        message: 'Orders retrieved successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update order status (restaurant only)
export const updateOrderStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.user.id);
    const orderId = parseInt(req.params.id);
    const newStatus = req.body.status as OrderStatus;
    
    // Check if user is a restaurant
    if (req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update order status'
      });
      return;
    }

    // Validate status transition
    const validStatuses: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
      return;
    }

    const updatedOrder = await orderModel.updateOrderStatus(orderId, restaurantId, newStatus);
    
    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        order: updatedOrder,
        message: 'Order status updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
}; 