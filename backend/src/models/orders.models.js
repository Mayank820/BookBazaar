import mongoose from "mongoose";
import { ORDER_STATUS } from "../utils/constants.js";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    coupon: {
      type: String, // Apply coupon code here (optional)
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PROCESSING,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Auto-generate orderId before save
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    this.orderId = `ORD_${Date.now().toString().slice(-6)}`;
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
