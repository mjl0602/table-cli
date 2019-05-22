import AdminObject from '@/table-api/adminobject'

export default class Example extends AdminObject {
  // 默认的内容
  static defaultObject = {
    title: '',
    content: '',
    readCount: ''

  };

  // 表单规则
  static rules = {
    title: [{ required: true, message: '必填', trigger: 'blur' }],
    content: [{ required: true, message: '必填', trigger: 'blur' }],
    readCount: [{ required: true, message: '必填', trigger: 'blur' }]

  };

  /**
   * 【查询全部】
   * 如果返回数组对象，则页面不翻页，
   * 如果返回{total:88,data:[]}对象，
   * 则页面出现翻页标签。
   *
   * */
  // static async all(query) {
  // }

  // // 上传修改
  // static async edit(obj) {
  // }

  // // 添加
  // static async add(obj) {
  // }

  // // 删除
  // static async deleteObj(obj) {
  // }
}
