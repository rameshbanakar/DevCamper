const express = require("express");
const dotenv = require("dotenv");
// const logger=require("./middleware/logger")
const morgan=require("morgan")
const bootcamp=require("./router/bootcamp")
//load enviormental variable
dotenv.config({ path: "./config/config.env" });
const app = express();

//app.use(logger)
if(process.env.NODE_ENV==="development"){
  app.use(morgan("dev"))
}
app.use("/api/v1/bootcamps", bootcamp);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode and port is ${process.env.PORT}`
  );
});
