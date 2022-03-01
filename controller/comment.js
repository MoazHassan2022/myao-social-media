const connection = require("../connection");
const controller = require("./globalController");
exports.getComments = controller.select("comment");
exports.createComment = controller.create("comment");
exports.updateComment = controller.update("comment", ["id", "post_id", "surfer_id", "comment_time"]);
exports.deleteComment = controller.delete("comment");