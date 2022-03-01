const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getSurRepSur = controller.select("sur_rep_sur");
exports.createSurRepSur = controller.create("sur_rep_sur");
