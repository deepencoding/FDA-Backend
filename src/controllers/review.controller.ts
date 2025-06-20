import type { Request, Response } from "express";
import { getErrorMessage } from '../utils/errors';
import * as reviewService from '../services/review.service';
import type { CustomRequest } from '../middlewares/auth.middleware';

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    if (!req.params.restaurantId) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.restaurantId);
    const { rating, comment } = req.body;

    const review = await reviewService.createReview(userId, restaurantId, rating, comment);

    res.status(201).json({
      success: true,
      data: {
        review,
        message: 'Review created successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get reviews for a restaurant
export const getRestaurantReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.params.restaurantId) {
      res.status(400).json({
        success: false,
        message: 'Restaurant id not found.'
      });
      return;
    }
    const restaurantId = parseInt(req.params.restaurantId);

    const reviews = await reviewService.getRestaurantReviews(restaurantId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        message: 'Reviews retrieved successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    const reviews = await reviewService.getUserReviews(userId);

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
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Review id not found.'
      });
      return;
    }
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    const updates = {
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment })
    };

    const updatedReview = await reviewService.updateReview(reviewId, userId, updates);

    res.status(200).json({
      success: true,
      data: {
        review: updatedReview,
        message: 'Review updated successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.id;
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Review id not found.'
      });
      return;
    }
    const reviewId = parseInt(req.params.id);

    await reviewService.deleteReview(reviewId, userId);

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully'
      }
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: getErrorMessage(error)
    });
  }
};