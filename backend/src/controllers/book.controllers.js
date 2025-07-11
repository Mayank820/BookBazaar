import { Book } from "../models/book.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/async-handler.js";
import { cloudinary } from "../config/cloudinary.config.js";

const createBook = asyncHandler(async (req, res) => {
  console.log("📚 Inside createBook()");
  console.log("req.file: ", req.file);
  console.log("req.body: ", req.body);
  // collecting the neccessary data for creation of book
  const { title, author, isbn, description, category, price, stock } = req.body;

  // without cover image book is not uploaded
  if (!req.file) throw new ApiError(400, "Cover image is required");

  // const cloudinaryResult = await uploadToCloudinary(req.file.path, "books");
  const coverImage = req.file?.path;

  const book = await Book.create({
    title,
    author,
    isbn,
    description,
    category,
    price,
    stock,
    coverImage,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, book, "Book created successfully"));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("createdBy", "username email");

  res.status(200).json(new ApiResponse(200, books));
});

const getBooksById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("reviews");
  if (!book) throw new ApiError(404, "Book not found");

  res.status(200).json(new ApiResponse(200, book));
});

const extractCloudinaryPublicId = (imageurl) => {
  try {
    const url = new URL(imageurl);
    const parts = url.pathname.split("/"); // e.g., /image/upload/v123456/BookBazaar/books/image-name.jpg
    const fileWithExt = parts.slice(3).join("/"); // skip `/image/upload/v...`
    return fileWithExt.replace(/\.[^/.]+$/, ""); // remove extensions
  } catch (error) {
    return null;
  }
};

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) throw new ApiError(404, "Book not found");

  // If a new image is uploaded
  if (req.file) {
    // If old image exists
    if (book.coverImage) {
      if (book.coverImage.startsWith("http")) {
        // Delete Cloudinary image
        const publicId = extractCloudinaryPublicId(book.coverImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } else if (fs.existsSync(book.coverImage)) {
        // Delete local image
        fs.unlinkSync(book.coverImage);
      }
    }

    // Save new Cloudinary image URL
    book.coverImage = req.file.path; // set by multer-storage-cloudinary
  }

  const updatableFields = [
    "title",
    "author",
    "isbn",
    "description",
    "category",
    "price",
    "stock",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field]) book[field] = req.body[field];
  });

  await book.save();

  res.status(200).json(new ApiResponse(200, book, "Book updated"));
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, "Book not found");

  await book.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Book deleted"));
});

export { createBook, getAllBooks, getBooksById, updateBook, deleteBook };
