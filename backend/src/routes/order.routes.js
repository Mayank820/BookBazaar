import express from "express";
import { placeOrder } from "../controllers/order.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", verifyAccessToken, placeOrder);

export default router;
