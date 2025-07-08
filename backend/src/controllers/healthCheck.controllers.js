import { ApiResponse } from "../utils/api-response.js";

const healthCheck = (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  res.status(200).json(
    new ApiResponse(200, {
      message: "Server healthy and running",
      timestamp,
    }),
  );
};

export { healthCheck };
