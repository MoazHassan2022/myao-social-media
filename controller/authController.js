const crypto = require("crypto");
const catchAsync = require("../utilities/catchAsync");
const jwt = require("jsonwebtoken");
const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const security = require("../utilities/security");
const appError = require("../utilities/appError");
const {
  uniqueIdGenerator,
  filterObjFrom,
  filterObjTo,
  addWhereCondition,
 } = require("../utilities/control");
const columns = require("../utilities/tableColumns");
exports.transferParamsToBody = (req, res, next) => {
  for (const [key, val] of Object.entries(req.params)) {
    req.body[key] = val;
  }
  next();
};
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id, user.role);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
exports.signup = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!role) return next(new appError("no specific role determined"));
  req.body = filterObjTo(req.body, columns[role]);
  const id = uniqueIdGenerator();
  req.body[columns[role][0]] = id;
  query(`INSERT INTO ${role} SET ?`, req.body);
  req.body.role = role;
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // // console.log(url);
  // await new Email(newUser, url).sendWelcome();

  createSendToken(req.body, 201, req, res);
});
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("you must enter email and password"));
  const userTypes = ["surfer", "marketer"];
  const users = await Promise.all(
    userTypes.map((table) =>
      query(
        `SELECT * FROM ${table} WHERE email="${email}" AND password="${password}"`
      )
    )
  );
  userTypes.forEach((userType, i) => {
    if (users[i] && users[i].length !== 0) {
      return createSendToken({ ...users[i][0], role: userType }, 200, req, res);
    }
  });
  next(new appError("unexpected error happens while login"));
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await query(
    `SELECT * FROM ${decoded.role} WHERE id="${decoded.id}"`
  );
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (
    security.passwordChangedAfter(decoded.iat, currentUser.passwordChangedAt)
  ) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.body[`${decoded.role}_id`] = currentUser[0].id;
  req.auth = { role: decoded.role, id: decoded.id };
  next();
};

exports.updateMe = async (req, res, next) => {
  const { role, id } = req.auth;
  req.body = filterObjFrom(filterObjTo(req.body, columns[role]), [
    "id",
    "created_date",
    "email",
    "passwordChangedAt",
    "passwordResetToken",
    "passwordResetExpires",
    "is_active",
    "last_login",
    "closed_admin",
    "last_published",
    "founded_at",
  ]);
  const data = await query(`UPDATE ${role} SET ? WHERE id="${id}"`, req.body);
  res.json({
    status: "success",
    data,
    updatedData: req.body,
  });
};
exports.deleteMe = async (req, res, next) => {
  const { role, id } = req.auth;
  const data = await query(`UPDATE ${role} SET is_active=0 WHERE id="${id}"`);
  return res.json({
    status: "success",
    data,
  });
};
exports.restrictTo =
  (...roles) =>
  (req, body, next) => {
    if (roles.includes(req.auth.role)) return next();
    next(new appError(`you don't have the permission to make this action`));
  };
