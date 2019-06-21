import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import config from '@/config'

// create an axios instance
const service = axios.create({
  baseURL: config.apiRoot, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['authorization'] = 'Bearer ' + store.getters.token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    const { code, data, msg } = res
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口 比如可能是七牛上传
      return res
    }

    switch (code) {
      case 200:
        return data
      case 401:
        Message({
          message: '登录失效',
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('LogOut')
        break
      case 403:
        Message({
          message: msg || '无权访问',
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 404:
        Message({
          message: msg || '无权访问',
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 422:
        Message({
          message: msg || '无权访问',
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 433: // 使用静态token的特定code
        Message({
          message: '当前使用的是静态token',
          type: 'warning',
          duration: 5 * 1000
        })
        throw new Error('1234')
      default:
        Message({
          message: '服务器出错',
          type: 'error',
          duration: 5 * 1000
        })
        break
    }

    return Promise.reject(false)
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
