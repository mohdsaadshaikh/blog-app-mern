import { ApiError } from "../utils/ApiError.js";

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue;
  const formattedValue = Object.keys(value)
    .map((key) => `${key}: '${value[key]}'`)
    .join(", ");

  return new ApiError(
    `Duplicate field value ${formattedValue}, Please use another value!`,
    400
  );
};

const handleCastErrorDB = (err) => {
  return new ApiError(`Invalid ${err.path}: ${err.value}.`, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new ApiError(`Invalid input data. ${errors.join(". ")}`, 400);
};

const handleJWTError = () =>
  new ApiError("Invalid Tokin. Please Login again", 401);

const sendErrorDev = (err, req, res) => {
  // console.log(err);
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      // Send response for handled errors
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // For unhandled errors
      // console.error("ERROR 💥", err);

      return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

const handleError = (err) => {
  let handledError = null;

  if (err.code === 11000) handledError = handleDuplicateFieldsDB(err);
  if (err.name === "CastError") handledError = handleCastErrorDB(err);
  if (err.name === "ValidationError")
    handledError = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") handledError = handleJWTError();

  return handledError;
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    const handledError = handleError(err);

    if (handledError) {
      sendErrorProd(handledError, req, res);
    } else {
      sendErrorProd(err, req, res);
    }
  }
};

export default globalErrorHandler;
