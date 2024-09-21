import { Schema, model } from "mongoose";
import { BLOG_STATUS, BLOG_TAGS } from "../constants/blogConstants.js";
import { generateSlug } from "../lib/helper.js";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Plz enter title to create blog"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Plz create some content for your blog"],
    },
    slug: String,
    coverImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    views: { type: Number, default: 0 },
    viewedBy: [String],
    // publishedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // status: {
    //   type: String,
    //   enum: BLOG_STATUS,
    //   default: "draft",
    // },
    tags: {
      type: [String],
      // required: [true, "Add tags to your blog"],
      enum: BLOG_TAGS,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogSchema.index({ likes: 1 });
blogSchema.index({ dislikes: 1 });
blogSchema.index({ views: 1 });
blogSchema.index({ viewedBy: 1 });

blogSchema.pre("save", function (next) {
  if (this.isModified("slug") || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  next();
});

blogSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "blog",
  localField: "_id",
});

export const Blog = model("Blog", blogSchema);
