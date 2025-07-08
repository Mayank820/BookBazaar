import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
  { timestamps: true },
);

// Static method to generate API key
apiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString("hex"); // 64-char raw key
};

apiKeySchema.statics.hashKey = function (key) {
  return crypto.createHash("sha256").update(key).digest("hex");
};

apiKeySchema.statics.verifyKey = async function (plainKey) {
  const hashed = this.hashKey(plainKey);
  return await this.findOne({ key: hashed, isActive: true });
};

export const APIKey = mongoose.model("APIKey", apiKeySchema);
