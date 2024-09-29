export const corsOptions = {
  origin: "*", // This will allow all origins
  credentials: true,
};

export const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "Too many requests form this IP, please try again in an hour",
};
