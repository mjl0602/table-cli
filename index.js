#!/usr/bin/env node
// import { getUserInput } from "./tools/input";

const {js,file ,savefile,mkdir}=require("./tools/file");


const { row, input }= require("./tools/builder") ;

let execPath = process.cwd();
let srcPath = `${execPath}/src`;
let apiPath = `${execPath}/src/api`;

main(process.argv);

async function main(args) {
  console.log("args", args);

  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：*******");
    return;
  } else if (args[2] == "init") {
    console.log("init");
    init(args[2]);
    return;
  } else if (args[2] == "build") {
    console.log("init");
    build(args[3]);
    return;
  }
  console.log("over", args[2]);
}

async function build(jspath) {
  let AdminObject = require(jspath);

  console.log("AdminObject", AdminObject);
  let tempObject = AdminObject;
  console.log("tempObject", tempObject);
  if (!tempObject) {
    console.log("未读取到配置");
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

      defaultObject += `${key}:"",\n    `;
      rules += `${key}:[{ required: true, message: "必填", trigger: "blur" }],\n    `;
    }
  }

  // 创建页面
  let pageTemplate = await file(`${__dirname}/assets/template.vue`);
  pageTemplate = pageTemplate.replace("<!-- table insert -->", table);
  pageTemplate = pageTemplate.replace("<!-- form insert -->", form);

  await mkdir("src");
  await mkdir("src/pages");
  await savefile(`${srcPath}/pages/target.vue`, pageTemplate);

  // 创建mixin
  let mixinTemplate = await file(`${__dirname}/assets/admin_mixin.js`);
  await mkdir("src/pages/mixin");
  await savefile(`${srcPath}/pages/mixin/admin_mixin.js`, mixinTemplate);

  // 父类
  let adminObjectTemp = await file(`${__dirname}/assets/adminobject.js`);
  // adminObjectTemp = adminObjectTemp.replace("/** property */", defaultObject);
  // adminObjectTemp = adminObjectTemp.replace("/** rules */", rules);
  await mkdir("src/api/");
  await savefile(`${srcPath}/api/adminobject.js`, adminObjectTemp);

  // 示例
  let exampleObjectTemp = await file(`${__dirname}/assets/exampleAdmin.js`);
  exampleObjectTemp = exampleObjectTemp.replace("/** property */", defaultObject);
  exampleObjectTemp = exampleObjectTemp.replace("/** rules */", rules);
  await mkdir("src/api/");
  await savefile(`${srcPath}/api/example.js`, exampleObjectTemp);

  console.log("save success");
}

async function init(jspath) {
  // await mkdir("src");
  // await mkdir("src/pages");
  // await mkdir("src/api");

  let AdminObject = js(jspath);

  console.log(AdminObject);
}
