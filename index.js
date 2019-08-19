#!/usr/bin/env node
// import { getUserInput } from "./tools/input";
// 标准
const standard = require("./builder/standard/build");
// Yapi
const yapi = require("./builder/yapi/build");
// TODO: Bmob
const bmob = require("./builder/bmob/build");

main(process.argv);

async function main(args) {
  // 读取config

  console.log("args", args);

  /**
   * 快捷方法
   */
  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：table-cli build index.js");
    return;
  } else if (args[2] == "init") {
    /**
     * 普通 init
     */
    console.log("初始化项目");
    standard.onCommand("init");
    return;
  } else if (args[2] == "build") {
    /**
     * 普通 build
     */
    console.log("正在通过指定JSON文件创建");
    try {
      await standard.onCommand("build", args[3]);
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
      await standard.onCommand("addrouter");
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  }

  /*
   * 非默认值的情况 TODO: 增加多种build指令
   */
  if (args[2] == "standard") {
    /**
     * 普通 build
     */
    console.log("添加路由");
    try {
      await standard.onCommand(args[3], args[4]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  } else if (args[2] == "yapi") {
    /**
     * TODO: YAPI command
     */
    // 45牛逼
  } else if (args[2] == "bmob") {
    try {
      await bmob.onCommand(args[3], args[4]);
    } catch (error) {
      console.log(error);
      console.log("\n\nbuild发生错误，是否忘记init?\n");
    }
    return;
  }

  console.log("没找到对应指令", args[2]);
}
