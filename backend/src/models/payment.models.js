import mongoose from "mongoose";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  REFUND_STATUS,
} from "../utils/constants.js";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    paymentProviderId: {
      type: String,
      required: false, // depends on payment method (Razorpay, Stripe, etc.)
    },

    refundStatus: {
      type: String,
      enum: Object.values(REFUND_STATUS),
      default: REFUND_STATUS.NOT_REQUESTED,
    },

    signature: {
      type: String,
      required: false, // used in Razorpay/Stripe to verify authenticity
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
