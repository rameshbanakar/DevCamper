const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });
  console.log(`connected successfully ${conn.connection.host}`.green.underline.bold);
};
module.exports = connectDB;
