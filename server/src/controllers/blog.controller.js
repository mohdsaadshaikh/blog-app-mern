import TryCatch from "express-async-handler";
import { BLOG_TAGS, REACTIONS } from "../constants/blogConstants.js";
import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
  uploadMultipleFilesToCloudinary,
} from "../utils/features.js";

const getAllBlog = TryCatch(async (req, res, next) => {
  const { tags, title, sortBy, page, limit } = req.query;

  let filterQuery = {};

  if (tags) {
    const tagArray = tags.split(",");
    const isValidTag = tagArray.every((tag) => BLOG_TAGS.includes(tag));
    if (!isValidTag) {
      return next(new ApiError("Invalid tags"));
    }

    filterQuery.tags = { $in: tagArray };
  }

  if (title) {
    filterQuery.title = { $regex: new RegExp(title, "i") };
  }

  let sortQuery = {};
  switch (sortBy) {
    case "mostViewed":
      sortQuery = { views: -1 };
      break;
    case "mostLiked":
      sortQuery = { likes: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
      break;
  }

  const pagination = parseInt(page) || 1;
  const limitation = parseInt(limit) || 10;

  const startIndex = (pagination - 1) * limitation;
  //abhi set krunga isey
  let blog;
  if (sortBy === "mostLiked") {
    blog = await Blog.aggregate([
      { $match: filterQuery },
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1 } },
      { $skip: startIndex },
      { $limit: limitation },
    ]);
  } else {
    blog = await Blog.find(filterQuery)
      .sort(sortQuery)
      .skip(startIndex)
      .limit(limitation);
  }

  if (blog.length === 0) {
    return next(new ApiError("No blog found", 404));
  }

  res.status(200).json({
    status: "success",
    results: blog.length,
    data: blog,
  });
});

const getOneBlog = TryCatch(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate({
    path: "comments",
    select: "comment user likes -blog",
  });

  if (!blog) {
    return next(new ApiError("No Blog found with this id", 404));
  }

  let userIdentifier;
  if (req.user) {
    userIdentifier = req.user._id.toString();
  } else {
    userIdentifier = req.ip;
  }

  if (!blog.viewedBy.includes(userIdentifier)) {
    blog.views++;
    blog.viewedBy.push(userIdentifier);
    await blog.save();
  }

  res.status(200).json({
    status: "success",
    likes: blog.likes.length,
    dislikes: blog.dislikes.length,
    views: blog.views,
    data: blog,
  });
});

const createBlog = TryCatch(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user._id;
  const blog = await Blog.create(req.body);

  if (req.file) {
    try {
      const result = await uploadFileToCloudinary(req.file);
      blog.coverImage = {
        public_id: result.public_id,
        url: result.url,
      };
      await blog.save();
    } catch (error) {
      await Blog.findByIdAndDelete(blog._id);
      return next(
        new ApiError("Error uploading cover image to Cloudinary", 500)
      );
    }
  }

  if (req.files && req.files.length > 0) {
    const images = [];
    for (const file of req.files) {
      try {
        const result = await uploadMultipleFilesToCloudinary(file);
        images.push({
          public_id: result.public_id,
          url: result.url,
        });
        console.log(`Successfully uploaded ${file.originalname}`);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }

    blog.images = images;
    await blog.save();
  }

  console.log(req.body);
  console.log(req.files);

  res.status(201).json({
    status: "success",
    message: "created successfully",
    data: blog,
  });
});

const updateBlog = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const blog = await Blog.findById(req.params.id);

  if (req.file) {
    try {
      if (blog.coverImage && blog.coverImage.public_id) {
        await deleteFileFromCloudinary(blog.coverImage.public_id);
      }
      const result = await uploadFileToCloudinary(req.file);
      req.body.coverImage = {
        public_id: result.public_id,
        url: result.url,
      };
    } catch (error) {
      console.log(error);
      return next(new ApiError("Error uploading image to Cloudinary", 500));
    }
  }

  if (req.files && req.files.length > 0) {
    const images = [];
    for (const file of req.files) {
      try {
        const result = await uploadMultipleFilesToCloudinary(file);
        images.push({
          public_id: result.public_id,
          url: result.url,
        });
        console.log(`Successfully uploaded ${file.originalname}`);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }
  }

  const blogToUpdate = await Blog.findOneAndUpdate(
    { _id: id, author: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!blogToUpdate) {
    return next(
      new ApiError(
        "No comment found with this id or you are not authorized to update this comment",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "updated successfully",
    data: blogToUpdate,
  });
});

const deleteBlog = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const blog = await Blog.findOne({ _id: id, author: userId });

  if (!blog) {
    return next(
      new ApiError(
        "No blog found with this id or you are not authorized to delete this blog",
        404
      )
    );
  }

  await Blog.findByIdAndDelete(id);

  await Comment.deleteMany({ blog: id });

  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});

const reactToblog = TryCatch(async (req, res, next) => {
  const { blogId } = req.params;
  const { reaction } = req.body;
  const userId = req.user._id;

  if (!REACTIONS.includes(reaction)) {
    return next(new ApiError("Invalid reactions"));
  }

  let react;
  if (reaction === "like") {
    react = { $addToSet: { likes: userId }, $pull: { dislikes: userId } };
  } else if (reaction === "dislike") {
    react = { $addToSet: { dislikes: userId }, $pull: { likes: userId } };
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, react, {
    new: true,
  });

  if (!updatedBlog) {
    return next(new ApiError("No blog found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Reacted successfully",
  });
});

export {
  createBlog,
  deleteBlog,
  getAllBlog,
  getOneBlog,
  reactToblog,
  updateBlog,
};
