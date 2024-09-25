import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minLength: [1, "Comment must be at least 1 character long."],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reply: {
          type: String,
          required: true,
          minLength: [1, "Reply must be at least 1 character long."],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ likes: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar",
  })
    .populate({
      path: "replies.user",
      select: "name avatar",
    })
    .populate({
      path: "replies",
      select: "reply createdAt",
    });
  next();
});

const Comment = model("Comment", commentSchema);

export default Comment;
