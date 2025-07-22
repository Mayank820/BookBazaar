import express from "express";
import {
  cashfreeWebhook,
  createPaymentLink,
} from "../controllers/payment.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Webhook must be raw, no bodyParser
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  cashfreeWebhook,
);

router.post("/create-link/:orderId", isLoggedIn, createPaymentLink);

export default router;
