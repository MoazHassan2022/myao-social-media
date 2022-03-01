const { promisify } = require("util");
const connection = require("../connection");
const appError = require("../utilities/appError");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
const {
  addWhereCondition,
  filterObjFrom,
  filterObjTo,
  uniqueIdGenerator,
} = require("./../utilities/control");
const columns = require("../utilities/tableColumns.js");
exports.getProduct = async (req, res, next) => {
  const product = await query(`SELECT * FROM product WHERE id=${req.body.id}`);
  if (!product) return next(new appError("no product with this id"));
  product.media = (
    await query(`SELECT * FROM product_media WHERE product_id=${product.id}`)
  ).map((media) => media.link);
  return res.json({
    status: "success",
    data: product,
  });
};
exports.getProducts = async (req, res, next) => {
  const products = await query(
    addWhereCondition(
      `SELECT * FROM product`,
      filterObjTo(req.body, columns["product"])
    )
  );
  if (products.length === 0)
    return res.json({
      status: "success",
      data: products,
    });
  let productsHashed = {};
  products.forEach((product) => {
    productsHashed[product.id] = { ...product, media: [] };
  });
  const reducedCondition = products.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const products_media = await query(
    `SELECT * FROM product_media WHERE product_id IN (${reducedCondition})`
  );
  products_media.forEach(({ product_id, link }) =>
    productsHashed[product_id].media.push(link)
  );
  res.json({
    status: "success",
    data: Object.values(productsHashed),
  });
};
exports.createProduct = async (req, res, next) => {
  const id = uniqueIdGenerator();
  req.body["id"] = id;
  req.body["avg_rating"] = 0;
  const product = await query(
    `INSERT INTO product set ? `,
    filterObjTo(req.body, columns["product"])
  );
  if (!req.body.media || !req.body.media.length)
    return res.json({
      status: "success",
      data: product,
    });
  const media = req.body.media.map(({ link, type }) => [type, id, link]);
  const product_media = await query(
    "INSERT INTO product_media (type , product_id , link) VALUES ?",
    [media]
  );
  return res.json({ status: "success", data: req.body });
};
exports.deleteProduct = controller.delete("product");
exports.updateProduct = async (req, res, next) => {
  const Obj = filterObjFrom(filterObjTo(req.body, columns["product"]), [
    "id",
    "created_date",
    "marketer_id",
    "avg_rating",
    "reviews_counter",
    "media",
  ]);
  if (Object.keys(Obj).length === 0)
    return res.json({
      status: "fail",
      err: "no data to be changed",
    });
  const product = await query(
    `UPDATE product SET ? WHERE id='${req.body.id}'`,
    Obj
  );

  if (product.affectedRows === 0)
    return res.json({
      status: "fail",
      err: "wrong product id",
    });
  res.json({
    status: "success",
    data: product,
  });
};

exports.addNewReview = async (req, body, next) => {
  if (!req.body.rating || !req.body.product_id) return next();
  if (req.body.rating < 1 || req.body.rating > 5)
    return next(new appError("invalid rating value"));
  // const updatedQuery = await query(
  //   `INSERT INTO product(id ,marketer_id ,product_text ,avg_rating ,price ,created_date ,reviews_counter ,product_name)
  //    VALUES('${req.body.product_id}' ,'' ,1,1,'2020-12-12',0,'')
  //    ON DUPLICATE KEY UPDATE avg_rating=(avg_rating * reviews_counter + ${req.body.rating}) / (reviews_counter + 1)
  //   `
  // );
  const { reviews_counter, avg_rating } = await query(
    `SELECT avg_rating , reviews_counter FROM product WHERE id=${req.body.product_id}`
  );
  const updatedQuery = await query(
    `UPDATE product SET avg_rating=${
      (avg_rating * reviews_counter + req.body.rating) / (reviews_counter + 1)
    } , reviews_counter=${reviews_counter + 1}`
  );
  next();
};
