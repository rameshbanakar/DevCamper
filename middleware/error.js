const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //log to console dev
  console.log(err);
  //bootcamp bad request
  if (err.name === "CastError") {
    const message = `bootcamp not found with the id ${err.value}`;
    err = new errorResponse(message, 404);
  }
  //duplicated data error
  if (err.code === 11000) {
    const message = "You have enterd the duplicate value";
    err = new errorResponse(message);
  }
  //mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    err = new errorResponse(message,400);
  }
  console.log(err.name);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "server error",
  });
};
module.exports = errorHandler;
