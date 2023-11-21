const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: false, message: "user not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, "your_secret_key", {
        expiresIn: "1h",
      });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, mobile, gender } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      let field = existingUser.email === email ? "email" : "mobile";
      console.log("---field---", field);
      return res.status(400).json({
        status: false,
        message: `User with this ${field} already exists.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      gender,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "internal server error" });
  }
});

module.exports = router;
