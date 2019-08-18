const file = require("./file").file;
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
exports.row = async function(property, label) {
  let temp = await file(resolve("../public/text_column.html"));
  // console.log(temp);
  return temp.replace(/###/g, property).replace(/@@@/g, label);
};

exports.input = async function(property, label) {
  let temp = await file(resolve("../public/text_form.html"));
  // console.log(temp);
  return temp.replace(/###/g, property).replace(/@@@/g, label);
};
module.exports = exports;
