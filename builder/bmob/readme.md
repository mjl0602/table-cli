
# TODO:解析如下格式

```json
{
  "createdAt": "创建日期",
  "updatedAt": {
    "description": "更新日期",
    "type": "string",
    "formType": "date",
    "submitType": "string",
    "defaultValue":"23135",
    "rules": "",
  }
}
```

# type：表格格式类型

null/string: 显示为普通文本

longString: 显示为保留格式的文本（pre）

tag: 显示为标签

dateTime：显示为时间+日期

date：显示为日期

time：显示为时间

timeStamp：显示为时间+日期

number/float：显示为数字

int：显示为整数

# formType：表单格式类型

null/string 普通input框

longString 多行input框

article 文章

dateTime 显示为datetime选择 提交类型默认为dateString

date 显示为date选择 提交类型默认为dateString

time 显示为time选择 提交类型默认为dateString

number/float  提交类型默认为number

step 显示为步进器 提交类型默认为int

# submitType：提交格式类型

null 不处理

string 转换为String

dateString 处理为date字符串

timeStamp 处理为毫秒数

number/float 处理为number类型

int 转换为整形




