const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const marRepMarController = require("../controller/marRepMar");
const router = express.Router();

router
  .route("/")
  .get(marRepMarController.getMarRepMar)
  .post(protect, restrictTo("admin", "marketer"), marRepMarController.createMarRepMar);
router
  .route("/:id")
  .get(transferParamsToBody, marRepMarController.getMarRepMar)

module.exports = router;
