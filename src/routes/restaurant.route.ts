import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  getRestaurantDetails,
  getAllRestaurants,
  getMenuItemByRestaurant,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/restaurant.controller';

const router = Router();

// Public routes
router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/:id', getRestaurantDetails);
router.get('/restaurants/:restaurantId/menu/:itemId', getMenuItemByRestaurant);

// Protected routes - require authentication
router.use(auth);
router.put('/restaurants/:id', updateRestaurant);
router.post('/restaurants/:id/menu', addMenuItem);
router.put('/restaurants/:id/menu/:itemId', updateMenuItem);
router.delete('/restaurants/:id/menu/:itemId', deleteMenuItem);

export const restaurantRouter = router;