import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as restaurantService from '../services/restaurant.service';
import type { CustomRequest } from '../middlewares/auth.middleware';

// Get restaurant details with menu
export const getRestaurantDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.id);
    const data = await restaurantService.getRestaurantDetails(restaurantId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update restaurant info (protected - only restaurant owner)
export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.id);

    const updates = {
      type: req.body.type,
      image_url: req.body.image_url,
      address: req.body.address
    };

    const updatedRestaurant = await restaurantService.updateRestaurant(
      restaurantId,
      (req as CustomRequest).user,
      updates
    );

    res.status(200).json({
      success: true,
      data: {
        restaurant: updatedRestaurant,
        message: 'Restaurant updated successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Add menu item (protected - only restaurant owner)
export const addMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.id);

    const menuItemData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_url: req.body.image_url,
      category: req.body.category,
    };

    const newMenuItem = await restaurantService.addMenuItem(
      restaurantId,
      (req as CustomRequest).user,
      menuItemData
    );

    res.status(201).json({
      success: true,
      data: {
        menu_item: newMenuItem,
        message: 'Menu item added successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update menu item (protected - only restaurant owner)
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.id);

    if (!req.params.itemId) {
      res.status(400).json({
        success: false,
        message: 'Menu item id not found.'
      });
      return;
    }
    const menuItemId = parseInt(req.params.itemId);

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_url: req.body.image_url,
      category: req.body.category,
      is_available: req.body.is_available
    };

    const updatedMenuItem = await restaurantService.updateMenuItem(
      restaurantId,
      menuItemId,
      (req as CustomRequest).user,
      updates
    );

    res.status(200).json({
      success: true,
      data: {
        menu_item: updatedMenuItem,
        message: 'Menu item updated successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Delete menu item (protected - only restaurant owner)
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.id);

    if (!req.params.itemId) {
      res.status(400).json({
        success: false,
        message: 'Menu item id not found.'
      });
      return;
    }
    const menuItemId = parseInt(req.params.itemId);

    await restaurantService.deleteMenuItem(
      restaurantId,
      menuItemId,
      (req as CustomRequest).user
    );

    res.status(200).json({
      success: true,
      data: {
        message: 'Menu item deleted successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};