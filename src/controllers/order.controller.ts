import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as orderService from '../services/order.service';
import type { CustomRequest } from '../middlewares/auth.middleware';
import type { OrderStatus } from '../models/order.model';

// Create a new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    const { restaurantId, items, deliveryAddress } = req.body;

    const orderWithItems = await orderService.createOrder(
      userId,
      restaurantId,
      items,
      deliveryAddress
    );

    res.status(201).json({
      success: true,
      data: {
        order: orderWithItems,
        message: 'Order created successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    const orders = await orderService.getUserOrders(userId);

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
export const getRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = (req as CustomRequest).user.id;
    const userRole = (req as CustomRequest).user.role;

    const orders = await orderService.getRestaurantOrders(restaurantId, userRole);

    res.status(200).json({
      success: true,
      data: {
        orders,
        message: 'Orders retrieved successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update order status (restaurant only)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = (req as CustomRequest).user.id;
    const userRole = (req as CustomRequest).user.role;

    if (!req.params.id) {
      res.status(401).json({
        success: false,
        message: 'Order id not found.'
      });
      return;
    }
    const orderId = parseInt(req.params.id);
    const newStatus = req.body.status as OrderStatus;

    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      restaurantId,
      userRole,
      newStatus
    );

    res.status(200).json({
      success: true,
      data: {
        order: updatedOrder,
        message: 'Order status updated successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};