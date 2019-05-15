# table-cli
一个自动根据json对象生成element-ui表格与表单的工具，使用mixin可以直接生成对象增删查改的前段页面。

# install
在本项目文件夹下，全局安装
```
git clone https://github.com/mjl0602/table-cli.git
cd table-cli
npm install -g
```

# usage
先cd到项目文件夹，使用
```
table-cli init
```
在table-source文件夹中，增加对象,例如user.json，然后
```
table-cli build user
```
