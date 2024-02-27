import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../constants";

cloudinary.config({
  cloud_name: ENV.cloudinary_cloud_name,
  api_key: ENV.cloudinary_api_key,
  api_secret: ENV.cloudinary_api_secret,
});

export const uploadToCloud = async (video_url: string) => {
  try {
    const cloudinaryUploadResponse = await cloudinary.uploader.upload(
      video_url,
      { resource_type: "auto" }
    );

    return cloudinaryUploadResponse.secure_url;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
