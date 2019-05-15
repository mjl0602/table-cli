import AdminObject from "@/api/adminobject";

export default class Example extends AdminObject {
  // 默认的内容
  static defaultObject = {
    flownumber:"",
    ordertime:"",
    money:"",
    status:"",
    name:"",
    tel:"",
    address:"",
    sendtimestart:"",
    sendtimeend:"",
    borntype:"",
    foodtype:"",
    tooltype:"",
    require:"",
    noeat:"",
    attention:"",
    diabetes:"",
    sendtime:"",
    mark:"",
    
  };

  // 表单规则
  static rules = {
    flownumber:[{ required: true, message: "必填", trigger: "blur" }],
    ordertime:[{ required: true, message: "必填", trigger: "blur" }],
    money:[{ required: true, message: "必填", trigger: "blur" }],
    status:[{ required: true, message: "必填", trigger: "blur" }],
    name:[{ required: true, message: "必填", trigger: "blur" }],
    tel:[{ required: true, message: "必填", trigger: "blur" }],
    address:[{ required: true, message: "必填", trigger: "blur" }],
    sendtimestart:[{ required: true, message: "必填", trigger: "blur" }],
    sendtimeend:[{ required: true, message: "必填", trigger: "blur" }],
    borntype:[{ required: true, message: "必填", trigger: "blur" }],
    foodtype:[{ required: true, message: "必填", trigger: "blur" }],
    tooltype:[{ required: true, message: "必填", trigger: "blur" }],
    require:[{ required: true, message: "必填", trigger: "blur" }],
    noeat:[{ required: true, message: "必填", trigger: "blur" }],
    attention:[{ required: true, message: "必填", trigger: "blur" }],
    diabetes:[{ required: true, message: "必填", trigger: "blur" }],
    sendtime:[{ required: true, message: "必填", trigger: "blur" }],
    mark:[{ required: true, message: "必填", trigger: "blur" }],
    
  };

  /** 
   * 【查询全部】
   * 如果返回数组对象，则页面不翻页，
   * 如果返回{total:88,data:[]}对象，
   * 则页面出现翻页标签。
   * 
   * */
  // static all(query) {
  // }

  // // 上传修改
  // static edit(obj) {
  // }

  // // 添加
  // static add(obj) {
  // }

  // // 删除
  // static deleteObj(obj) {
  // }
}
