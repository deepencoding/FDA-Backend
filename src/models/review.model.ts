import { sql } from "bun";

export type Review = {
  id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
};

export type ReviewWithUser = Review & {
  user_name: string;
};

// Create a new review
export async function createReview(
  reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>
): Promise<Review> {
  return await sql.transaction(async (tx) => {
    // Create the review
    const [review]: Review[] = await tx`
      INSERT INTO reviews ${sql(reviewData)}
      RETURNING *
    `;

    // Update restaurant average rating
    await tx`
      UPDATE restaurant_info
      SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE restaurant_id = ${reviewData.restaurant_id}
      )
      WHERE restaurant_id = ${reviewData.restaurant_id}
    `;

    return review;
  });
}

// Get reviews by restaurant ID
export async function getReviewsByRestaurantId(restaurantId: number): Promise<ReviewWithUser[]> {
  return await sql`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.restaurant_id = ${restaurantId}
    ORDER BY r.created_at DESC
  `;
}

// Get review by ID
export async function getReviewById(reviewId: number): Promise<ReviewWithUser | null> {
  const reviews: ReviewWithUser[] = await sql`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.id = ${reviewId}
  `;
  return reviews[0] || null;
}

// Update review
export async function updateReview(
  reviewId: number,
  userId: number,
  updates: {
    rating?: number;
    comment?: string;
  }
): Promise<Review | null> {
  return await sql.transaction(async (tx) => {
    // Update the review
    const [review]: Review[] = await tx`
      UPDATE reviews
      SET ${sql(updates)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${reviewId} AND user_id = ${userId}
      RETURNING *
    `;

    if (!review) return null;

    // Update restaurant average rating
    await tx`
      UPDATE restaurant_info
      SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE restaurant_id = ${review.restaurant_id}
      )
      WHERE restaurant_id = ${review.restaurant_id}
    `;

    return review;
  });
}

// Delete review
export async function deleteReview(reviewId: number, userId: number): Promise<boolean> {
  return await sql.transaction(async (tx) => {
    // Get the review first to know the restaurant_id
    const [review]: Review[] = await tx`
      SELECT * FROM reviews
      WHERE id = ${reviewId} AND user_id = ${userId}
    `;

    if (!review) return false;

    // Delete the review
    await tx`
      DELETE FROM reviews
      WHERE id = ${reviewId} AND user_id = ${userId}
    `;

    // Update restaurant average rating
    await tx`
      UPDATE restaurant_info
      SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE restaurant_id = ${review.restaurant_id}
      )
      WHERE restaurant_id = ${review.restaurant_id}
    `;

    return true;
  });
}

// Get user's reviews
export async function getUserReviews(userId: number): Promise<ReviewWithUser[]> {
  return await sql`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
  `;
}