// 文件操作
const { file, find, savefile, mkdir, exists, rm } = require("../../tools/file");

// 模板字符
const { row, input, date } = require("../../tools/builder");

const { loadZhValue } = require("./tr");

const Bmob = require("hydrogen-js-sdk");

let pages_path = "table-pages";
let source_path = "table-source";

let execPath = process.cwd();
let srcPath = `${execPath}/src`;

let tableList = [];
let ignoreList = [];
let appid = "";
let restfulKey = "";

const { BmobBuilder } = require("./bmobBuilder");

function assetsPath() {
  let path = `${__dirname}/../../public`;
  console.log(path);
  return path;
}
async function config() {
  let config;
  if (exists(`${process.cwd()}/table-cli-config.json`)) {
    console.log("读取现有config");
    // config = require(`${process.cwd()}/table-cli-config.json`);
  } else {
    console.log("创建一个默认config");
    let configContent = await file(`${__dirname}/assets/table-cli-config.json`);
    await savefile(`${process.cwd()}/table-cli-config.json`, configContent);
  }
  config = require(`${process.cwd()}/table-cli-config.json`);
  console.log(`使用config:`, config);
  pages_path = config.path.pages_path || pages_path;
  source_path = config.path.source_path || source_path;
  let bmob = config.bmob;
  if (bmob) {
    tableList = bmob.tables;
    appid = bmob.appid;
    restfulKey = bmob.restfulKey;
    ignoreList = bmob.ignore;
  }
}
/**
 * onCommand 主入口
 */
async function onCommand(command, value) {
  console.log(`Standart 执行命令:${command} 参数:${value}`);
  await config();
  try {
    if (command == "table") {
      table(value);
    }
    if (command == "config") {
      console.log(
        `bmob config 已应用:\n${tableList}\nAppid:${appid}\nRestfulKey:${restfulKey}`,
      );
    }
    if (command == "addRouter") {
      // addRouter();
    }
    if (command == "build") {
      if (value == "all") {
        await buildAll();
      } else {
        await buildFileName(value);
      }
    }
    if (command == "clear") {
      rm(`${srcPath}/${source_path}/`);
      rm(`${srcPath}/${pages_path}/`);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * table功能，可以创建用于示例的文件夹
 */
async function table(value) {
  if (!appid) {
    console.log("缺少appid");
  }
  if (!restfulKey) {
    console.log("缺少restfulKey");
  }
  Bmob.initialize(appid, restfulKey);
  if (value) {
    tableList = [value];
  }
  for (const tableName of tableList) {
    let query = Bmob.Query(tableName);
    query.limit(1);
    let resList = await query.find();
    if (resList.length == 0) {
      console.log(`ERROR: ${tableName} 表中需要先写入一个对象`);
      continue;
    }
    let res = resList[0];
    let target = {};
    for (const key in res) {
      //TODO: 考虑数据类型不是String的情况
      let value = res[key];
      if (typeof value == "number") {
        target[key] = {
          type: "number",
          description: key,
        };
      } else {
        target[key] = value;
      }
    }
    target = await loadZhValue(target);
    await mkdir(`${srcPath}`);
    await mkdir(`${srcPath}/${source_path}`);
    await savefile(
      `${srcPath}/${source_path}/${tableName}.json`,
      JSON.stringify(target, null, 2),
    );
  }
}

// build全部文件
async function buildAll() {
  let pathList = find(`${srcPath}/${source_path}/`);
  for (const filePath of pathList) {
    await buildFilePath(filePath);
  }
  console.log("全部创建完成");
}

/**
 * 通过文件名来创建相关的表格
 * @param {String} fileName - json文件名，会通过该json来生成
 * 例如table-cli build user就是创建user的表格
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

  let target = new BmobBuilder();
  console.log("tempObject", tempObject);
  for (const key in tempObject) {
    if (tempObject.hasOwnProperty(key)) {
      let config = tempObject[key];
      if (typeof config == "string") {
        config = {
          type: "string",
          description: config,
        };
      }
      if (ignoreList.indexOf(key) >= 0) {
        console.log("跳过保留字段", key);
      } else {
        console.log(`\n======== 添加 ${key} ========\nConfig:`, config);
        target.add(key, config);
      }
    }
  }
  // 创建页面
  let pageTemplate = await file(`${__dirname}/assets/template.vue`);
  pageTemplate = pageTemplate.replace(/##filename##/g, fileName);
  pageTemplate = pageTemplate.replace("##tableName##", fileName);
  pageTemplate = pageTemplate.replace("<!-- table insert -->", target.table);
  pageTemplate = pageTemplate.replace("<!-- form insert -->", target.form);
  pageTemplate = pageTemplate.replace("/** property */", target.defaultObject);
  pageTemplate = pageTemplate.replace("/** rules */", target.rules);
  pageTemplate = pageTemplate.replace("/** edit */", target.edit);

  await mkdir("src");
  await mkdir(`src/${pages_path}`);
  await savefile(
    `${srcPath}/${pages_path}/${fileName}Manage.vue`,
    pageTemplate,
  );
  console.log("保存文件完成\n");
  return;
}

module.exports = {
  onCommand,
};
