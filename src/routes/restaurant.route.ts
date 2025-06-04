import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  getRestaurantDetails,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/restaurant.controller';

const router = Router();

// Public routes
router.get('/restaurants/:id', getRestaurantDetails);

// Protected routes - require authentication
router.use(auth);
router.put('/restaurants/:id', updateRestaurant);
router.post('/restaurants/:id/menu', addMenuItem);
router.put('/restaurants/:id/menu/:itemId', updateMenuItem);
router.delete('/restaurants/:id/menu/:itemId', deleteMenuItem);

export default router; 