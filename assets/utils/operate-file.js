const fs = require('fs');
const path = require('path');
// 解析路径
function resolvePath(url){
    return path.join(__dirname,url);
}
// 读取 公共mixins
async function readMixin(){
    let path = resolvePath('../template/mixins.js')
    console.log('path',__dirname)
    let data = await readfile(path)
    return data
}
// 读取 私有mixins
async function readPrivateMixin(){
    let path = resolvePath('../template/mixin_per.js')
    console.log('path',__dirname)
    let data = await readfile(path)
    return data
}
// 读取初始模板
async function readIndex(){
    let path = resolvePath('../template/index.vue')
    console.log('path',__dirname)
    let data = await readfile(path)
    return data
}
// 读取表格列模板
async function readTable(){
    let path = resolvePath('../template/table-template.html')
    console.log('path',__dirname)
    let data = await readfile(path)
    return data
}
// 读取表单项模板
async function readForm(){
    let path = resolvePath('../template/form-template.html')
    console.log('path',__dirname)
    let data = await readfile(path)
    return data
}

// 读取文件
function readfile(path){
    // fs.stat(path, function (err, stats) {
    // if (err) {
    //     return console.error(err);
    // }
    // console.log(stats);
    // console.log("读取文件信息成功！");
    // // 检测文件类型
    // console.log("是否为文件(isFile) ? " + stats.isFile());
    // console.log("是否为目录(isDirectory) ? " + stats.isDirectory());
    return new Promise((resolve,reject)=>{
        // utf8 读取出的的是string 不加读取的是数据流--buffer
            fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                return console.error(err);
                reject(err)
            }
            resolve(data)
        });
    })  
}
// 写入文件
function savefile(path,data){
    return new Promise((resolve,reject)=>{
        fs.writeFile(path,data, function (err, data) {
            if (err) {
                 console.error(err);
                reject(err)
            }
            resolve(data)
        });
    })  
}

//2. fs.mkdir  创建目录 
function mkdir(path){
    fs.exists(path,function(exist){
        console.log('exist',exist)
        if(exist) return
        return new Promise((resolve,reject)=>{
            fs.mkdir(path,function(error){
                if(error){
                    console.log(error);
                    reject(false);
                }
                resolve(true)
                console.log(path+'创建目录成功');
            })
        })
    })
    
} 
// 读取模板
async function createfile(path){
    
    var files = fs.readdirSync(path);// 读取目录下所有json文件
    var js_files = files.filter((f)=>{
        return f.endsWith('.json');
    });
   
    for(var f of js_files){
        let jsonObj = require(path+'/'+f);
        // 生成 table-column
        let table_html = ''
        for(var key in jsonObj.table){
            let data = await readTable(); // 表格的列
            let res = data.replace(/@@@/g,jsonObj.table[key]).replace(/###/g,key);
            table_html += res  
        }
        let form_html = ''
        let defaultForm= ''
        let defaultRules = ''
        for(var key in jsonObj.form){
            let data = await readForm(); // 表单项
            let res = data.replace(/@@@/g,jsonObj.form[key]).replace(/###/g,key);
            form_html += res  
            defaultForm += `${key}: '', \n  `
            defaultRules += `${key}:[{ required: true, message: 请输入${jsonObj.form[key]}, trigger: "blur" }]`
        }
        let per_fileName = f.split('.')[0]
        let template = await readIndex(); // 初始模板
        let produce = template.replace(/<!-- tabel-column insert -->/,table_html)
                            .replace(/<!-- form-item insert -->/,form_html)
                            .replace(/@mixin@/g,`${per_fileName}_mixin`)
        let commonMixin = await readMixin()
        let perMixin = await readPrivateMixin()
        perMixin = perMixin.replace(/\/\/<!-- formData insert -->/,defaultForm).replace(/\/\/<!-- rules insert -->/,defaultRules)
        await mkdir(resolvePath('/pages'))  // 先创建文件夹
        await mkdir(resolvePath('/pages/mixins'))
        
            await savefile(resolvePath(`/pages/mixins/${per_fileName}_mixin.js`),perMixin);     // 每个页面的mixin
            await savefile(resolvePath('/pages/mixins/index.js'),commonMixin); // 公共mixin   
            await savefile(resolvePath(`/pages/${per_fileName}.vue`),produce); // 模板生成  
        
        
    }
}

module.exports = {
    createfile,
    readfile,
    savefile,
    mkdir
}