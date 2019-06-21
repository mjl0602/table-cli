import axios from 'axios'
import config from '@/config'

// 创建标识符
function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

export default {
  install(Vue, options) {
    // 上传单张图片
    function uploadImgSync(file) {
      return new Promise(async(resolve, reject) => {
        let token
        try {
          token = await Vue.prototype.$http.get('upToken')
          console.log(token)
        } catch (error) {
          token = config.staticToken
        }
        const formData = new FormData()
        formData.append('token', token)
        formData.append('file', file)
        formData.append('key', config.imgPrefix + createUniqueString())
        axios({ method: 'post', url: Vue.prototype.$cfg.fileUploadUrl, data: formData, withCredentials: false, headers: { 'Content-Type': 'multipart/form-data' }})

          .then(
            res => {
            // console.log(res.key)
              resolve(res.data.key)
            },
            err => {
              console.error(err)
              reject(err)
            }
          )
      })
    }

    // 处理时间
    function dateFormatter(date, fmt) {
      date = new Date(date)
      if (!date.getDate()) {
        return '请输入正确的时间'
      }
      fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          const len = k === 'S' ? 3 : ('' + o[k]).length
          // const len = k === 'S' ? 3 : 2;
          if (k === 'S') {
            fmt = fmt.replace(RegExp.$1, ('0000' + o[k]).slice(-len))
          } else {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(len)))
          }
        }
      }
      return fmt
    }

    // 十六进制颜色转RGB
    function hexToRgb(hex, opacify) {
      var rgb = []

      hex = hex.substr(1)// 去除前缀 # 号

      if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
        hex = hex.replace(/(.)/g, '$1$1')
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10))// 按16进制将字符串转换为数字
      })

      return opacify !== undefined && typeof (opacify) === 'number' ? 'rgba(' + rgb.join(',') + ',' + opacify + ')' : 'rgb(' + rgb.join(',') + ')'
    }

    // 标签的颜色
    function getTagStyle(color) {
      const tagStyle = {
        display: 'inline-block',
        padding: ' 0 10px',
        height: '32px',
        lineHeight: '30px',
        fontSize: '12px',
        borderRadius: '4px',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap'
      }
      const isHexColor = /[0-9a-fA-F]{6}/.test(color)
      tagStyle.backgroundColor = isHexColor ? hexToRgb('#' + color, 0.1) : 'transparent'
      tagStyle.color = isHexColor ? ('#' + color) : 'transparent'
      tagStyle.border = isHexColor ? ('1px solid ' + hexToRgb('#' + color, 0.2)) : 'none'
      return tagStyle
    }

    // 获取按钮颜色
    function getBtnStyle(color, size = 'small') {
      const btnStyle = getTagStyle(color)
      btnStyle.border = 'none'
      btnStyle.marginTop = '2px'
      btnStyle.marginBottom = '2px'
      if (size === 'small') {
        return btnStyle
      }

      if (size === 'medium') {
        btnStyle.height = '40px'
        btnStyle.lineHeight = '40px'
        btnStyle.fontSize = '14px'
        return btnStyle
      }
    }

    // 将秒数处理成 xx时xx分xx秒
    function formatSeconds(value) {
      var secondTime = parseInt(value || 0)// 秒
      var minuteTime = 0// 分
      var hourTime = 0// 小时
      if (secondTime > 59) {
        minuteTime = parseInt(secondTime / 60)
        secondTime = parseInt(secondTime % 60)
        if (minuteTime > 59) {
          hourTime = parseInt(minuteTime / 60)
          minuteTime = parseInt(minuteTime % 60)
        }
      }
      var result = '' + parseInt(secondTime) + '秒'

      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + '分' + result
      }
      if (hourTime > 0) {
        result = '' + parseInt(hourTime) + '时' + result
      }
      return result
    }

    // 上传音频、视频文件
    const uploadAVSync = async(file) => {
      const key = await uploadImgSync(file)
      if (!key) return false
      return new Promise(async(resolve, reject) => {
        axios({ method: 'get', url: Vue.prototype.$cfg.getImgPath(key) + '?avinfo', withCredentials: false }).then(
          res => {
            console.log(res)
            resolve({ key, duration: Math.floor(res.data.format.duration) })
          },
          err => {
            console.error(err)
            reject(err)
          }
        )
      })
    }

    // 清空数据: string=''、 array=[]、 boolean=false、 number=0
    function clear(data) {
      if (Array.isArray(data)) { // 数组类型
        data = []
      } else if (typeof data === 'object' && data) { // 对象类型
        Object.keys(data).forEach(keyName => {
          if (typeof data[keyName] === 'string') { // 字符串类型
            data[keyName] = ''
          } else if (typeof data[keyName] === 'number') { // 数值类型
            data[keyName] = 0
          } else if (typeof data[keyName] === 'boolean') { // 布尔类型
            data[keyName] = false
          } else { // 递归
            clear(data[keyName])
          }
        })
      }
    }
    const assist = {
      uploadImgSync, // 单个上传图片
      dateFormatter, // 时间格式化
      hexToRgb, // 16进制转rgb
      getTagStyle, // 获取 tag 样式
      getBtnStyle, // 获取 按钮 样式
      formatSeconds, // 格式化秒数
      uploadAVSync, // 音频和视频上传
      clear
    }

    Vue.prototype.$assist = assist
  }
}
