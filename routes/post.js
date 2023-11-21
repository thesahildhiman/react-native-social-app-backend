const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const upload = require("../middlewares/upload");
const handleUpload = require("../middlewares/clodinary");

router.post("/create", upload.single("imageUrl"), async (req, res) => {
  try {
    const { caption, userId } = req.body;

    const newPost = new Post({
      caption,
      author: userId,
    });

    if (req.file) {
      const dateFormatted = new Date().toISOString().replace(/:/g, "-");
      const fileName = `myfile_${dateFormatted}`;
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI, fileName);

      newPost.imageUrl = cldRes;
    }

    const savedPost = await newPost.save();
    return res
      .status(200)
      .json({ status: true, message: "post created successfully", savedPost });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "post updated successfully",
      updatedPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(400).json({ status: false, message: "post not found" });
    }
    const deletedPost = await Post.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({ status: true, deletedPost });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.get("/getpost/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(400).json({ status: false, message: "post not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(400).json({ status: true, message: "posts not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "posts retrieved successfully", posts });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

// get posts of specific user
router.get("/get/:id", async (req, res) => {
  try {
    // const authorExists = await User.findOne({ _id: req.params.id });
    // if (!authorExists) {
    //   return res.status(404).json({
    //     status: false,
    //     message: "Author not found",
    //   });
    // }

    const posts = await Post.find({ author: authorId });
    res.status(200).json({ status: true, posts });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const userExists = await User.findOne({ _id: req.body.userId });
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "Invalid userId.",
      });
    }

    const postToLike = await Post.findOne({ _id: req.params.id });
    if (postToLike.likes.includes(req.body.userId)) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.body.userId } },
        { new: true }
      );

      return res.status(400).json({
        status: true,
        message: "post dislike successfully",
        updatedPost,
      });
    } else {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.body.userId } },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "post like successfully",
        updatedPost,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

module.exports = router;
