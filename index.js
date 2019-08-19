#!/usr/bin/env node
// import { getUserInput } from "./tools/input";
// 标准
const standard = require("./builder/standard/build");
// Yapi
const yapi = require("./builder/yapi/build");
// TODO: Bmob
// const { bmob_build, bmob_init } = require("./builder/bmob");

main(process.argv);

async function main(args) {
  console.log("args", args);
  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：table-cli build index.js");
    return;
  } else if (args[2] == "init") {
    /**
     * 普通 init
     */
    console.log("初始化项目");
    standard.init(args[2]);
    return;
  } else if (args[2] == "build") {
    /**
     * 普通 build
     */
    console.log("正在通过指定JSON文件创建");
    try {
      await standard.build(args[3]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  } else if (args[2] == "addrouter") {
    /**
     * 普通 build
     */
    console.log("添加路由");
    try {
      await standard.addRouter();
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  } else if (args[2] == "yp-init") {
    /**
     * YAPI init
     */
    yapi.init(args[3]);
    return;
  } else if (args[2] == "yp-build") {
    /**
     * YAPI build
     */
    try {
      await yapi.build(args[3]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  }
  console.log("没找到对应指令", args[2]);
}
