const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const surRepMarController = require("../controller/surRepMar");
const router = express.Router();

router
  .route("/")
  .get(surRepMarController.getSurRepMar)
  .post(protect, restrictTo("admin", "surfer"), surRepMarController.createSurRepMar);
router
  .route("/:id")
  .get(transferParamsToBody, surRepMarController.getSurRepMar)

module.exports = router;
