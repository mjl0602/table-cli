/**
 * @description  内置类型(internal)或继承类型(extend)
 *
 */

export function getRegexValidater(regex, msg) {
  let timeout = null
  return (rule, value, callback) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (!regex.test(value)) {
        callback(new Error(msg))
      } else {
        callback()
      }
    }, 500)
  }
}

export function getFuncValidater(cb, msg) {
  let timeout = null
  return (rule, value, callback) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (!cb(value)) {
        callback(new Error(msg))
      } else {
        callback()
      }
    }, 500)
  }
}
// 内置类型(internal)或继承类型(extend)
const validateDefault = {
  'require': { required: true, message: '该字段不能为空' }, // 非空类型校验
  'tel': { validator: getRegexValidater(/^1(3|4|5|7|8)\d{9}$/, '请输入正确的手机号码') }, // 手机号码校验
  'email': { validator: getRegexValidater(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, '请输入正确的邮箱') }, // 邮箱校验
  'checkbox': { type: 'array', required: true, trigger: 'change' },
  'require-array': { type: 'array', required: true, trigger: 'change' },
  'num': { type: 'number', trigger: 'blur', message: '请输入整数', required: true } // v-model.number
}

export default validateDefault
