import { Router } from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getReviewsForBook,
} from "../controllers/review.controllers.js";
import { verifyAccessToken } from "../middlewares/auth.middlewares.js";

const router = Router();

// Add a review (only for logged-in user)
router.post("/", verifyAccessToken, addReview);

// Update a review (only the user who posted it)
router.put("/:id", verifyAccessToken, updateReview);

//  Delete a review (user or admin)
router.delete("/:id", verifyAccessToken, deleteReview);

// Get all reviews for a book (public route)
router.get("/book/:bookId", getReviewsForBook);

export default router;
