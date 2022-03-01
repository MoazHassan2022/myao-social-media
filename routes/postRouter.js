const express = require("express");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("surfer");
const postController = require("../controller/post");
const router = express.Router({ mergeParams: true });
const postMediaRouter = require("./postMediaRouter");
const commentRouter = require("./commentRouter");
const shareRouter = require("./shareRouter.js");
const likeRouter = require("./likeRouter");
router
  .route("/")
  .get(transferParamsToBody, postController.getPosts)
  .post(transferParamsToBody, protect, restriction, postController.createPost);
router.get(
  "/myPosts",
  transferParamsToBody,
  protect,
  restrictTo("surfer"),
  postController.getPosts
);
router
  .route("/:id")
  .get(transferParamsToBody, postController.getPost)
  .patch(transferParamsToBody, protect, restriction, postController.updatePost)
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    postController.deletePost
  );

router.use("/:post_id", likeRouter);

router.use("/:post_id/comment", commentRouter);
router.use("/:post_id/media", postMediaRouter);
router.use("/:post_id/share", shareRouter);
//TODO: add comment here
// router.use("/:post_id");
module.exports = router;
