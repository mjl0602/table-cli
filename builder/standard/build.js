// 文件操作
const { file, find, savefile, mkdir, exists } = require("../../tools/file");

// 模板字符
const { row, input } = require("../../tools/builder");



let execPath = process.cwd();
let srcPath = `${execPath}/src`;

function assetsPath() {
  let p = `${__dirname}/../../public`;
  console.log(p);
  return p;
}
let pages_path = "table-pages";
let source_path = "table-source";
/**
 * onCommand 主入口
 */
async function onCommand(command, value) {
  await config();
  console.log(`Standart 执行命令:${command} 参数:${value}`);
  try {
    if (command == "init") {
      init();
    }
    if (command == "addRouter") {
      addRouter();
    }
    if (command == "build") {
      if (value == "all") {
        await buildAll();
      } else {
        await buildFileName(value);
      }
    }
    if (command == "config") {
    }
  } catch (error) {
    console.log(error);
  }
}

async function config() {
  let config;
  if (exists(`${process.cwd()}/table-cli-config.json`)) {
    console.log("读取现有config");
    config = require(`${process.cwd()}/table-cli-config.json`);
  } else {
    console.log("创建一个默认config");
    config = require("./assets/table-cli-config.json");
    let configContent = await file(`${assetsPath()}/table-cli-config.json`);
    await savefile(`${process.cwd()}/table-cli-config.json`, configContent);
  }
  console.log(`使用config:`, config);
  pages_path = config.path.pages_path || pages_path;
  source_path = config.path.source_path || source_path;
}

/**
 * init功能，可以创建用于示例的文件夹
 *
 */
async function init() {
  await mkdir("src");
  await mkdir(`src/${pages_path}`);
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
  let exampleArticle = await file(`${__dirname}/assets/article.json`);
  await mkdir(`src/${source_path}`);
  await savefile(`${srcPath}/${source_path}/article.json`, exampleArticle);
  // build一次example
  await build("article");
  console.log("init 完成");
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

  let table = "";
  let form = "";
  let defaultObject = "";
  let rules = "";

  for (const key in tempObject) {
    if (tempObject.hasOwnProperty(key)) {
      let element = tempObject[key];
      if (element instanceof Object) {
        element = element.description;
      }
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
  pageTemplate = pageTemplate.replace("/** property */", defaultObject);
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
 *
 */
async function addRouter() {
  let pathList = find(`${srcPath}/${source_path}/`);
  let routerCode = "/* cli-route-insert */\n";
  for (const filePath of pathList) {
    let fileName = filePath.substring(
      filePath.lastIndexOf("/") + 1,
      filePath.length,
    );
    fileName = fileName.replace(".json", "");
    // 添加路由代码
    routerCode += `{
    path: "",
    component: Layout,
    redirect: "${fileName}",
    children: [
      {
        path: "${fileName}",
        component: () => import("@/${pages_path}/${fileName}Manage.vue"),
        name: "${fileName}",
        meta: { title: "${fileName}", icon: "table", noCache: true },
      },
    ],
  },
  `;
  }
  let routeTemplate = await file(`${srcPath}/router/index.js`);
  routeTemplate = routeTemplate.replace("/* cli-route */", routerCode);
  console.log(routeTemplate);
  await savefile(`${srcPath}/router/index.js`, routeTemplate);
}

module.exports = {
  onCommand,
};
