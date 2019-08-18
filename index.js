#!/usr/bin/env node
// import { getUserInput } from "./tools/input";

const { file, find, savefile, mkdir } = require("./tools/file");

const { row, input } = require("./tools/builder");
let pages_path = "table-pages";
let api_path = "table-api";
let source_path = "table-source";

let execPath = process.cwd();
let srcPath = `${execPath}/src`;

// 标准
const standard = require("./builder/standard");
// Yapi
const yapi = require("./builder/yapi");
// TODO: Bmob
// const { bmob_build, bmob_init } = require("./builder/bmob");

main(process.argv);

async function main(args) {
  console.log("args", args);
  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：table-cli build index.js");
    return;
  } else if (args[2] == "init") {
    console.log("初始化项目");
    standard.init(args[2]);
    return;
  } else if (args[2] == "build") {
    console.log("正在通过指定JSON文件创建");
    try {
      await standard.build(args[3]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
<<<<<<< HEAD
  }else if (args[2] == "bmob") {
    console.log("正在通过指定JSON文件创建");
    build(args[3],true);
    return;
  }
  console.log("没找到对应指令", args[2]);
}

// build入口
async function build(command,bmob = false) {
  if (command == "all") {
    console.log("读取目录下所有文件\n");
    buildAll(bmob);
  } else {
    buildFileName(command,bmob);
  }
}

// build全部文件
async function buildAll(bmob = false) {
  let pathList = find(`${srcPath}/${source_path}/`);
  for (const filePath of pathList) {
    await buildFilePath(filePath, bmob);
  }
  console.log("全部创建完成");
}

async function buildFileName(fileName,bmob = false) {
  fileName = fileName.replace(".json", "");
  await buildFilePath(`${srcPath}/${source_path}/${fileName}.json`,bmob);
}

async function buildFilePath(filePath, bmob) {
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


  // bmob only
  let edit = '';


  for (const key in tempObject) {
    if (tempObject.hasOwnProperty(key)) {
      const element = tempObject[key];
      // 页面表格与表单
      table += await row(key, element);
      form += await input(key, element);
      edit += `    res.set("${key}", obj.${key})\n`
      // 数据类和表单规则
      defaultObject += `${key}:"",\n    `;
      rules += `${key}:[{ required: true, message: "必填", trigger: "blur" }],\n    `;
=======
  } else if (args[2] == "yp-init") {
    yapi.init(args[3]);
    return;
  } else if (args[2] == "yp-build") {
    try {
      await yapi.build(args[3]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
>>>>>>> 5f867a6f0dbb016322af8f2fa03629c186d6e393
    }
    return;
  }
<<<<<<< HEAD

  // 创建页面
  let pageTemplate = await file(`${__dirname}/assets/template.vue`);
  pageTemplate = pageTemplate.replace("<!-- table insert -->", table);
  pageTemplate = pageTemplate.replace("<!-- form insert -->", form);
  pageTemplate = pageTemplate.replace(/##filename##/g, fileName);

  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  await savefile(`${srcPath}/${pages_path}/${fileName}Manage.vue`, pageTemplate);

  // 示例
  let examPath = `${__dirname}/assets/exampleAdmin.js`;
  if (bmob) {
    examPath = `${__dirname}/assets/bmobExampleAdmin.js`;
  }
  let exampleObjectTemp = await file(examPath);
  exampleObjectTemp = exampleObjectTemp.replace(
    "/** property */",
    defaultObject,
  );
  exampleObjectTemp = exampleObjectTemp.replace("/** rules */", rules);

  if (bmob) {
    exampleObjectTemp = exampleObjectTemp.replace("/** edit */", edit);
    exampleObjectTemp = exampleObjectTemp.replace("/** add */", edit);
    exampleObjectTemp = exampleObjectTemp.replace("##tableName##", fileName);
  }

  await mkdir(`src/${api_path}/`);
  await savefile(`${srcPath}/${api_path}/${fileName}.js`, exampleObjectTemp);

  console.log("保存文件完成\n");
  return;
}

async function init(jspath) {
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
  let exampleArticle = await file(`${__dirname}/assets/example_article.json`);
  await mkdir(`src/${source_path}`);
  await savefile(
    `${srcPath}/${source_path}/example_article.json`,
    exampleArticle,
  );

  await build("example_article");
  console.log("init 完成");
=======
  console.log("没找到对应指令", args[2]);
>>>>>>> 5f867a6f0dbb016322af8f2fa03629c186d6e393
}
