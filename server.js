const express = require("express");
const dotenv = require("dotenv");
const colors=require("colors")
const errorHandler=require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
connectDB();
// const logger=require("./middleware/logger")

const morgan = require("morgan");
const bootcamp = require("./router/bootcamp");
const courses = require("./router/courses");


//load enviormental variable

const app = express();
//body parser
app.use(express.json())
//app.use(logger)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);

app.use(errorHandler)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode and port is ${process.env.PORT}`.yellow.bold
  );
});

//unhandled promises
process.on("unhandledRejection", (err, promise) => {
  console.log(`error:${err.message}`.red);
  server.close(() => process.exit(1));
});
