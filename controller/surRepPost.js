const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getSurRepPost = controller.select("sur_rep_post");
exports.createSurRepPost = controller.create("sur_rep_post");
