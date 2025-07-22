import { asyncHandler } from "../utils/async-handler.js";
import { Payment } from "../models/payment.models.js";
import { Order } from "../models/orders.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { createCashfreePaymentLink } from "../utils/cashfree.utils.js";
import { PAYMENT_METHODS } from "../utils/constants.js";
import crypto from "crypto";

export const cashfreeWebhook = asyncHandler(async (req, res) => {
  console.log("Webhook raw body:", req.body);
  console.log("Headers:", req.headers);
  const secret = process.env.CASHFREE_WEBHOOK_SECRET;

  const signature = req.headers["x-cashfree-signature"];
  const payload = JSON.stringify(req.body);

  // Step 1: Verify Signature
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  if (signature !== computedSignature) {
    throw new ApiError(401, "Invalid signature from Cashfree");
  }

  const { order_id, order_status, payment } = req.body;

  // Step 2: Find and update payment and order
  const dbPayment = await Payment.findOne({
    providerPaymentId: payment.payment_id,
  });

  if (!dbPayment) {
    throw new ApiError(404, "Payment record not found");
  }

  dbPayment.status = order_status === "PAID" ? "COMPLETED" : "FAILED";
  dbPayment.paidAt = new Date(payment.payment_time);
  await dbPayment.save();

  // Update order too
  const order = await Order.findById(dbPayment.order);
  if (order) {
    order.orderStatus = order_status === "PAID" ? "COMPLETED" : "FAILED";
    await order.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Webhook received and processed"));
});

export const createPaymentLink = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("user");
  if (!order) throw new ApiError(404, "Order not found");

  if (order.payment)
    throw new ApiError(400, "Payment already initiated for this order");

  // Generate payment link if method is CASHFREE
  const paymentLinkData = await createCashfreePaymentLink({
    orderId: order._id.toString(),
    amount: order.totalAmount,
    customerName: order.user.name,
    customerEmail: order.user.email,
    customerPhone: order.user.phone || "9999999999",
  });

  // Save to payment DB
  const payment = await Payment.create({
    user: order.user._id,
    order: order._id,
    amount: order.totalAmount,
    method: PAYMENT_METHODS.CASHFREE,
    providerPaymentId: paymentLinkData.link_id,
  });

  order.payment = payment._id;
  await order.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { link: paymentLinkData.link_url },
        "Payment link created",
      ),
    );
});
