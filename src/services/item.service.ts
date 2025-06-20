import * as restaurantModel from '../models/restaurant.model';

export const getMenuItemById = async (itemId: number) => {
  const menuItem = await restaurantModel.getMenuItemById(itemId);
  if (!menuItem) {
    throw { status: 404, message: 'Menu item not found' };
  }
  return menuItem;
}; 