import AdminObject from "@/api/adminobject";

export default class Example extends AdminObject {
  // 默认的内容
  static defaultObject = {
    /** property */
  };

  // 表单规则
  static rules = {
    /** rules */
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
