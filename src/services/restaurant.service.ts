import * as restaurantModel from '../models/restaurant.model';
import type { CustomRequest } from '../middlewares/auth.middleware';
import type { MenuItem } from '../models/restaurant.model';

export const getRestaurantDetails = async (restaurantId: number) => {
  return await restaurantModel.getRestaurantWithMenu(restaurantId);
};

export const updateRestaurant = async (
  restaurantId: number,
  user: CustomRequest['user'],
  updates: { type?: string; image_url?: string; address?: string }
) => {
  if (user.id !== restaurantId || user.role !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to update this restaurant' };
  }

  return await restaurantModel.updateRestaurantInfo(restaurantId, updates);
};

export const addMenuItem = async (
  restaurantId: number,
  user: CustomRequest['user'],
  menuItemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'is_available'>
) => {
  if (user.id !== restaurantId || user.role !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to add menu items' };
  }

  const menuItem = {
    ...menuItemData,
    restaurant_id: restaurantId,
    is_available: true,
  };

  return await restaurantModel.createMenuItem(menuItem);
};

export const updateMenuItem = async (
  restaurantId: number,
  menuItemId: number,
  user: CustomRequest['user'],
  updates: Partial<MenuItem>
) => {
  if (user.id !== restaurantId || user.role !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to update menu items' };
  }

  const updatedMenuItem = await restaurantModel.updateMenuItem(menuItemId, restaurantId, updates);

  if (!updatedMenuItem) {
    throw { status: 404, message: 'Menu item not found' };
  }
  return updatedMenuItem;
};

export const deleteMenuItem = async (
  restaurantId: number,
  menuItemId: number,
  user: CustomRequest['user']
) => {
  if (user.id !== restaurantId || user.role !== 'restaurant') {
    throw { status: 403, message: 'Not authorized to delete menu items' };
  }

  const deleted = await restaurantModel.deleteMenuItem(menuItemId, restaurantId);

  if (!deleted) {
    throw { status: 404, message: 'Menu item not found' };
  }
  return deleted;
};

export const getAllRestaurants = async () => {
  return await restaurantModel.getTopRestaurants();
};

export const getMenuItemByRestaurant = async (restaurantId: number, itemId: number) => {
  const menuItem = await restaurantModel.getMenuItemById(itemId);
  
  if (!menuItem) {
    throw { status: 404, message: 'Menu item not found' };
  }
  
  if (menuItem.restaurant_id !== restaurantId) {
    throw { status: 404, message: 'Menu item not found in this restaurant' };
  }
  
  return menuItem;
}; 