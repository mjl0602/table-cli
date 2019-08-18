const { file, find, savefile, mkdir } = require("../../tools/file");

const { row, input } = require("../../tools/builder");

let pages_path = "table-pages";
// let api_path = "table-api";
let source_path = "table-source";

let execPath = process.cwd();
let srcPath = `${execPath}/src`;

// let assetsPath = `${__dirname}/../../public`;

function assetsPath() {
  let path = `${__dirname}/../../public`;
  console.log(path);
  return path;
}

// build入口
async function build(command) {
  if (!command) {
    console.log("build后缺少文件命令,是否想输入build all?\n");
    return;
  }
  if (command == "all") {
    console.log("读取目录下所有文件\n");
    await buildAll();
  } else {
    await buildFileName(command);
  }
}

// build全部文件
async function buildAll(buildFunction = build) {
  let pathList = find(`${srcPath}/${source_path}/`);
  for (const filePath of pathList) {
    await buildFilePath(filePath);
  }
  console.log("全部创建完成");
}

/**
 * 通过文件名来创建相关的表格
 * @param {String} fileName - json文件名，会通过该json来生成
 */
async function buildFileName(fileName) {
  fileName = fileName.replace(".json", "");
  await buildFilePath(`${srcPath}/${source_path}/${fileName}.json`);
}


/**
 * 通过文件路径来创建相关的表格
 * @param {String} filePath - json文件名，会通过该json来生成
 */
async function buildFilePath(filePath) {
  let fileName = filePath.substring(
    filePath.lastIndexOf("/") + 1,
    filePath.length,
  );
  fileName = fileName.replace(".json", "");

  console.log(`从文件: ${fileName}.json 创建`);
  let tempObject = require(filePath);
  if (!tempObject) {
    console.error(`读取文件错误: ${filePath}.js`);
    return;
  }

  let table = "";
  let form = "";
  let defaultObject = "";
  let rules = "";

  for (const key in tempObject) {
    if (tempObject.hasOwnProperty(key)) {
      const element = tempObject[key];
      // 页面表格与表单
      table += await row(key, element);
      form += await input(key, element);
      // 数据类和表单规则
      defaultObject += `${key}:"",\n    `;
      rules += `${key}:[{ required: true, message: "必填", trigger: "blur" }],\n    `;
    }
  }
  // 创建页面
  let pageTemplate = await file(`${__dirname}/assets/template.vue`);
  pageTemplate = pageTemplate.replace("<!-- table insert -->", table);
  pageTemplate = pageTemplate.replace("<!-- form insert -->", form);
  pageTemplate = pageTemplate.replace(/##filename##/g, fileName);
  pageTemplate = pageTemplate.replace(
    "/** property */",
    defaultObject,
  );
  pageTemplate = pageTemplate.replace("/** rules */", rules);
  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  await savefile(
    `${srcPath}/${pages_path}/${fileName}Manage.vue`,
    pageTemplate,
  );
  console.log("保存文件完成\n");
  return;
}
/**
 * init功能，可以创建用于示例的文件夹
 * 
 */
async function init() {
  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  // await mkdir(`src/${api_path}`);
  await mkdir(`src/${source_path}`);

  console.log("创建basic部分");
  // 创建mixin
  let mixinTemplate = await file(`${assetsPath()}/admin_mixin.js`);
  await mkdir(`src/${pages_path}/basic`);
  await savefile(
    `${srcPath}/${pages_path}/basic/admin_mixin.js`,
    mixinTemplate,
  );
  // 父类
  let adminObjectTemp = await file(`${assetsPath()}/adminobject.js`);
  await savefile(`src/${pages_path}/basic/adminobject.js`, adminObjectTemp);

  console.log("创建example.json");
  // 创建example
  let exampleArticle = await file(`${__dirname}/test/article.json`);
  await mkdir(`src/${source_path}`);
  await savefile(
    `${srcPath}/${source_path}/article.json`,
    exampleArticle,
  );
  // build一次example
  await build("article");
  console.log("init 完成");
}
module.exports = {
  build,
  buildAll,
  buildFileName,
  buildFilePath,
  init,
};
