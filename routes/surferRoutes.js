const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const surferController = require("../controller/surfer");
const router = express.Router();
const postRouter = require("./postRouter");
const favPostRouter = require("./favPostRouter");
const commentRouter = require("./commentRouter");
const reviewRouter = require("./reviewRouter");
const locationRouter = require("./locationRouter");

router
  .route("/")
  .get(surferController.getSurfers)
  .post(protect, restrictTo("admin"), surferController.createSurfer);
router.route("/search").get(surferController.searchSurfer);
router
  .route("/:id")
  .get(transferParamsToBody, surferController.getSurfers)
  .patch(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    surferController.updateSurfer
  )
  .delete(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    surferController.deleteSurfer,
    surferController.updateSurfer
  );

router.use("/:surfer_id/post", postRouter);
router.use("/:surfer_id/fav_post", favPostRouter);
router.use("/:surfer_id/comment", commentRouter);
router.use("/:surfer_id/review", reviewRouter);
router.use("/:surfer_id/location", locationRouter);
module.exports = router;
