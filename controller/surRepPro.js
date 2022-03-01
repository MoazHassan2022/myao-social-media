const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getSurRepPro = controller.select("sur_rep_pro");
exports.createSurRepPro = controller.create("sur_rep_pro");
