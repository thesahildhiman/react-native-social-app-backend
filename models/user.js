const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      max: 20,
      required: true,
    },
    email: {
      type: String,
      max: 20,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      max: 10,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      max: 5,
      required: true,
    },
    dob: {
      type: String,
      max: 20,
    },
    address: {
      type: String,
      max: 50,
    },
    profilePic: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
