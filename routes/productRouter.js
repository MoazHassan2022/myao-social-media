const express = require("express");

const {
  protect,
  restrictTo,
  transferParamsToBody,
} = require("../controller/authController");
const restriction = restrictTo("surfer");
const productController = require("../controller/product");
const reviewRouter = require("./reviewRouter");
const productMediaRouter = require("./productMediaRouter");
const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(protect, restriction, productController.createProduct);
router
  .route("/:id")
  .get(transferParamsToBody, productController.getProducts)
  .patch(protect, restriction, productController.updateProduct)
  .delete(
    protect,
    restrictTo("marketer", "admin"),
    productController.deleteProduct
  );

router.use("/:product_id/review", reviewRouter);
router.use("/:product_id/media", productMediaRouter);
module.exports = router;
