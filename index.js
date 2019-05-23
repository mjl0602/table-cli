#!/usr/bin/env node
// import { getUserInput } from "./tools/input";

const { file, find, savefile, mkdir } = require("./tools/file");

const { row, input } = require("./tools/builder");
let pages_path = "table-pages";
let api_path = "table-api";
let source_path = "table-source";

let execPath = process.cwd();
let srcPath = `${execPath}/src`;

const {build,init} = require('./builder/standard')
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
    console.log("正在通过指定JSON文件创建");
    build(args[3]);
    return;
  }else if(args[2] == 'yp-build'){
    yapi_build(args[3]);
  }
  console.log("没找到对应指令", args[2]);
}

