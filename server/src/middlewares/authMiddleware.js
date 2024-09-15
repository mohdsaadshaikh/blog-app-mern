import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import TryCatch from "express-async-handler";

const protect = TryCatch(async (req, res, next) => {
  let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // } else if (req.cookies.token) {
  // }
  token = req.cookies.Token;

  if (!token) {
    return next(
      new ApiError("You are not logged in. Please log in to get access.", 401)
    );
  }

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(
      new ApiError("Token is invalid or has expired. Please log in again.", 401)
    );
  }

  const currentUser = await User.findById(decoded.field);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError("Password has been changed. Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

// optional brotect for getting view from user if its logged in
const optionalProtect = TryCatch(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      req.user = await User.findById(decoded.field).select("-password");

      if (!req.user) {
        return next(); // Agar user nahi milta toh next middleware call karo
      }
    } catch (error) {
      return next(); // Agar token verify nahi hota toh next middleware call karo
    }
  }

  next(); // Agar token nahi hai ya user null hai, toh next middleware call karo
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export { protect, optionalProtect, restrictTo };
