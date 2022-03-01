const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
exports.getLikes = controller.select("like");
exports.createLike = controller.create("like", [], false);
exports.deleteLike = controller.delete("like");
exports.updateLike = controller.updateNonPrimary(
  "like",
  ["type"],
  ["liker_id", "post_id"]
);
