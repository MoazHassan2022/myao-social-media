const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../controller/authController");
const restriction = restrictTo("surfer");
const {
  acceptRequest,
  beforeRequest,
  checkFriendship,
  deleteRequest,
  getReceivedRequests,
  getSentRequests,
  makeRequest,
  getFriends,
} = require("../controller/friend");
router.use(protect, restriction);
router.get("/sent", getSentRequests);
router.get("/received", getReceivedRequests);
router.post("/accept", acceptRequest);
// target_id
router
  .route("/")
  .get(getFriends)
  .post(beforeRequest, makeRequest)
  .delete(deleteRequest);
module.exports = router;
