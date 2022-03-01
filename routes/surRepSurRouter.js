const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const surRepSurController = require("../controller/surRepSur");
const router = express.Router();

router
  .route("/")
  .get(surRepSurController.getSurRepSur)
  .post(protect, restrictTo("admin", "surfer"), surRepSurController.createSurRepSur);
router
  .route("/:id")
  .get(transferParamsToBody, surRepSurController.getSurRepSur)

module.exports = router;
