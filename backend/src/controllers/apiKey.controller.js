import { APIKey } from "../models/apiKeys.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

export const generateApiKey = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Invalidate old keys
  await APIKey.updateMany({ user: userId }, { isActive: false });

  // Generate and store new key
  const rawKey = APIKey.generateRawKey(); // generate the raw key
  const hashedKey = APIKey.hashKey(rawKey); // storing the hashed key in database

  await APIKey.create({
    key: hashedKey,
    user: userId,
    isActive: true,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { apiKey: rawKey },
        "API key generated successfully",
      ),
    );
});
