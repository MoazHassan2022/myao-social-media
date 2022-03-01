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
exports.getPost = async (req, res, next) => {
  const post = await query(`SELECT * FROM post WHERE id=${req.body.id}`);
  if (!post) return next(new appError("no post with this id"));
  post.media = (
    await query(`SELECT * FROM post_media WHERE post_id=${post.id}`)
  ).map((media) => media.link);
  return res.json({
    status: "success",
    data: post,
  });
};
exports.getPosts = async (req, res, next) => {
  const posts = await query(
    addWhereCondition(
      `SELECT * FROM post`,
      filterObjTo(req.body, columns["post"])
    )
  );
  if (posts.length === 0)
    return res.json({
      status: "success",
      data: posts,
    });
  let postsHashed = {};
  posts.forEach((post) => {
    postsHashed[post.id] = { ...post, media: [] };
  });
  const reducedCondition = posts.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const posts_media = await query(
    `SELECT * FROM post_media WHERE post_id IN (${reducedCondition})`
  );
  posts_media.forEach(({ post_id, link }) =>
    postsHashed[post_id].media.push(link)
  );
  res.json({
    status: "success",
    data: Object.values(postsHashed),
  });
};
exports.createPost = async (req, res, next) => {
  const id = uniqueIdGenerator();
  req.body["id"] = id;
  const post = await query(
    `INSERT INTO post set ? `,
    filterObjTo(req.body, columns["post"])
  );
  if (!req.body.media || !req.body.media.length)
    return res.json({
      status: "success",
      data: post,
    });
  const media = req.body.media.map(({ link, type }) => [type, id, link]);
  const post_media = await query(
    "INSERT INTO post_media (type , post_id , link) VALUES ?",
    [media]
  );
  return res.json({ status: "success", post_media });
};
exports.deletePost = controller.delete("post"); // post media on delete cascade
exports.updatePost = async (req, res, next) => {
  const Obj = filterObjFrom(filterObjTo(req.body, columns["post"]), [
    "id",
    "created_date",
    "surfer_id",
  ]);
  if (Object.keys(Obj).length === 0)
    return res.json({
      status: "success",
      data: "clown update request, no data changed",
    });
  const post = await query(`UPDATE post SET ? WHERE id='${req.body.id}'`, Obj);
  if (post.affectedRows === 0)
    return res.json({
      status: "failed",
      err: "wrong post id",
    });
  const { media } = req.body;
  res.json({
    status: "success",
    data: post,
  });
};
