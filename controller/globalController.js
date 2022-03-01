const res = require("express/lib/response");
const { json } = require("express/lib/response");
const { promisify } = require("util");
const connection = require("../connection");
const query = promisify(connection.query).bind(connection);
const columns = require("../utilities/tableColumns");
const {
  addWhereCondition,
  filterObjFrom,
  filterObjTo,
  uniqueIdGenerator,
} = require("./../utilities/control");
//////////// utilities functions //////////////////

////////////////////////////////////////////
///////////// global routes ////////////////
// SELECT * FROM ((table)) WHERE ((get conditions from req.body))
//
exports.select = (table) => (req, res, next) => {
  console.log(req.query);
  req.body = filterObjTo(req.body, columns[table]);
  connection.query(
    addWhereCondition(`SELECT * FROM \`${table}\``, req.body),
    (err, data) => {
      if (err)
        return res.json({
          status: "fail",
          err: err.message,
        });
      return res.json({
        status: "success",
        data,
      });
    }
  );
};
// INSERT INTO TABLE SET ? ==> get values from filtered req.body
// filter from id if it doesn't have unique id
// id is the 0 index of the table columns
exports.create =
  (table, filter = [], createUnique = true) =>
  (req, res, next) => {
    // return console.log(req.body);
    req.body = filterObjTo(req.body, columns[table]);
    req.body = filterObjFrom(req.body, filter);
    createUnique && (req.body[columns[table][0]] = uniqueIdGenerator());
    if (Object.keys(req.body).length === 0)
      return res.json({
        status: "fail",
        err: "leak of data",
      });
    connection.query(
      `INSERT INTO \`${table}\` SET ?`,
      req.body,
      (err, data) => {
        if (err) {
          return res.json({ status: "fail", err: err.message });
        }
        return res.json({ status: "success", data: req.body });
      }
    );
  };
// permanently delete be careful
exports.delete = (table) => (req, res, next) => {
  req.body = filterObjTo(req.body, columns[table]);
  connection.query(
    addWhereCondition(`DELETE FROM \`${table}\``, req.body),
    (err, data) => {
      if (err) {
        res.json({ status: "fail", err: err.message });
      }
      return res.json({ status: "success", data });
    }
  );
};

// update table set ? ==> search from req.body and update from filtered req.body
exports.update =
  (table, filter = []) =>
  (req, res, next) => {
    req.body = filterObjTo(req.body, columns[table]);
    const idKey = columns[table][0];
    connection.query(
      `UPDATE \`${table}\` SET ? WHERE ${idKey}="${req.body[idKey]}"`,
      filterObjFrom(req.body, filter),
      (err, data) => {
        if (err) res.json({ status: "fail", err: err.message });
        return res.json({ status: "success", data });
      }
    );
  };
exports.updateNonPrimary =
  (table, searchAttributes = [], filterAttributes = []) =>
  async (req, res, next) => {
    req.body = filterObjTo(req.body, columns[table]);
    const updated = await query(
      addWhereCondition(
        `UPDATE \`${table}\` SET ?`,
        filterObjTo(req.body, filterAttributes)
      ),
      filterObjTo(req.body, searchAttributes)
    );
    res.json({
      status: "success",
      data: req.body,
    });
  };
exports.globalQuery = (queryStr) => async (req, res, next) => {
  const data = await query(queryStr);
  return res.json({
    status: "success",
    data,
  });
};

// query => the main query
// whereCondition
//////////////////////////////////////////////////////

// req.body
