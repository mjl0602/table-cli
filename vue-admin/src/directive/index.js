// 功能插件

import pluginPreview from './preview'
export default {
  async install(Vue, options) {
    // 插件
    Vue.use(pluginPreview)
  }
}
