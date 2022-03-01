const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
exports.getFriends = async (req, res, next) => {
  const data = await query(
    `SELECT * FROM friend 
    WHERE (source_id="${req.auth.id}" OR target_id="${req.auth.id}")
    AND friendship_time IS NOT NULL`
  );
  res.json({
    status: "success",
    data,
  });
};
exports.getReceivedRequests = async (req, res, next) => {
  const data = await query(
    `SELECT * FROM \`friend\` WHERE target_id="${req.auth.id}" AND friendship_time IS NULL`
  );
  res.json({
    status: "success",
    data
  });
};
exports.getSentRequests = async (req, res, next) => {
  const data = await query(
    `SELECT * FROM \`friend\` WHERE source_id="${req.auth.id}" AND friendship_time IS NULL`
  );
  res.json({
    status: "success",
    data,
  });
};

exports.makeRequest = controller.create("friend", [], false);
exports.acceptRequest = async (req, res, next) => {
  console.log(req.auth.id, req.body.source_id, req.body.friendship_time);
  const request = await query(
    `UPDATE friend SET friendship_time="${req.body.friendship_time}" 
    WHERE target_id="${req.auth.id}"
    AND source_id="${req.body.source_id}"`
  );
  return res.json({
    status: "success",
    data: request,
  });
};
exports.beforeRequest = (req, res, next) => {
  req.body.source_id = req.auth.id;
  next();
};
exports.deleteRequest = async (req, res, next) => {
  const data = await query(
    `DELETE FROM friend 
    WHERE (source_id="${req.auth.id}" AND target_id="${req.body.target_id}") 
    OR (source_id="${req.body.target_id}" AND target_id="${req.auth.id}")`
  );
  return res.json({
    status: "success",
    data,
  });
};
exports.checkFriendship = async (req, res, next) => {
  const data = await query(
    `SELECT * FROM friend WHERE source_id="${req.auth.id}" AND target_id="${req.body.target_id}"`
  );
  if (data && data.length !== 0)
    return res.json({
      status: "success",
      friend: true,
    });
  res.json({
    status: "success",
    friend: false,
  });
};
