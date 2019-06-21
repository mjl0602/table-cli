// 功能插件
import pluginAssist from '@/plugin/assist'
import pluginPreview from '@/plugin/preview'
import pluginUpload from '@/plugin/upload'
import lazyload from '@/plugin/lazyload'
import pluginValidate from '@/plugin/validate'

export default {
  async install(Vue, options) {
    // 插件
    Vue.use(pluginAssist)
    Vue.use(pluginPreview)
    Vue.use(pluginUpload)
    Vue.use(pluginValidate)
    Vue.use(lazyload)
  }
}
