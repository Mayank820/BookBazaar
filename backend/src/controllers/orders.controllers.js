import { createCashfreeOrder } from "../utils/cashfree.utils.js";
import { Order } from "../models/orders.models.js";
import { Payment } from "../models/payment.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { books, shippingAddress, totalAmount } = req.body;
  const userId = req.user._id;

  const order = await Order.create({
    user: userId,
    books,
    shippingAddress,
    totalAmount,
  });

  const payment = await Payment.create({
    user: userId,
    order: order._id,
    amount: totalAmount,
    method: "ONLINE",
  });

  order.payment = payment._id;
  await order.save();

  const cfOrder = await createCashfreeOrder({
    orderId: order.orderId,
    orderAmount: totalAmount,
    customerDetails: {
      customer_id: userId.toString(),
      customer_email: req.user.email,
      customer_phone: req.user.phone || "9999999999",
    },
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: order.orderId,
        paymentSession: cfOrder.payment_session_id,
        paymentLink: cfOrder.payment_link,
      },
      "Order created. Redirect user to payment.",
    ),
  );
});
