# Table-cli
一个自动根据json对象生成element-ui表格与表单的工具，使用mixin可以直接生成对象增删查改的页面。

# Install
克隆后，全局安装即可
```
git clone https://github.com/mjl0602/table-cli.git
cd table-cli
npm install
npm install -g
```

# Usage

## 快速使用
```bash
table-cli init
```
在编辑或者添加source中的JSON文件后：
```bash
# 例如增加了一个user.json
table-cli build user
```
或者也可以
```bash
table-cli build all
```

如果需要自动添加路由，先在route/index.js中添加注释
```bash
/* cli-route */
```
然后运行
```bash
table-cli addRouter
```
该注释会被替换成生成的路由

## Standard模块

指令：`table-cli standard config`  
功能：初步生成`table-cli-config.json`文件

指令：`table-cli standard init`  
功能：初步生成table-cli文件结构，可以在此基础上修改
备注：同时会生成`config`文件

指令：`table-cli standard build #filename`  
功能：将指定的source文件夹中的同名JSON文件生成为vue-admin页面，放置在指定的pages文件夹下。

指令：`table-cli standard build all`  
功能：将指定的source文件夹中的全部JSON文件生成为vue-admin页面，放置在指定的pages文件夹下。


指令：`table-cli standard addRouter`  
功能：将`router/index.js`下的`/* cli-route */`注释替换为由当前json文件生成的vue-admin路由。
备注：使用前需要添加注释`/* cli-route */`，反复替换时，记得删除之前自动生成的路由，重新添加注释。
## Bmob

指令：`table-cli bmob config`  
功能：初步生成`table-cli-config.json`文件
注意：生成完成后记得填入`appid`与`restKey`，增加表名数组。

指令：`table-cli bmob build #filename/all`  
功能：与`standard build #filename/all`功能类似，但是额外生成`bmob`可用的查找，修改，新增，删除的操作。生成页面无需修改即可直接操作`bmob`数据库。


指令：`table-cli bmob table`  
功能：从`table-cli-config.json`文件读取表名，`appid`与`restKey`，从`Bmob`读取对应数据库表的内容，并生成对应`json`文件。随后可以使用`table-cli bmob build`继续生成页面。  
注意：表中**至少要有一条数据**，数据会被**自动翻译为中文**，请注意检查翻译是否准确，再使用`build`指令生成页面.

其他指令与`Standard`相同

## Yapi
