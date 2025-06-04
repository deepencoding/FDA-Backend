import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus
} from '../controllers/order.controller';

const router = Router();

// All order routes require authentication
router.use(auth);

// User routes
router.post('/orders', createOrder);
router.get('/orders/user', getUserOrders);

// Restaurant routes
router.get('/orders/restaurant', getRestaurantOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router; 