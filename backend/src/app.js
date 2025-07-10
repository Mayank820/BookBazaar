import express from "express";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import apiKeyRoutes from "./routes/apiKey.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import "./config/cloudinary.config.js";


const app = express();
app.use(express.json());

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/apiKey", apiKeyRoutes)
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/review", reviewRoutes)

// Global error handler
// This particular code helps to catch all thrown ApiError or unexpected exceptions and formats them consistently.
app.use((err, req, res, next) => {
  return res.status(err.statuscode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.error || [],
  });
});

export default app;
