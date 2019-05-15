#!/usr/bin/env node
// import { getUserInput } from "./tools/input";

const { file, find, savefile, mkdir } = require("./tools/file");

const { row, input } = require("./tools/builder");

let execPath = process.cwd();
let srcPath = `${execPath}/src`;

main(process.argv);

async function main(args) {
  console.log("args", args);

  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：table-cli build index.js");
    return;
  } else if (args[2] == "init") {
    console.log("初始化项目");
    init(args[2]);
    return;
  } else if (args[2] == "build") {
    console.log("init");
    build(args[3]);
    return;
  }
  console.log("没找到对应指令", args[2]);
}

// build入口
async function build(command) {
  if (command == "*") {
    buildAll();
  } else {
    buildFileName(command);
  }
}

// build全部文件
async function buildAll(buildFunction = build) {
  let pathList = find(`${srcPath}/table-source/`);
  for (const filePath of pathList) {
    await buildFilePath(filePath);
  }
  console.log("全部创建完成");
}

async function buildFileName(fileName) {
  fileName = fileName.replace(".json", "");
  await buildFilePath(`${srcPath}/table-source/${fileName}.json`);
}

async function buildFilePath(filePath) {
  let fileName = filePath.substring(
    filePath.lastIndexOf("/") + 1,
    filePath.length,
  );
  fileName = fileName.replace(".json", "");

  console.log(`加载文件: ${filePath}.json`);
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

  await mkdir("src");
  await mkdir("src/table-pages");
  await savefile(`${srcPath}/table-pages/${fileName}Manage.vue`, pageTemplate);

  // 示例
  let exampleObjectTemp = await file(`${__dirname}/assets/exampleAdmin.js`);
  exampleObjectTemp = exampleObjectTemp.replace(
    "/** property */",
    defaultObject,
  );
  exampleObjectTemp = exampleObjectTemp.replace("/** rules */", rules);
  await mkdir("src/table-api/");
  await savefile(`${srcPath}/table-api/${fileName}.js`, exampleObjectTemp);

  // console.log("save success");

  console.log("save success");
  return;
}

async function init(jspath) {
  await mkdir("src");
  await mkdir("src/table-pages");
  await mkdir("src/table-api");
  await mkdir("src/table-source");

  // 创建mixin
  let mixinTemplate = await file(`${__dirname}/assets/admin_mixin.js`);
  await mkdir("src/table-pages/mixin");
  await savefile(`${srcPath}/table-pages/mixin/admin_mixin.js`, mixinTemplate);

  // 父类
  let adminObjectTemp = await file(`${__dirname}/assets/adminobject.js`);
  await mkdir("src/table-api/");
  await savefile(`${srcPath}/table-api/adminobject.js`, adminObjectTemp);

  // 创建example
  let exampleArticle = await file(`${__dirname}/assets/example_article.json`);
  await mkdir("src/table-source");
  await savefile(
    `${srcPath}/table-source/example_article.json`,
    exampleArticle,
  );

  await build("example_article");
  console.log("init 完成");
}
