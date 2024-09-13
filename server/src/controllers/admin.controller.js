import { RoleRequest } from "../models/roleRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import TryCatch from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.model.js";

const handleRole = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const roleRequest = await RoleRequest.findById(requestId).populate("userId");
  if (!roleRequest) {
    return next(new ApiError("No role request found with this id", 404));
  }

  roleRequest.status = status;

  if (status === "approved") {
    roleRequest.userId.role = "Creator";
    await roleRequest.userId.save();
  } else if (status === "rejected") {
    // Unset the creatorInfo field from the user schema
    await User.updateOne(
      { _id: roleRequest.userId._id },
      {
        $unset: {
          age: "",
          phone: "",
          address: "",
          twitter: "",
          github: "",
          linkedin: "",
          instagram: "",
        },
      }
    );
  }

  await roleRequest.save();

  await roleRequest.deleteOne({
    email: roleRequest.email,
  });

  try {
    const subject =
      status === "approved"
        ? "Role Request Approved 😊"
        : "Role Request Rejected 😓";
    const templateName =
      status === "approved" ? "approvedTemplate" : "rejectedTemplate";
    await sendEmail(roleRequest.userId.email, subject, templateName, {
      name: roleRequest.userId.name,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError("Error sending role request status email", 500));
  }

  res.status(200).json({
    status: "success",
    message:
      status === "approved"
        ? "Request approved and user promoted to Creator"
        : "Request rejected",
  });
});

export { handleRole };
