import "dotenv/config";
import dbConnection from "./src/config/dbConnection.js";
import app from "./app.js";

import "./src/utils/cronJobs.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  dbConnection();
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port http://localhost:${process.env.PORT}...`
  );
});
