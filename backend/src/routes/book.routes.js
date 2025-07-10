import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBooksById,
  updateBook,
} from "../controllers/book.controllers.js";
import { verifyAccessToken, isAdmin } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyApiKey } from "../middlewares/apiKey.middlewares.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBooksById);

router.post(
  "/create-book",
  (req, res, next) => {
    console.log("📦 Incoming POST /api/v1/book");
    next();
  },
  verifyAccessToken,
  verifyApiKey,
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

router.post(
  "/test-api-key",
  verifyApiKey,
  (req, res) => {
    res.json({ success: true, message: "API key valid!" });
  }
)

router.delete("/:id", verifyAccessToken, isAdmin, deleteBook);

export default router;
