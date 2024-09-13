import multer from "multer";
import { maxFileSize } from "../lib/helper.js";
import handleMulterError from "../utils/MulterErrorHandler.js";

const multerUpload = multer({
  // storage, // Use disk storage for temporary files
  limits: {
    fieldSize: maxFileSize,
  },
});

export const singleFile = (fieldName) => (req, res, next) => {
  multerUpload.single(fieldName)(req, res, (err) => {
    if (err) return handleMulterError(err, next, 1);
    next();
  });
};

export const multipleFiles = () => (req, res, next) => {
  multerUpload.array("images", 5)(req, res, (err) => {
    // if (err) return handleMulterError(err, next, 5);
    handleMulterError(err, next, 5);
    next();
  });
};

// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// // Create __dirname variable since it's not available in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define storage strategy
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const tempDir = path.join(__dirname, "../tmp");
//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir);
//     }
//     cb(null, tempDir); // save files in tmp folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
