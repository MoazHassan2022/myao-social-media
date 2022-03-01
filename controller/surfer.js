const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getSurfers = controller.select("surfer");
exports.createSurfer = controller.create("surfer");
exports.updateSurfer = controller.update("surfer", ["id", "created_date"]);
exports.deleteSurfer = (req, res, next) => {
  req.body = { id: req.body.id, is_active: false };
  next();
};
exports.searchSurfer = (req, res, next) => {
  let arr = []; //req.body.search.split(" ");
  let q;

  if (arr.length == 1)
    q = `Select * from surfer where Fname like '%${arr[0]}' or Lname like '${arr[0]}'`;
  else
    q = `Select * from surfer where Fname like '%${arr[0]}' or Lname like '${arr[1]}'`;
  connection.query(q, (err, data) => {
    if (err)
      return res.json({
        status: "fail",
        message: err.message,
      });
    res.json({
      status: "success",
      data,
    });
  });
};

//TODO:
// SELECT * , CONCAT(FName , " " , LName) As Name WHERE Name LIKE (%arr[0]%arr[1]%)
