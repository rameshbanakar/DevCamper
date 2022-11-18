const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const cors=require("cors")
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit=require("express-rate-limit");
const hpp=require('hpp')
const fileupload = require("express-fileupload");
const cookieParser=require("cookie-parser")
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
connectDB();
// const logger=require("./middleware/logger")

const morgan = require("morgan");
const bootcamp = require("./router/bootcamp");
const courses = require("./router/courses");
const auth=require("./router/auth")
const user = require("./router/user");
const review=require("./router/reviews")

//load enviormental variable

const app = express();
//body parser
app.use(express.json());
//app.use(logger)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//file upload
app.use(fileupload());

app.use(mongoSanitize());
app.use(helmet());
//cross site scriptinng
app.use(xss())


const limiter=rateLimit({
  windowMs:10*60*1000,
  max:100
})

app.use(limiter)
//prevent http params pollution
app.use(hpp())
app.use(cors())
//set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser())
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth",auth)
app.use("/api/v1/users", user);
app.use("/api/v1/review", review);

app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode and port is ${process.env.PORT}`
      .yellow.bold
  );
});

//unhandled promises
process.on("unhandledRejection", (err, promise) => {
  console.log(`error:${err.message}`.red);
  server.close(() => process.exit(1));
});
