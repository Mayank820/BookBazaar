import { APIKey } from "../models/apiKeys.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";

// export const verifyApiKey = asyncHandler(async (req, res, next) => {
//   const rawKey = req.get("x-api-key") || req.headers["x-api-key"]; // case sensitive
//   console.log("🔍 Raw API Key:", rawKey); // for debugging

//   if (!rawKey) throw new ApiError(401, "Missing APi key");

//   const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");
//   console.log("🔐 Hashed Key:", hashedKey); // for debugging

//   const validKey = await APIKey.findOne({
//     key: hashedKey,
//     isActive: true,
//     expiresAt: { $gt: new Date() },
//   });

//   if (!validKey) {
//     console.log("⛔ Invalid or expired key");
//     throw new ApiError(403, "Invalid or expired API key");
//   }

//   req.apiKeyUser = validKey.user;
//   req.apiKey = validKey;
//   next();
// });

export const verifyApiKey = asyncHandler(async (req, res, next) => {
  console.log("🔑 Reached verifyApiKey");
  const rawKey = req.get("x-api-key");
  console.log("🔐 Raw API Key:", rawKey);

  if (!rawKey) {
    throw new ApiError(401, "Must supply api_key");
  }

  const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");
  console.log("🔒 Hashed Key:", hashedKey);

  const validKey = await APIKey.findOne({
    key: hashedKey, // ✅ THIS LINE WAS THE PROBLEM
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!validKey) {
    throw new ApiError(403, "Invalid or expired API key");
  }
  req.apiKey = validKey;
  req.apiKeyUser = validKey.user;
  next();
});
