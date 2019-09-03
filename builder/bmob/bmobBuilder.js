/// @@@ 将会被替换为key
/// ### 会被替换成description

// 表格
function tableTemp(config) {
  let type = config.type || "string";
  // 表格
  const table = {
    // 在表格内显示为文字
    string: `
    <el-table-column label="@@@" align="center">
      <template slot-scope="scope">
        {{scope.row.###}}
      </template>
    </el-table-column>`,
    // 显示为日期
    timeStamp: `
    <el-table-column label="@@@" align="center">
      <template slot-scope="scope">
        {{new Date(scope.row.###).toLocaleString()}}
      </template>
    </el-table-column>`,
  };
  return table[type] || table["string"];
}

// 表单
function formTemp(config) {
  let type = config.formType || "string";
  const form = {
    string: `
    <el-form-item label="@@@" prop="###">
      <el-input v-model="row.###" placeHolder="请输入@@@"/>
    </el-form-item>`,
    date: `
    <el-date-picker
      v-model="row.###"
      align="right"
      type="date"
      placeholder="选择@@@"
      :picker-options="datePickOption"
      ></el-date-picker>`,
    dateTime: `
    <el-date-picker
      v-model="row.###"
      type="datetime"
      placeholder="选择@@@"
      align="right"
      :picker-options="datePickOption">
    </el-date-picker>`,
    time: `
    <el-time-picker
      arrow-control
      v-model="value2"
      :picker-options="{
        selectableRange: '18:30:00 - 20:30:00'
      }"
      placeholder="任意时间点">
    </el-time-picker>`,
  };
  return form[type] || `<!-- Unknown Type:${type} -->\n`;
}

// 默认值
function defaultValueTemp(config) {
  // 如果有默认值，确定默认值
  if (config.defaultValue) {
    if (config.defaultValue instanceof String) {
      return `###:"${config.defaultValue}",\n    `;
    }
    return `###:${config.defaultValue},\n    `;
  }
  let type = config.formType || "";
  const defaultValue = {
    string: `###:"",\n    `,
    date: `###:new Date(),\n    `,
    number: `###:0,\n    `,
  };
  return defaultValue[type] || `// Unknown Type:${type}\n`;
}

// 上传前的格式化
function editTemp(config) {
  let type = config.submitType || "";
  const defaultValue = {
    string: `res.set("###", obj.###)\n    `,
    date: `res.set("###", new Date(obj.###))\n    `,
    number: `res.set("###", parseFloat(obj.###))\n    `,
    float: `res.set("###", parseFloat(obj.###))\n    `,
    int: `res.set("###", parseInt(obj.###))\n    `,
  };
  return defaultValue[type] || "";
}
// 表单规则
function ruleTemp() {
  return `###:[{ required: true, message: "必填", trigger: "blur" }],\n    `;
}

// 辅助类，用于添加对应文本等
module.exports.BmobBuilder = function() {
  this.table = "";
  this.form = "";
  this.defaultValue = "";
  this.edit = "";
  this.rules = "";
  this.add = function(key, config) {
    let property = key;
    let label = config.description;

    this.table += tableTemp(config)
      .replace(/###/g, property)
      .replace(/@@@/g, label);

    this.form += formTemp(config)
      .replace(/###/g, property)
      .replace(/@@@/g, label);

    this.defaultValue += defaultValueTemp(config)
      .replace(/###/g, property)
      .replace(/@@@/g, label);

    this.edit += editTemp(config)
      .replace(/###/g, property)
      .replace(/@@@/g, label);

    this.rules += ruleTemp(config)
      .replace(/###/g, property)
      .replace(/@@@/g, label);
  };
};
