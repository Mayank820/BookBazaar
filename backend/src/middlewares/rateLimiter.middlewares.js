import { rateLimit } from "express-rate-limit";

export const rateLimiterByApiKey = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each API key to 100 requests per windowMs
  message: "Your limit is reached",
  keyGenerator: (req) => req.headers["x-api-key"] || "",

  handler: (req, res) => {
    return res
      .status(429)
      .json({ success: false, message: "Too many requests, slow down" });
  },
});
