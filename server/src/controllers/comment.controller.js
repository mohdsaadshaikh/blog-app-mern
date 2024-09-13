import TryCatch from "express-async-handler";
import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

const setBlogAndUserId = (req, res, next) => {
  if (!req.body.Blog) req.body.blog = req.params.blogId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const getAllComments = TryCatch(async (req, res, next) => {
  const { sortBy } = req.query;

  let sortQuery = {};
  if (sortBy === "newest") {
    sortQuery = { createdAt: -1 };
  } else {
    sortQuery = { likes: -1 };
  }

  const comments = await Comment.find().sort(sortQuery);
  res.status(200).json({
    status: "success",
    message: "Comments retrived successfully",
    comments,
  });
});

const getOneComment = TryCatch(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Comment retrived successfully",
    comment,
  });
});

const createComment = TryCatch(async (req, res, next) => {
  const comment = await Comment.create(req.body);

  res.status(201).json({
    status: "success",
    message: "comment created successfully",
    data: comment,
  });
});

const updateComment = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { blogId, commentId } = req.params;
  const { comment } = req.body;

  const commentToUpdate = await Comment.findOneAndUpdate(
    { _id: commentId, blog: blogId, user: userId },
    { comment },
    { new: true }
  );

  if (!commentToUpdate) {
    return next(
      new ApiError(
        "No comment found with this id or you are not authorized to update this comment",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Comment updated successfully",
    data: commentToUpdate,
  });
});

const deleteComment = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { blogId, commentId } = req.params;

  const commentToDelete = await Comment.findOneAndDelete({
    _id: commentId,
    blog: blogId,
    user: userId,
  });

  if (!commentToDelete) {
    return next(
      new ApiError(
        "No comment found with this id or you are not authorized to delete this comment",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});

const likeOnComment = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ApiError("No comment found with this id", 404));
  }

  let likeDislike = {};

  if (comment.likes.includes(userId)) {
    likeDislike = {
      $pull: { likes: userId },
      $inc: { likesCount: -1 },
    };
  } else {
    likeDislike = {
      $addToSet: { likes: userId },
      $inc: { likesCount: 1 },
    };
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    likeDislike,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: comment.likes.includes(userId)
      ? "Comment unliked successfully"
      : "Comment liked successfully",
    likesCount: updatedComment,
  });
});

const replyToComment = TryCatch(async (req, res, next) => {
  const userId = req.user._id;
  const { commentId } = req.params;
  const { reply } = req.body;

  const commentToUpdate = await Comment.findByIdAndUpdate(
    commentId,
    {
      $push: { replies: { user: userId, reply } },
    },
    { new: true }
  );

  if (!commentToUpdate) {
    return next(new ApiError("No comment found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Reply added successfully",
    data: commentToUpdate,
  });
});

export {
  createComment,
  deleteComment,
  getAllComments,
  getOneComment,
  likeOnComment,
  replyToComment,
  setBlogAndUserId,
  updateComment,
};

// const createComment = TryCatch(async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const comment = await Comment.create([req.body], { session });

//     await Blog.findByIdAndUpdate(
//       req.params.blogId,
//       {
//         $push: { comments: comment },
//       },
//       { session }
//     );

//     await session.commitTransaction();
//     res.status(201).json({
//       status: "success",
//       message: "comment created successfully",
//       data: comment,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     throw new ApiError("Error creating comment. Please try again later.", 500);
//   } finally {
//     session.endSession();
//   }
// });
