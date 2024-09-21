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
    // console.log("Error uploading image to Cloudinary:", error);
    return new ApiError("Error uploading image to Cloudinary", 500);
  }
};

export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    // console.log("success", result);
    return result;
  } catch (error) {
    // console.log("Error deleting image from Cloudinary:", error);
    return null;
  }
};

// export const uploadMultipleFilesToCloudinary = async (files) => {
//   try {
//     const uploadPromises = files.map(async (file) => {
//       const base64Data = getBase64(file);
//       const result = cloudinary.uploader.upload(base64Data, {
//         public_id: uuid(),
//         resource_type: "image",
//       });
//       return { url: result.secure_url, public_id: result.public_id };
//     });

//     const uploadResults = await Promise.all(uploadPromises);
//     console.log(uploadResults);
//     return uploadResults;
//   } catch (error) {
//     return new ApiError("Error uploading images to Cloudinary", 500);
//   }
// };

export const uploadMultipleFilesToCloudinary = async (file) => {
  try {
    const base64Data = await getBase64(file); // Corrected await
    const result = await cloudinary.uploader.upload(base64Data, {
      public_id: uuid(),
      resource_type: "image",
    });

    // Return the result from Cloudinary if successful
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error); // Debugging error
    throw new ApiError("Error uploading images to Cloudinary", 500);
  }
};
