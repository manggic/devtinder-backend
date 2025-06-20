const mongoose = require("mongoose");

let mongoConnectionString =
  "mongodb+srv://manya:manya_password@namastenode.e87mbhg.mongodb.net/devtinder";

const connectToDB = async () => {
  await mongoose.connect(mongoConnectionString);
};

module.exports = connectToDB