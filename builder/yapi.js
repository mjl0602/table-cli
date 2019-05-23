
const { file, find, savefile, mkdir } = require("../tools/file");

const { row, input } = require("../tools/builder");
let pages_path = "table-pages";
let api_path = "table-api";
let source_path = "table-source";

let execPath = process.cwd();
let srcPath = `${execPath}/src`;


// build入口
 async function yapi_build(command) {
  if (command == "all") {
    console.log("读取目录下所有文件\n");
    buildAll();
  } else {
    buildFileName(command);
  }
}

// build全部文件
export async function buildAll(buildFunction = yapi_build) {
  let pathList = find(`${srcPath}/${source_path}/`);
  for (const filePath of pathList) {
    await buildFilePath(filePath);
  }
  console.log("全部创建完成");
}

 async function buildFileName(fileName) {
  fileName = fileName.replace(".json", "");
  await buildFilePath(`${srcPath}/${source_path}/${fileName}.json`);
}

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
      const element = tempObject[key].description;
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

  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  await savefile(`${srcPath}/${pages_path}/${fileName}Manage.vue`, pageTemplate);

  // 示例
  let exampleObjectTemp = await file(`${__dirname}/assets/exampleAdmin.js`);
  exampleObjectTemp = exampleObjectTemp.replace(
    "/** property */",
    defaultObject,
  );
  exampleObjectTemp = exampleObjectTemp.replace("/** rules */", rules);
  await mkdir(`src/${api_path}/`);
  await savefile(`${srcPath}/${api_path}/${fileName}.js`, exampleObjectTemp);

  console.log("保存文件完成\n");
  return;
}

async function yapi_init(jspath) {
  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  await mkdir(`src/${api_path}`);
  await mkdir(`src/${source_path}`);

  // 创建mixin
  let mixinTemplate = await file(`${__dirname}/assets/admin_mixin.js`);
  await mkdir(`src/${pages_path}/mixin`);
  await savefile(`${srcPath}/${pages_path}/mixin/admin_mixin.js`, mixinTemplate);

  // 父类
  let adminObjectTemp = await file(`${__dirname}/assets/adminobject.js`);
  await mkdir(`src/${api_path}/`);
  await savefile(`${srcPath}/${api_path}/adminobject.js`, adminObjectTemp);

  // 创建example
  let exampleArticle = await file(`${__dirname}/assets/yapi/demo.json`);
  await mkdir(`src/${source_path}`);
  await savefile(
    `${srcPath}/${source_path}/example_article.json`,
    exampleArticle,
  );

  await yapi_build("demo");
  console.log("yapi_init 完成");
}
module.exports = {
  yapi_build,
  yapi_init,
};
