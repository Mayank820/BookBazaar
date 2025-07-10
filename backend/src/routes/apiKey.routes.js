import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middlewares.js";
import { generateApiKey } from "../controllers/apiKey.controller.js";

const router = Router();

router.post("/generate-key", verifyAccessToken, generateApiKey);

export default router;
