import * as reviewModel from '../models/review.model';
import * as restaurantModel from '../models/restaurant.model';

export const createReview = async (
  userId: number,
  restaurantId: number,
  rating: number,
  comment: string
) => {
  if (rating < 1 || rating > 5) {
    throw { status: 400, message: 'Rating must be between 1 and 5' };
  }

  const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
  if (!restaurant) {
    throw { status: 404, message: 'Restaurant not found' };
  }

  try {
    return await reviewModel.createReview({
      user_id: userId,
      restaurant_id: restaurantId,
      rating,
      comment
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('unique constraint')) {
      throw { status: 400, message: 'You have already reviewed this restaurant' };
    }
    throw error;
  }
};

export const getRestaurantReviews = async (restaurantId: number) => {
  const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
  if (!restaurant) {
    throw { status: 404, message: 'Restaurant not found' };
  }
  return await reviewModel.getReviewsByRestaurantId(restaurantId);
};

export const getUserReviews = async (userId: number) => {
  return await reviewModel.getUserReviews(userId);
};

export const updateReview = async (
  reviewId: number,
  userId: number,
  updates: { rating?: number; comment?: string }
) => {
  if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
    throw { status: 400, message: 'Rating must be between 1 and 5' };
  }

  const updatedReview = await reviewModel.updateReview(reviewId, userId, updates);
  if (!updatedReview) {
    throw { status: 404, message: 'Review not found or not authorized to update' };
  }
  return updatedReview;
};

export const deleteReview = async (reviewId: number, userId: number) => {
  const deleted = await reviewModel.deleteReview(reviewId, userId);
  if (!deleted) {
    throw { status: 404, message: 'Review not found or not authorized to delete' };
  }
  return deleted;
}; 