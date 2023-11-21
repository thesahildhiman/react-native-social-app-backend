require("dotenv").config();
require("./db/db");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

const app = express();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/post/comment", commentRouter);

app.listen(8000, () => {
  console.log("listen at 8000");
});
