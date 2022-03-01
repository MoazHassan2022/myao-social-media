const express = require("express");
const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("surfer", "admin");
const likeController = require("../controller/like");
const router = express.Router({ mergeParams: true });

router.get("/likes", transferParamsToBody, likeController.getLikes);
router.post(
  "/like",
  transferParamsToBody,
  protect,
  restriction,
  likeController.createLike
);
router.post(
  "/unlike",
  transferParamsToBody,
  protect,
  restriction,
  likeController.deleteLike
);
router.patch(
  "/like",
  transferParamsToBody,
  protect,
  restriction,
  likeController.updateLike
);

//TODO: add like here
// router.use("/:like_id");
module.exports = router;
