import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  console.log("🛡️ Reached verifyAccessToken");
  const authHeader = req.headers.authorization;

  // Check for token in header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid token user");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized or expired token");
  }
});

export const isAdmin = (req, res, next) => {
  console.log("👑 Reached isAdmin");
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }
  next();
};

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: Token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user; // ✅ Attach user to request for future use
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});
