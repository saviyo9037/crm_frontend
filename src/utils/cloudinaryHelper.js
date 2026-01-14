import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration is missing");
  }
console.log("Cloud name:", CLOUDINARY_CLOUD_NAME);
console.log("Upload preset:", CLOUDINARY_UPLOAD_PRESET);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset",CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.secure_url) {
      throw new Error("Cloudinary did not return URL");
    }

    return response.data.secure_url;

  } catch (error) {
    console.error("Cloudinary upload error:", error?.response?.data || error.message);
    throw new Error("Failed to upload image");
  }
};
