const express = require("express");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const favPostController = require("../controller/fav_post");
const router = express.Router({ mergeParams: true });
const restriction = restrictTo("surfer", "admin");
router.get("/", transferParamsToBody, favPostController.getFavPost);
router
  .route("/:post_id")
  .get(transferParamsToBody, favPostController.getFavPost)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    favPostController.createFavPost
  )
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    favPostController.deleteFavPost
  );

module.exports = router;
