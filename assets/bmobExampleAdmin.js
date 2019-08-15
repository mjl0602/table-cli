import AdminObject from "@/table-api/adminobject";

const tableName = '##tableName##'

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
  static async all(q) {
    let query = Bmob.Query(tableName);
    let count = await query.count();
    if (q.page && q.pageSize) {
      query.skip(q.pageSize * (q.page - 1));
      query.limit(q.pageSize);
    }

    query.order("-createdAt");
    let list = await query.find();
    return {
      total: count,
      data: list,
    };
  }

  // 上传修改
  static async edit(obj) {
    let bq = Bmob.Query(tableName);
    let res = await bq.get(obj.objectId);
    /** edit */
    return res.save();
  }

  // 添加
  static async add(obj) {
    let res = Bmob.Query(tableName);
    /** add */
    return res.save();
  }

  // 删除
  static async deleteObj(obj) {
    let bq = Bmob.Query(tableName);
    return bq.destroy(obj.objectId);
  }
}
