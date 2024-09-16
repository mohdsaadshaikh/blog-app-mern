import TryCatch from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  VerificationToken,
  PasswordResetToken,
} from "../models/token.model.js";
import { cookieOptions, generateTokenUrl } from "../lib/helper.js";
import { ApiError } from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import verifyToken from "../utils/verifyToken.js";
import { uploadFileToCloudinary } from "../utils/features.js";

const registerUser = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ApiError("User already exists, Try another email", 400));
  }

  const createUser = await User.create({ name, email, password });

  if (req.file) {
    try {
      const result = await uploadFileToCloudinary(req.file);

      createUser.set("avatar", {
        public_id: result.public_id,
        url: result.url,
      });
      await createUser.save();
    } catch (error) {
      await User.findByIdAndDelete(createUser._id);
      return next(new ApiError("Error uploading image to Cloudinary", 500));
    }
  }

  const emailToken = generateToken(
    createUser.email,
    "EmailVerificationToken",
    "1h"
  );

  await VerificationToken.deleteOne({ email: createUser.email });

  await VerificationToken.create({
    email: createUser.email,
    token: emailToken,
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  const genUrl = generateTokenUrl(
    req,
    `/auth/verify-email?token=${emailToken}`
  );

  try {
    await sendEmail(
      createUser.email,
      "Verify your Email address",
      "verification",
      {
        firstName: createUser.name.split(" ")[0],
        url: genUrl,
      }
    );
  } catch (error) {
    return next(new ApiError("Error sending verification email", 400));
  }

  res.status(201).json({
    status: "success",
    message:
      "Account successfully created. You have 15 days to verify your account, Otherwise your account will be deleted. ",
  });
});

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select("+password +active")
    .setOptions({ includeInactive: true });

  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  if (!user.isVerified) {
    const emailToken = generateToken(
      user.email,
      "EmailVerificationToken",
      "10m"
    );

    await VerificationToken.deleteOne({ email: user.email });

    await VerificationToken.create({
      email: user.email,
      token: emailToken,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const genUrl = generateTokenUrl(
      req,
      `/auth/verify-email?token=${emailToken}`
    );

    try {
      await sendEmail(user.email, "Verify your Email address", "verification", {
        firstName: user.name.split(" ")[0],
        url: genUrl,
      });
    } catch (error) {
      return next(new ApiError("Error sending verification email", 500));
    }

    return next(
      new ApiError(
        "Your account is not verified. We have sent you a new verification link. Please verify your email and try again. And you have 15 days to verify your account, Otherwise your account will be deleted.",
        401
      )
    );
  }

  let message = "Login successful";

  if (!user.active) {
    user.active = true;
    user.deActivatedAt = null;
    await user.save();
    message = "Your account has been reactivated.";
  }

  user.password = undefined;

  const authToken = generateToken(user._id, "AuthToken", "30d");

  res.status(201).cookie("Token", authToken, cookieOptions).json({
    status: "success",
    authToken,
    message,
  });
});

const logout = TryCatch(async (req, res, next) => {
  res.clearCookie("Token").json({
    status: "success",
    message: "Logged Out Succesfully",
  });
});

const verifyEmail = TryCatch(async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return next(new ApiError("No token provided", 401));
  }

  const storedToken = await verifyToken(token, "EmailVerificationToken");
  if (!storedToken) {
    return next(new ApiError("Token is invalid or has expired", 401));
  }

  const user = await User.findOne({ email: storedToken.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  user.isVerified = true;
  await user.save();

  await VerificationToken.deleteOne({ token });
  res
    .status(200)
    .send(
      `<h1>CONGRATULATION</h1><br><p>Your account has been created successfully.Now you can now close this tab.</p>`
    );
});

const forgotPassword = TryCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  await PasswordResetToken.deleteMany({ email: user.email });

  const resetPassToken = generateToken(user.email, "PasswordResetToken", "10m");

  await PasswordResetToken.create({
    email: user.email,
    token: resetPassToken,
    expires: new Date(Date.now() + 10 * 60 * 1000), // valid for 10 minutes,
  });

  const resetUrl = generateTokenUrl(
    req,
    `/auth/reset-password?token=${resetPassToken}`
  );

  try {
    await sendEmail(user.email, "Reset Password", "passwordReset", {
      firstName: user.name.split(" ")[0],
      // url: resetUrl,
      url: `http://localhost:5173/reset-password/${resetPassToken}`,
    });
  } catch (error) {
    return next(new ApiError("Error sending reset password email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset password email sent successfully",
  });
});

const resetPassword = TryCatch(async (req, res, next) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token) {
    return next(new ApiError("No token provided", 401));
  }

  const storedToken = await verifyToken(token, "PasswordResetToken");
  if (!storedToken) {
    return next(new ApiError("Token is invalid or has expired", 401));
  }

  const user = await User.findOne({ email: storedToken.email }).select(
    "+password"
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) {
    return next(
      new ApiError("New password cannot be the same as old password", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword, passwordChangedAt: Date.now() },
    { new: true, runValidators: true }
  );

  await PasswordResetToken.deleteOne({ token });

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

const updatePassword = TryCatch(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ApiError("Current password is incorrect", 400));
  }

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    return next(
      new ApiError("New password cannot be the same as old password", 400)
    );
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully. Please log in again.",
  });
});

export {
  registerUser,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
};
