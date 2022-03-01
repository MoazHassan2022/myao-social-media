const bcrypt = require("bcryptjs");
exports.hashPassword = async (password) => await bcrypt.hash(password, 12);
exports.correctPassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);
exports.passwordChangedAfter = (JWTTimestamp, passwordChangedAt) =>
  passwordChangedAt &&
  JWTTimestamp < parseInt(passwordChangedAt.getTime() / 1000, 10);