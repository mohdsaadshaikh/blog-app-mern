import TryCatch from "express-async-handler";
import User from "../models/user.model.js";
import { RoleRequest } from "../models/roleRequest.model.js";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../utils/features.js";
import { ApiError } from "../utils/ApiError.js";
import { filterObj } from "../lib/helper.js";
import sendEmail from "../utils/sendEmail.js";
import { generateTokenUrl } from "../lib/helper.js";

const updateMe = TryCatch(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new ApiError(
        "This route is not for updating password. Use /updateMyPassword instead.",
        400
      )
    );
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (user.role === "Creator" || user.role === "Admin") {
    const roleRequest = await RoleRequest.findOne({ userId: req.user._id });
    if (roleRequest && roleRequest.status === "pending") {
      return next(
        new ApiError(
          "You cannot update your profile while a role request is pending.",
          400
        )
      );
    }
  }

  const allowedFields = ["name", "bio", "avatar"];

  if (user.role === "Creator" || user.role === "Admin") {
    allowedFields.push(
      "age",
      "phone",
      "address",
      "twitter",
      "github",
      "linkedin",
      "instagram"
    );
  }

  const fieldsInRequest = Object.keys(req.body);

  // Check if any disallowed fields are present
  const disallowedFields = fieldsInRequest.filter(
    (field) => !allowedFields.includes(field)
  );

  if (disallowedFields.length > 0) {
    return next(
      new ApiError(
        `You cannot update the following fields: ${disallowedFields.join(
          ", "
        )}`,
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, ...allowedFields);

  const nestedFieldsMap = {
    twitter: "creatorInfo.social.twitter",
    github: "creatorInfo.social.github",
    linkedin: "creatorInfo.social.linkedin",
    instagram: "creatorInfo.social.instagram",
    age: "creatorInfo.age",
    phone: "creatorInfo.phone",
    address: "creatorInfo.address",
  };

  // Dynamically update nested fields
  if (user.role === "Creator" || user.role === "Admin") {
    Object.keys(nestedFieldsMap).forEach((key) => {
      if (req.body[key]) {
        filteredBody[nestedFieldsMap[key]] = req.body[key];
      }
    });
  }

  // Check if there's nothing to update
  if (Object.keys(filteredBody).length === 0 && !req.file) {
    return res.status(404).json({
      status: "fail",
      message: "No updates provided",
    });
  }

  if (req.file) {
    try {
      if (req.user.avatar && req.user.avatar.public_id) {
        await deleteFileFromCloudinary(req.user.avatar.public_id);
      }
      const result = await uploadFileToCloudinary(req.file);
      filteredBody.avatar = {
        public_id: result.public_id,
        url: result.url,
      };
    } catch (error) {
      return next(new ApiError("Error uploading image to Cloudinary", 500));
    }
  }

  await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User profile updated successfully",
  });
});

const getMyProfile = TryCatch(async (req, res, next) => {
  let user = await User.findById(req.user._id).select(
    "-password -passwordChangedAt -deActivatedAt -updatedAt -__v"
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

const deleteMe = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+active");

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  user.active = false;
  user.deActivatedAt = new Date();
  await user.save();

  res.status(200).json({
    status: "success",
    message:
      "Your account has been deactivated. Your account will be deleted after 30 days if you haven't logged in.",
  });
});

const requestCreatorRole = TryCatch(async (req, res, next) => {
  const { reason, age, phone, address, twitter, github, linkedin, instagram } =
    req.body;
  const userId = req.user._id;

  const existingRequest = await RoleRequest.findOne({
    userId,
    status: "pending",
  });

  if (existingRequest) {
    return next(new ApiError("You already have a pending role request", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const admin = await User.findOne({ role: "Admin" });
  if (!admin) {
    return next(new ApiError("No admin found", 404));
  }

  const roleRequest = new RoleRequest({ userId, email: user.email, reason });
  await roleRequest.save();

  user.creatorInfo = {
    age,
    phone,
    address,
    social: {
      twitter,
      github,
      linkedin,
      instagram,
    },
  };
  await user.save();

  const genUrl = generateTokenUrl(
    req,
    `/admin/handle-user-role/${roleRequest._id}`
  );

  try {
    await sendEmail(
      admin.email,
      `${user.name} want to become a Creator`,
      "roleRequest",
      {
        name: user.name,
        url: genUrl,
        reason,
        age,
        phone,
        address,
        twitter,
        github,
        linkedin,
        instagram,
      }
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError("Error sending role request email", 500));
  }

  res.status(201).json({
    status: "success",
    message: "Role request sent successfully! Admin has been notified.",
  });
});

export { updateMe, getMyProfile, deleteMe, requestCreatorRole };
