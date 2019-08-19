const fs = require('fs');
const path = require('path');
let router = ''
const reg = /\/\/[\s\S]*生成路由开始([\s\S]*)(.*)([\s\S]*)\/\/[\s\S]*生成路由结束/
// // 路由
async function readRouter(){
    let path = resolvePath('../template/router.js')
    let data = await readfile(path)
    return data
}
// 路由父组件
async function readFatherRouter(){
    let path = resolvePath('../template/routerFather.js')
    let data = await readfile(path)
    return data
}
// 路由子组件
async function readChildRouter(){
    let path = resolvePath('../template/routerChild.js')
    let data = await readfile(path)
    return data
}



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
                console.error('o(╯□╰)o---1');
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
                console.error('o(╯□╰)o---2');
                reject(err)
            }
            resolve(data)
        });
    })  
}

//2. fs.mkdir  创建目录 
  function mkdir(path){
    console.log('path',path)
    if(fs.existsSync(path)){
        // console.log(path + '已存在')

    }else{
        fs.mkdirSync(path)
        // console.log(path + ' 创建成功')
    }
    
} 
async function jsontohtml({json,path,target,type,topPath}){
  
    let routerChild = await readChildRouter();
    let routerFather = await readFatherRouter();
    let childData = ''
    // let fatherData = ''
    let routerData = ''
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
                defaultRules += `${key}:[{ required: false, message: "请输入${jsonObj.form[key]['description']}", trigger: "blur" }], \n`
            }
        }
        let per_fileName = f.split('.')[0]
        let template = await readIndex(); // 初始模板
        
        // let perMixin = await readPrivateMixin()
        // perMixin = perMixin.replace(/\/\/<!-- formData insert -->/,defaultForm).replace(/\/\/<!-- rules insert -->/,defaultRules)
        let produce = template.replace(/<!-- tabel-column insert -->/,table_html)
                            .replace(/<!-- form-item insert -->/,form_html)
                            // .replace(/@per@/g,`${per_fileName}Mixin`)
                            .replace(/\/\/<!-- formData insert -->/,defaultForm)
                            .replace(/\/\/<!-- rules insert -->/,defaultRules)
        if(type === 'file'){
           
            childData = routerChild + '\n'
            childData = childData.replace(/ChildPath/,`'index'`)
                                .replace('UniquePath',`'${per_fileName}_index'`)
                                .replace('/FatherPath/ChildPath',`/${per_fileName}/index`)
            console.log('per_fileName',per_fileName)                  
            routerData = routerFather.replace('FatherPath',`'/${per_fileName}'`).replace('uniqueChild',childData)
            router += routerData + '\n'
            
            // console.log(`'/${per_fileName}'`,routerData)
            produce = produce.replace(/@f@/g,`${per_fileName}Mixin`)
            mkdir(`${target}/src/views/yp-auto/${per_fileName}`);
            if(!fs.existsSync(`${target}/src/views/yp-auto/${per_fileName}/index.vue`)){  
                savefile(`${target}/src/views/yp-auto/${per_fileName}/index.vue`,produce); // 模板生成 
                
            }
        }else{
            // savefile(`${target}/src/views/mixins/${topPath}/${per_fileName}Mixin.js`,perMixin);
            childData += routerChild + '\n'
            childData = childData.replace(/ChildPath/,`'${per_fileName}'`)
                                .replace('UniquePath',`'${topPath}_${per_fileName}'`)
                                .replace('/FatherPath/ChildPath',`/${topPath}/${per_fileName}`)
            if(!fs.existsSync(`${target}/src/views/yp-auto/${topPath}/${per_fileName}.vue`)){  
                savefile(`${target}/src/views/yp-auto/${topPath}/${per_fileName}.vue`,produce); // 模板生成 
            }
        }
    }
    
    
    if(type !== 'file'){
        routerData = routerFather.replace('FatherPath',`'/${topPath}'`).replace('uniqueChild',childData)
        router += routerData + '\n'

    }
    

    // router += routerData + '\n'
    
}
// 读取模板
async function createfile(path,target){
    
    var files = fs.readdirSync(path);// 读取目录下所有json文件
    if(files.length<1){
        console.log('该文件夹为空')
        return
    }
  
    let commonMixin = await readMixin()
    // mkdir(resolvePath(`${target}`))
    // mkdir(resolvePath(`${target}/src`))
    // mkdir(resolvePath(`${target}/src/views`))
    // mkdir(resolvePath(`${target}/src/views/mixins`))
    // savefile(resolvePath(`${target}/src/views/mixins/index.js`),commonMixin); // 公共mixin  
    mkdir(`${target}`)
    mkdir(`${target}/src`)
    mkdir(`${target}/src/views`)
    mkdir(`${target}/src/mixins`)
    mkdir(`${target}/src/router`)
    mkdir(`${target}/src/views/yp-auto`);
    let Router 
    let aimData
    try{
        Router =  await readfile(`${target}/src/router/index.js`)
    }catch{
        Router = await readRouter()
    }
     try{
        aimData = reg.exec(Router)[1]
     }catch{
         console.log('请设置路由生成位置')
         return
     }


    if(!fs.existsSync(`${target}/src/mixins/auto_mixin.js`)){  
        savefile(`${target}/src/mixins/auto_mixin.js`,commonMixin); // 公共mixin  
    }
    var json_files = files.filter((f)=>{
        return f.endsWith('.json');
    });
    if(json_files.length>0){
        await jsontohtml({
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
                mkdir(`${target}/src/views/yp-auto/${files[i]}`)
                // mkdir(`${target}/src/views/mixins/${files[i]}`)
                var data_files = datafiles.filter((f)=>{
                    return f.endsWith('.json');
                });
                console.log(data_files,'`````')
               
                if(data_files.length>0){
                    await jsontohtml({
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
    
    let data = Router.replace(aimData,'\n'+router+'\n')
    savefile(`${target}/src/router/index.js`,data)
    console.log('写入路由完成')
}



module.exports = {
    createfile
}