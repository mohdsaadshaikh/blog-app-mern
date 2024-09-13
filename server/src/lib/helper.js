import sharp from "sharp";

export const compressImage = async (file) => {
  return sharp(file.buffer).resize(512, 512, { fit: "inside" }).toBuffer();
};

export const getBase64 = async (file) => {
  const compressedBuffer = await compressImage(file);
  return `data:${file.mimetype};base64,${compressedBuffer.toString("base64")}`;
};

export const generateTokenUrl = (req, url) => {
  return `${req.protocol}://${req.get("host")}/api/v1${url}`;
};

export const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  // httpOnly: true,
};

// export const getBase64 = (file) =>
//   `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const maxFileSize = "5 * 1024 * 1024";

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export const generateSlug = (name) =>
  name
    .toLowerCase() // Convert to lower case
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

export const preprocessTags = (req, res, next) => {
  if (typeof req.body.tags === "string") {
    req.body.tags = [req.body.tags];
  }
  next();
};
