// Matches ReviewResponseDto: { id, userId, userName, productId, rating, comment, createdAt }
export interface Review {
  id: number;
  userId: number;
  userName: string;    // backend: "userName" (not "userEmail")
  productId: number;
  rating: number;
  comment: string;
  createdAt?: string;
}

// Matches ProductRatingResponseDto: { averageRating, totalReviews }
export interface ProductRating {
  averageRating: number;
  totalReviews: number;
}
