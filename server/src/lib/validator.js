import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsgs = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new ApiError(errMsgs, 400));
  }
  next();
};

const validateSocialLink = (url, platform) => {
  if (!url) return true;

  const platforms = {
    twitter: (url) => validator.isURL(url) && url.includes("twitter.com"),
    linkedin: (url) => validator.isURL(url) && url.includes("linkedin.com/in"),
    github: (url) => validator.isURL(url) && url.includes("github.com"),
    instagram: (url) => validator.isURL(url) && url.includes("instagram.com"),
  };

  return platforms[platform](url);
};

export const registerValidator = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const loginValidator = () => [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidator = () => [
  body("email").notEmpty().withMessage("Email is required"),
];

export const resetPasswordValidator = () => [
  body("password").notEmpty().withMessage("Password is required"),
];

export const updatePasswordValidator = () => [
  body("newPassword").notEmpty().withMessage("New password is required"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
];

export const requestCreatorRoleValidator = () => [
  body("reason")
    .isLength({ min: 20 })
    .withMessage("Reason must be at least 20 characters long"),

  body("age")
    .isInt({ min: 14 })
    .withMessage("You must be at least 14 years old to apply for a role"),

  body("phone")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),

  body("twitter")
    .optional()
    .custom((url) => validateSocialLink(url, "twitter"))
    .withMessage("Invalid Twitter link"),

  body("github")
    .optional()
    .custom((url) => validateSocialLink(url, "github"))
    .withMessage("Invalid GitHub link"),

  body("linkedin")
    .optional()
    .custom((url) => validateSocialLink(url, "linkedin"))
    .withMessage("Invalid LinkedIn link"),

  body("instagram")
    .optional()
    .custom((url) => validateSocialLink(url, "instagram"))
    .withMessage("Invalid Instagram link"),

  body("address").notEmpty().withMessage("Address is required"),
];

export const createBlogValidator = () => [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title should not exceed 100 characters"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content should be at least 20 characters long"),

  body("tags")
    .isArray({ min: 1 })
    .withMessage("At least one tag is required")
    .custom((tags) => {
      if (!tags.every((tag) => typeof tag === "string")) {
        throw new ApiError("Tags must be an array of strings");
      }
      return true;
    }),
];
