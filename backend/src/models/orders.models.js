import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
