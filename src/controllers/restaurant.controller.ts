import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as restaurantModel from '../models/restaurant.model';
import type { CustomRequest } from '../middlewares/auth.middleware';

// Get restaurant details with menu
export const getRestaurantDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.id);
    const data = await restaurantModel.getRestaurantWithMenu(restaurantId);
    
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
export const updateRestaurant = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.id);
    
    // Check if user is the restaurant owner
    if (req.user._id !== restaurantId.toString() || req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
      return;
    }

    const updates = {
      type: req.body.type,
      image_url: req.body.image_url,
      address: req.body.address
    };

    const updatedRestaurant = await restaurantModel.updateRestaurantInfo(restaurantId, updates);
    
    res.status(200).json({
      success: true,
      data: {
        restaurant: updatedRestaurant,
        message: 'Restaurant updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Add menu item (protected - only restaurant owner)
export const addMenuItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.id);
    
    // Check if user is the restaurant owner
    if (req.user._id !== restaurantId.toString() || req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to add menu items'
      });
      return;
    }

    const menuItem = {
      restaurant_id: restaurantId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_url: req.body.image_url,
      category: req.body.category,
      is_available: true
    };

    const newMenuItem = await restaurantModel.createMenuItem(menuItem);
    
    res.status(201).json({
      success: true,
      data: {
        menu_item: newMenuItem,
        message: 'Menu item added successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update menu item (protected - only restaurant owner)
export const updateMenuItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.id);
    const menuItemId = parseInt(req.params.itemId);
    
    // Check if user is the restaurant owner
    if (req.user._id !== restaurantId.toString() || req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update menu items'
      });
      return;
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_url: req.body.image_url,
      category: req.body.category,
      is_available: req.body.is_available
    };

    const updatedMenuItem = await restaurantModel.updateMenuItem(menuItemId, restaurantId, updates);
    
    if (!updatedMenuItem) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        menu_item: updatedMenuItem,
        message: 'Menu item updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Delete menu item (protected - only restaurant owner)
export const deleteMenuItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.id);
    const menuItemId = parseInt(req.params.itemId);
    
    // Check if user is the restaurant owner
    if (req.user._id !== restaurantId.toString() || req.user.role !== 'restaurant') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete menu items'
      });
      return;
    }

    const deleted = await restaurantModel.deleteMenuItem(menuItemId, restaurantId);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Menu item deleted successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
}; 