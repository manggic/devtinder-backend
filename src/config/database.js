const mongoose = require("mongoose");

let mongoConnectionString = process.env.MONGO_URL

const connectToDB = async () => {
  await mongoose.connect(mongoConnectionString);
};

module.exports = connectToDB