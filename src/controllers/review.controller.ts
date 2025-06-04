import type { Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as reviewModel from '../models/review.model';
import * as restaurantModel from '../models/restaurant.model';
import type { CustomRequest } from '../middlewares/auth.middleware';

// Create a new review
export const createReview = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user._id);
    const restaurantId = parseInt(req.params.restaurantId);
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
      return;
    }

    // Check if restaurant exists
    const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    // Create review
    const review = await reviewModel.createReview({
      user_id: userId,
      restaurant_id: restaurantId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: {
        review,
        message: 'Review created successfully'
      }
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique constraint')) {
      res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get reviews for a restaurant
export const getRestaurantReviews = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);

    // Check if restaurant exists
    const restaurant = await restaurantModel.getRestaurantWithMenu(restaurantId);
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
      return;
    }

    const reviews = await reviewModel.getReviewsByRestaurantId(restaurantId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        message: 'Reviews retrieved successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user._id);
    const reviews = await reviewModel.getUserReviews(userId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        message: 'Reviews retrieved successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Update review
export const updateReview = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user._id);
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
      return;
    }

    const updates = {
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment })
    };

    const updatedReview = await reviewModel.updateReview(reviewId, userId, updates);

    if (!updatedReview) {
      res.status(404).json({
        success: false,
        message: 'Review not found or not authorized to update'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        review: updatedReview,
        message: 'Review updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Delete review
export const deleteReview = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.user._id);
    const reviewId = parseInt(req.params.id);

    const deleted = await reviewModel.deleteReview(reviewId, userId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Review not found or not authorized to delete'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
}; 