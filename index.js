
const { createfile, readfile, savefile, mkdir} = require('./assets/utils/operate-file.js')

let execPath = process.cwd();
let pagePath = `${execPath}/src/pages`;
let mixinPath = `${execPath}/src/mixins`;

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