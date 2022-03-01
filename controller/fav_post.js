const connection = require("../connection");
const controller = require("./globalController");
exports.getFavPost = controller.select("favpost");
exports.createFavPost = controller.create("favpost", [], false);
exports.deleteFavPost = controller.delete("favpost");
