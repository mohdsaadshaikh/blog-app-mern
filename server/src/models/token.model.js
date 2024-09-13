import { Schema, model } from "mongoose";

const verificationTokenSchema = new Schema({
  email: { type: String, unique: true },
  token: { type: String, unique: true },
  expires: Date,
});

export const VerificationToken = model(
  "VerificationToken",
  verificationTokenSchema
);

const passwordResetTokenSchema = new Schema({
  email: { type: String, unique: true },
  token: { type: String, unique: true },
  expires: Date,
});

export const PasswordResetToken = model(
  "PasswordResetToken",
  passwordResetTokenSchema
);
