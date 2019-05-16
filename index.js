
const { createfile} = require('./assets/utils/operate-file.js')

let execPath = process.cwd(); // 获取命令行输入时的路径
// let pagePath = `${execPath}/src/pages`;
// let mixinPath = `${execPath}/src/mixins`;

main(process.argv);


function main(args) {
  console.log("args", args);
  if (!args[2]) {
    console.log("必须指定来源文件，命令格式：*******");
    return;
  }  else {
    createfile(args[2])
    return;
  }
  console.log("over", args[2]);
}