import { Review } from "../models/review.models.js";
import { Book } from "../models/book.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

// Add a reivew
const addReview = asyncHandler(async (req, res) => {
  const { bookId, rating, comment } = req.body;
  const userId = req.user._id;

  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, "Book not found");

  const existingReview = await Review.findOne({ book: bookId, user: req.user._id });
  if (existingReview)
    throw new ApiError(400, "You have already reviewed this book");

  const review = await Review.create({
    book: bookId,
    user: userId,
    rating,
    comment,
  });

  // Update book stats
  const reviews = await Review.find({ book: bookId });
  book.numOfReviews = reviews.length;
  book.averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await book.save();

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});

// Update review
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { id: reviewId } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");
  if (!review.user.equals(userId))
    throw new ApiError(403, "Unauthorized to review");

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();

  //   Recalculate the stats
  const reviews = await Review.find({ book: review.book });
  const book = await Book.findById(review.book);
  book.averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await book.save();

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === "ADMIN";

  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");
  if (!review.user.equals(userId) && !isAdmin)
    throw new ApiError(403, "Unauthorized");

  await review.deleteOne();

  // Recalcuate the book stats after deleting the review
  const book = await Book.findById(review.book);
  const reviews = await Review.find({ book: book._id });
  book.numOfReviews = reviews.length;
  book.averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  await book.save();
  res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});

// Get all reviews for a specific book
const getReviewsForBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const reviews = await Review.find({ book: bookId }).populate(
    "user",
    "username fullName",
  );

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export { addReview, updateReview, deleteReview, getReviewsForBook };
