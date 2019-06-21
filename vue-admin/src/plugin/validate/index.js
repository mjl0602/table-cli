import inherit, { getRegexValidater, getFuncValidater } from './validate.js'

export default {
  install(Vue, options) {
    const getRules = (rules) => {
      const rulesArray = {}
      const ruleBuilder = (item, key) => {
        if (item.extend !== undefined) { // 继承类型
          rulesArray[key].push(Object.assign({ trigger: (item.trigger || 'blur') }, inherit[item.extend]))
        }
        if (item.regex !== undefined) { // 正则表达式
          rulesArray[key].push(Object.assign({ trigger: 'blur' }, { validator: getRegexValidater(item.regex, item.message) }, item))
        } else if (item.internal !== undefined) { // 内置类型
          rulesArray[key].push(Object.assign({ trigger: (item.trigger || 'blur'), message: (item.message || '该字段输入的信息有问题') }, inherit[item.internal]))
        } else if (item.func !== undefined) { // 函数类型
          rulesArray[key].push(Object.assign({ trigger: 'blur' }, { validator: getFuncValidater(item.func, item.message) }, item))
        } else { // 默认情况
          rulesArray[key].push(Object.assign({ trigger: 'blur' }, item))
        }
      }
      rules && Object.keys(rules).forEach(keyItem => {
        rulesArray[keyItem] = []
        if (Array.isArray(rules[keyItem]) && rules[keyItem].length > 0) { // 以数组的形式传值
          rules[keyItem].forEach(ruleItem => {
            ruleBuilder(ruleItem, keyItem)
          })
        } else if (typeof rules[keyItem] === 'object') { // 以 object 的形式传值
          ruleBuilder(rules[keyItem], keyItem)
        }
      })
      // console.log(rulesArray)
      return rulesArray
    }

    Vue.prototype.$validate = {
      getRules
    }
  }
}
