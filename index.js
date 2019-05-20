
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
    if(!args[3]){
      console.log("必须指定项目所在文件，命令格式：*******");
      return;
    }
    createfile(args[2],args[3])
    return;
  }
  console.log("over", args[2]);
}