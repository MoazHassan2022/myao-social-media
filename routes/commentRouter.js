const express = require("express");
const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("surfer", "admin");
const commentController = require("../controller/comment");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(transferParamsToBody, commentController.getComments)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    commentController.createComment
  );
router
  .route("/:id")
  .get(transferParamsToBody, commentController.getComments)
  .patch(
    transferParamsToBody,
    protect,
    restrictTo,
    commentController.updateComment
  )
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    commentController.deleteComment
  );

//TODO: add comment here
// router.use("/:comment_id");
module.exports = router;
