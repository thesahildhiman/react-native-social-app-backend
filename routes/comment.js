const router = require("express").Router();
const Post = require("../models/post");
const Comment = require("../models/comment");

router.post("/add", async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;
    const postExists = await Post.findOne({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      comment,
      userId,
      postId,
    });
    const savedComment = await newComment.save();

    res.status(201).json({
      status: true,
      message: "comment created successfully",
      savedComment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    // const { postId } = req.body;
    const commentExists = await Comment.findOne({ _id: req.params.id });
    console.log(">>>>>>>>", req.params.id, commentExists);
    if (!commentExists) {
      return res.status(404).json({ error: "comment not found" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: true,
      message: "comment deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

router.get("/getAllComments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: postId });
    return res.status(200).json({ status: true, comments });
  } catch (error) {
    return res
      .status(500)
      .json({ status: true, message: "internal server error" });
  }
});
module.exports = router;
