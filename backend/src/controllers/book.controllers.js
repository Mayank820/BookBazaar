import { Book } from "../models/book.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/async-handler.js";

const createBook = asyncHandler(async (req, res) => {
  // collecting the neccessary data for creation of book
  const { title, author, isbn, description, category, price, stock } = req.body;

  // without cover image book is not uploaded
  if (!req.file) throw new ApiError(400, "Cover image is required");

  const cloudinaryResult = await uploadToCloudinary(req.file.path, "books");

  const book = await Book.create({
    title,
    author,
    isbn,
    description,
    category,
    price,
    stock,
    coverImage: cloudinaryResult.url,
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

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) throw new ApiError(404, "Book not found");

  // If admin wants to change the cover image
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path, "books");
    book.coverImage = uploadResult.url;
  }

  const fields = [
    "title",
    "author",
    "isbn",
    "description",
    "category",
    "price",
    "stock",
  ];

  fields.forEach((field) => {
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

export { createBook, getAllBooks, getBookById, updateBook, deleteBook };
