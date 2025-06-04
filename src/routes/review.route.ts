import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import {
  createReview,
  getRestaurantReviews,
  getUserReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller';

const router = Router();

// Public routes
router.get('/restaurants/:restaurantId/reviews', getRestaurantReviews);

// Protected routes - require authentication
router.use(auth);
router.post('/restaurants/:restaurantId/reviews', createReview);
router.get('/reviews/user', getUserReviews);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

export default router; 