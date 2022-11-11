const express = require("express");
const dotenv = require("dotenv");
//load enviormental variable
dotenv.config({ path: "./config/config.env" });
const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode and port is ${process.env.PORT}`);
});
