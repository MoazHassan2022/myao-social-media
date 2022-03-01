const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const surRepPostController = require("../controller/surRepPost");
const router = express.Router();

router
  .route("/")
  .get(surRepPostController.getSurRepPost)
  .post(protect, restrictTo("admin", "surfer"), surRepPostController.createSurRepPost);
router
  .route("/:id")
  .get(transferParamsToBody, surRepPostController.getSurRepPost)

module.exports = router;
