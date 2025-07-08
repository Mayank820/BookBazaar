import { APIKey } from "../models/apiKeys.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const apiKeyAuthMiddleware = asyncHandler(async (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key) throw new ApiError(401, "API key is missing");

  const apiKey = await APIKey.verifyKey(key);
  if (!apiKey || !apiKey.isActive || apiKey.expiresAt < Date.now()) {
    throw new ApiError(401, "Invalid or expired API key");
  }

  req.apiKey = apiKey;
  next();
});
