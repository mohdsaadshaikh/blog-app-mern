import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
// import hpp from 'hpp';
import compression from "compression";

import globalErrorHandler from "./src/middlewares/erorrHandler.js";
import authRouter from "./src/routes/auth.routes.js";
import blogRouter from "./src/routes/blog.routes.js";
import userRouter from "./src/routes/user.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import { corsOptions, limiter } from "./src/lib/options.js";
import { ApiError } from "./src/utils/ApiError.js";

const app = express();

app.set("trust proxy", true);

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
// app.use("/api", rateLimit(limiter));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       // add queries you want to whitelist
//     ],
//   })
// );

app.use(compression());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Hello! from the server your api successfully running");
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
