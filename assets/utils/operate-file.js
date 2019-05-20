const fs = require('fs');
const path = require('path');
// 解析路径
function resolvePath(url){
    return path.join(__dirname,url);
}
// 读取 公共mixins
async function readMixin(){
    let path = resolvePath('../template/mixins.js')
    let data = await readfile(path)
    return data
}
// 读取 私有mixins
async function readPrivateMixin(){
    let path = resolvePath('../template/mixin_per.js')
    let data = await readfile(path)
    return data
}
// 读取初始模板
async function readIndex(){
    let path = resolvePath('../template/index.vue')
    let data = await readfile(path)
    return data
}
// 读取表格列模板
async function readTable(){
    let path = resolvePath('../template/table-template.html')
    let data = await readfile(path)
    return data
}
// 读取表单项模板
async function readForm(){
    let path = resolvePath('../template/form-template.html')
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
                console.error(err);
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
 
    if(fs.existsSync(path)){
        console.log(path + '已存在')
        
    }else{
        fs.mkdirSync(path)
        console.log(path + ' 创建成功')
    }
    
} 
async function jsontohtml({json,path,target,type,topPath}){
    // var json_files = files.filter((f)=>{
    //     return f.endsWith('.json');
    // });
    let commonMixin = await readMixin()
    mkdir(resolvePath(`../../${target}/src`))
    mkdir(resolvePath(`../../${target}/src/views`))
    mkdir(resolvePath(`../../${target}/src/views/mixins`))
    savefile(resolvePath(`../../${target}/src/views/mixins/index.js`),commonMixin); // 公共mixin  

    for(var f of json){
        var requirePath = topPath?`${path}/${topPath}/${f}`:`${path}/${f}`
        let jsonObj = require(requirePath);
        // 生成 table-column
        let table_html = ''
        if(jsonObj.table){
            for(var key in jsonObj.table){
                let data = await readTable(); // 表格的列
                let res = data.replace(/@@@/g,jsonObj.table[key]['description']).replace(/###/g,key);
                table_html += res  
            }
        }
        
        let form_html = ''
        let defaultForm= ''
        let defaultRules = ''
        // 生成 el-form-item
        if(jsonObj.form){
            for(var key in jsonObj.form){
                let data = await readForm(); // 表单项
                let res = data.replace(/@@@/g,jsonObj.form[key]['description']).replace(/###/g,key);
                form_html += res  
                defaultForm += `${key}: '', \n  `
                defaultRules += `${key}:[{ required: true, message: "请输入${jsonObj.form[key]['description']}", trigger: "blur" }], \n`
            }
        }
        let per_fileName = f.split('.')[0]
        let template = await readIndex(); // 初始模板
        
        let perMixin = await readPrivateMixin()
        perMixin = perMixin.replace(/\/\/<!-- formData insert -->/,defaultForm).replace(/\/\/<!-- rules insert -->/,defaultRules)
        let produce = template.replace(/<!-- tabel-column insert -->/,table_html)
                            .replace(/<!-- form-item insert -->/,form_html)
                            .replace(/@per@/g,`${per_fileName}Mixin`)
        
        if(type === 'file'){
            produce = produce.replace(/@f@/g,`${per_fileName}Mixin`)
            mkdir(resolvePath(`../../${target}/src/views/${per_fileName}`));  
            savefile(resolvePath(`../../${target}/src/views/${per_fileName}/index.vue`),produce); // 模板生成 
            savefile(resolvePath(`../../${target}/src/views/mixins/${per_fileName}Mixin.js`),perMixin);
        }else{
            produce = produce.replace(/@f@/g,`${topPath}/${per_fileName}Mixin`)
            savefile(resolvePath(`../../${target}/src/views/mixins/${topPath}/${per_fileName}Mixin.js`),perMixin);
            savefile(resolvePath(`../../${target}/src/views/${topPath}/${per_fileName}.vue`),produce); // 模板生成 
        }
         

    }
}
// 读取模板
async function createfile(path,target='example'){
    var files = fs.readdirSync(path);// 读取目录下所有json文件
    if(files.length<1){
        console.log('该文件夹为空')
        return
    }
  
    let commonMixin = await readMixin()
    mkdir(resolvePath(`../../${target}`))
    mkdir(resolvePath(`../../${target}/src`))
    mkdir(resolvePath(`../../${target}/src/views`))
    mkdir(resolvePath(`../../${target}/src/views/mixins`))
    savefile(resolvePath(`../../${target}/src/views/mixins/index.js`),commonMixin); // 公共mixin  
    var json_files = files.filter((f)=>{
        return f.endsWith('.json');
    });
    if(json_files.length>0){
        jsontohtml({
            json:json_files,
            path,
            target,
            type:'file'
        })
    }
    try{
        for(var i=0;i<files.length;i++){
            res = await fs.statSync(path+'/'+files[i]);
             
            if(res.isDirectory()){
                var datafiles = fs.readdirSync(path+'/'+files[i]);
                mkdir(resolvePath(`../../${target}/src/views/${files[i]}`))
                mkdir(resolvePath(`../../${target}/src/views/mixins/${files[i]}`))
                var data_files = datafiles.filter((f)=>{
                    return f.endsWith('.json');
                });
                console.log(data_files,'`````')
               
                if(data_files.length>0){
                    jsontohtml({
                        json:data_files,
                        path,
                        target,
                        type:'directory',
                        topPath: files[i]
                    })
                }
            }
            
            
 
        }
    }catch{
        console.log('该文件不存在！！！')
        return 
    }
}

module.exports = {
    createfile
}