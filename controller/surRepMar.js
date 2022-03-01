const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getSurRepMar = controller.select("sur_rep_mar");
exports.createSurRepMar = controller.create("sur_rep_mar");
