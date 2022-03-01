const connection = require("../connection");
const controller = require("./globalController");
exports.getShares = controller.select("share");
exports.createShare = controller.create("share", [], false);
exports.deleteShare = controller.delete("share");
