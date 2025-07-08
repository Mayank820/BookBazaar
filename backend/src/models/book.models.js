import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-fiction",
        "Sci-Fi",
        "Biography",
        "Comics",
        "History",
        "Other",
      ],
      default: "Other",
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// 🔍 Full-text search on title, author, category
bookSchema.index({ title: "text", author: "text", category: "text" });

// 🧩 Virtual populate for reviews (not stored in DB)
/**
 * What it does: -
 *  Below code creates vitual connection between: - 
 *  ->  The Book model (_id field)
 *  -> The Review model (book field, which should contain the ObjectId of a book)
 *
 */
bookSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
  
});

// Ensure virtuals are included when using .toJSON() or .toObject()
bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });

export const Book = mongoose.model("Book", bookSchema);
