const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/follow/:id", async (req, res) => {
  try {
    const userToFollow = await User.findOne({ _id: req.params.id }); // other user
    const currentUser = await User.findOne({ _id: req.body.userId }); // me

    if (userToFollow.followers.includes(req.body.userId)) {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $pull: { followers: req.body.userId } },
        { new: true }
      );
      const res2 = await User.updateOne(
        { _id: req.body.userId },
        {
          $pull: { following: req.params.id },
        }
      );
      return res.status(200).json({
        status: true,
        message: "user unfollow successfully",
      });
    } else {
      const res1 = await User.updateOne(
        { _id: req.params.id },
        { $push: { followers: req.body.userId } }
      );
      const res2 = await User.updateOne(
        { _id: req.body.userId },
        { $push: { following: req.params.id } }
      );
      return res
        .status(200)
        .json({ status: true, message: "user follow successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
});

// router.post("/unfollow/:id", async (req, res) => {
//   try {
//     const userToUnfollow = await User.findOne({ _id: req.params.id });
//     const currentUser = await User.findOne({ _id: req.body.userId });

//     if (!userToUnfollow.followers.includes(req.body.userId)) {
//       return res
//         .status(400)
//         .json({ status: false, message: "you are not following this user" });
//     } else {
//       const res1 = await User.updateOne(
//         { _id: req.params.id },
//         { $pull: { followers: req.body.userId } }
//       );
//       const res2 = await User.updateOne(
//         { _id: req.body.userId },
//         {
//           $pull: { following: req.params.id },
//         }
//       );
//       return res
//         .status(200)
//         .json({ status: true, message: "user unfollowed successfully" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: false, message: "internal server error" });
//   }
// });

module.exports = router;
