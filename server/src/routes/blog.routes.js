import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getOneBlog,
  reactToblog,
  updateBlog,
} from "../controllers/blog.controller.js";
import {
  optionalProtect,
  protect,
  restrictTo,
} from "../middlewares/authMiddleware.js";
import { createBlogValidator, validate } from "../lib/validator.js";
import { preprocessTags } from "../lib/helper.js";
import commentRouter from "./comment.routes.js";
import { multipleFiles, singleFile } from "../middlewares/upload.js";

const router = express.Router();

router.use("/:blogId/comments", commentRouter);

router
  .route("/")
  .post(
    protect,
    restrictTo("Admin", "Creator"),
    singleFile("coverImage"),
    multipleFiles,
    preprocessTags,
    createBlogValidator(),
    validate,
    createBlog
  )
  .get(getAllBlog);
router
  .route("/:id")
  .get(optionalProtect, getOneBlog)
  .patch(
    protect,
    restrictTo("Admin", "Creator"),
    singleFile("coverImage"),
    multipleFiles,
    updateBlog
  )
  .delete(protect, restrictTo("Admin", "Creator"), deleteBlog);

router.patch("/:blogId/react", protect, reactToblog);

export default router;
