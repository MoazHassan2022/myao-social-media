exports.uniqueIdGenerator = () =>
  `${Date.now().toString(32)}${Math.floor(Math.random() * 100).toString()}`;
exports.addWhereCondition = (query, Obj) =>
  Object.keys(Obj).reduce(
    (prev, cur, i) =>
      `${prev} ${i == 0 ? "WHERE" : "AND"} ${cur}="${Obj[cur]}"`,
    query
  );

exports.filterObjFrom = (Obj, fil = []) => {
  let newObj = {...Obj};
  fil.forEach((val) => delete newObj[val]);
  return newObj;
};
// TODO:
// make it work for capital and small letters
exports.filterObjTo = (Obj, fil = []) => {
  let newObj = {};
  fil.forEach((val) => {
    if (val in Obj) newObj[val] = Obj[val];
  });
  return newObj;
};
