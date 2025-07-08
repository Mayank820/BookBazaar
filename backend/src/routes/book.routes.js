import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";
import { verifyAccessToken, isAdmin } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.post(
  "/",
  verifyAccessToken,
  isAdmin,
  upload.single("coverImage"),
  createBook,
);
router.put(
  "/:id",
  verifyAccessToken,
  isAdmin,
  upload.single("coverImage"),
  updateBook,
);
router.delete("/:id", verifyAccessToken, isAdmin, deleteBook);

export default router;
