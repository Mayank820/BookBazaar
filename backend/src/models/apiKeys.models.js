import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String, // hashed
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
  { timestamps: true },
);

// Static methods
apiKeySchema.statics.generateRawKey = function () {
  return crypto.randomBytes(32).toString("hex"); // 64 char
};

apiKeySchema.statics.hashKey = function (rawKey) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};

export const APIKey = mongoose.model("APIKey", apiKeySchema);
