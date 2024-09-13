import cloudinary from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64 } from "../lib/helper.js";
import { ApiError } from "./ApiError.js";

export const uploadFileToCloudinary = async (file) => {
  try {
    const base64Data = await getBase64(file);
    const result = await cloudinary.uploader.upload(base64Data, {
      public_id: uuid(),
      resource_type: "image",
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.log("Error uploading image to Cloudinary:", error);
    return new ApiError("Error uploading image to Cloudinary", 500);
  }
};

export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    console.log("success", result);
    return result;
  } catch (error) {
    console.log("Error deleting image from Cloudinary:", error);
    return null;
  }
};

export const uploadMultipleFilesToCloudinary = async (files) => {
  try {
    // Map each file to an upload promise
    const uploadPromises = files.map(async (file) => {
      const base64Data = await getBase64(file); // Convert file to base64
      const result = await cloudinary.uploader.upload(base64Data, {
        public_id: uuid(),
        resource_type: "image",
      });
      return { url: result.secure_url, public_id: result.public_id }; // Return upload result
    });

    // Wait for all files to be uploaded
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults; // Return an array of all upload results
  } catch (error) {
    console.log("Error uploading images to Cloudinary:", error);
    return new ApiError("Error uploading images to Cloudinary", 500);
  }
};
