const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getMarRepMar = controller.select("mar_rep_mar");
exports.createMarRepMar = controller.create("mar_rep_mar");
