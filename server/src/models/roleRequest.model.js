import { Schema, model } from "mongoose";

const roleRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: String,
    roleRequested: {
      type: String,
      default: "Creator",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

export const RoleRequest = model("RoleRequest", roleRequestSchema);
