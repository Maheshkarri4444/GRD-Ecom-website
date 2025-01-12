const mongoose = require("mongoose");

async function database() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to the database");
  } catch (err) {
    console.log(err.message);
  }
}
module.exports = database;
