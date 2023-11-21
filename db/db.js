const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("mongodb connection error", err);
});

db.on("open", () => {
  console.log("connected to mongodb");
});

module.exports = mongoose;
