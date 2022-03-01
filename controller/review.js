const connection = require("../connection");
const controller = require("./globalController");
exports.getReviews = controller.select("review");
exports.createReview = controller.create("review");
exports.updateReview = controller.update("review", [
  "id",
  "post_id",
  "surfer_id",
  "created_time",
]);
exports.deleteReview = controller.delete("review");
