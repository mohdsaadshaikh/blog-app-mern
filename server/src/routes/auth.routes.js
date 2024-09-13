import express from "express";
import {
  login,
  registerUser,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controller.js";
import {
  validate,
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from "../lib/validator.js";
import { singleFile } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/register")
  .post(singleFile("avatar"), registerValidator(), validate, registerUser);

router.post("/login", loginValidator(), validate, login);

router.get("/logout", logout);
router.get("/verify-email", verifyEmail);

router.post(
  "/forgot-password",
  forgotPasswordValidator(),
  validate,
  forgotPassword
);
router.patch(
  "/reset-password",
  resetPasswordValidator(),
  validate,
  resetPassword
);

router.patch(
  "/updatepassword",
  protect,
  updatePasswordValidator(),
  validate,
  updatePassword
);

export default router;
