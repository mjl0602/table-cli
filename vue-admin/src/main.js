import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/components'
import directive from '@/directive'

import App from './App'
import store from './store'
import router from './router'
import axios from './utils/axios'

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

// import * as filters from './filters' // global filters
import config from '@/config'
import plugins from './plugin'

Vue.use(plugins)
Vue.prototype.$cfg = config
Vue.use(directive)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
