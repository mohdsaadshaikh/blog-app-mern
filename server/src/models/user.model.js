import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      minlength: [3, "name must be at least 3 characters long."],
      maxlength: [50, "only 50 characters are allowed"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: [8, "password must be at least 8 characters long."],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [300, "only 300 characters are allowed"],
      default: "Hey there I'm using blog",
    },
    role: {
      type: String,
      enum: ["User", "Creator", "Editor", "Admin"],
      default: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    deActivatedAt: {
      type: Date,
      default: null,
    },
    // for Creator
    creatorInfo: {
      age: Number,
      phone: String,
      address: String,
      social: {
        twitter: String,
        github: String,
        linkedin: String,
        instagram: String,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt to seconds since epoch
    const changedTimeStamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    // Compare JWT timestamp with the password change timestamp
    return JWTTimeStamp < changedTimeStamp;
  }
  // Return false if passwordChangedAt doesn't exist or isn't valid
  return false;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
