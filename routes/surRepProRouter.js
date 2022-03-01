const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const surRepProController = require("../controller/surRepPro");
const router = express.Router();

router
  .route("/")
  .get(surRepProController.getSurRepPro)
  .post(protect, restrictTo("admin", "surfer"), surRepProController.createSurRepPro);
router
  .route("/:id")
  .get(transferParamsToBody, surRepProController.getSurRepPro)

module.exports = router;
