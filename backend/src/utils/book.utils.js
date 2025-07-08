import { Book } from "../models/book.models.js";
import { Review } from "../models/review.models.js";

export const updateBookStats = async (bookId) => {
  const reviews = await Review.find({ book: bookId });

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;

  await Book.findByIdAndUpdate(bookId, {
    averageRating: Number(averageRating.toFixed(1)),
    numOfReviews: reviews.length,
  });
};
