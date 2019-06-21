const uploadConfig = {
  maxSize: 5 * 1024 * 1024, // 文件大小,默认最大为5MB
  type: ['image', 'video', 'audio'] // 默认支持图片、视频、音频
}

export default {
  install(Vue, options) {
    Vue.directive('upload', {
      bind: function(el, binding, vnode) {
        console.log(el)
        const modelName = binding.arg
        const { success = null } = binding.value || {}
        const { maxSize = uploadConfig.maxSize } = binding.value || {}
        let { type = uploadConfig.type } = binding.value || {}
        const { params } = binding.value || {}
        // 参数校验
        if (!success && !modelName) { // 回调模式和v-upload:arg，至少选择一种模式上传
          throw (new Error('Please provide a callback function(named "success") or use v-upload:arg to capture the key returned after the uploaded file succeeds.'))
        }
        if (modelName && typeof vnode.context[modelName] !== 'string') { // v-upload:arg 绑定的值类型需要是 string 类型
          throw (new Error(`Type-error: the type of '${modelName}' is expected to be string type,but get ${Array.isArray(vnode.context[modelName]) ? 'Array[]' : typeof vnode.context[modelName]}`))
        }
        if (success && typeof success !== 'function') { // success : ( key,{name?,size?,suffix?,duration?} )=> void
          throw (new Error('Type-error: the type of "success"  is expected to be a function that shaped like (key,{name?,size?,suffix?,duration?})=> void '))
        }
        if (typeof type !== 'string' && !Array.isArray(type)) { // type: (string | string [] )
          throw (new Error(`Type-error: the type of "type"  is expected to be  string or string [],but get ${typeof type}`))
        } else if (typeof type === 'string') {
          type = [type]
        }
        if (typeof maxSize !== 'number') { // maxSize: number
          throw (new Error(`Type-error: the type of "maxSize"  is expected to be number,but get ${typeof maxSize}`))
        }
        // 创建上传按钮对象 input[type='file']
        el.inputElement = document.createElement('input')
        el.inputElement.type = 'file'
        el.inputElement.id = Date.now() + '' + Math.round(Math.random() * 10000)
        el.inputElement.style = { display: 'none' }
        el.inputElement.accept = type.map(item => `${item}/*`).join(',')
        // 点击触发上传事件
        el.onclick = (e) => {
          e.stopPropagation()
          e.preventDefault()
          el.inputElement.click()
        }
        // 监听onchange事件，实现上传
        const onchange = async($event) => {
          const file = $event.target.files[0]
          const nameTemp = file.name.split('.')
          const fileName = nameTemp.slice(0, nameTemp.length - 1).join('.')
          const suffix = nameTemp[nameTemp.length - 1]
          const fileType = file.type.split('/')[0]
          // 文件格式校验
          if (!type.includes(fileType)) {
            el.inputElement.value = ''
            throw (new Error(`File Type Error: the type of file uploaded is expected to be one of [${type.join('、')}],but get ${fileType}`))
          }
          // 文件大小检查
          if (file.size > maxSize) {
            el.inputElement.value = ''
            throw (new Error(`File Size Error: the size of file is not more than ${maxSize / (1024 * 1024)}MB,but get ${file.size / (1024 * 1024)}MB`))
          }
          // 视频或是音频的上传
          if (['video', 'audio'].includes(fileType)) {
            const res = await Vue.prototype.$assist.uploadAVSync(file)
            el.inputElement.value = ''
            if (modelName) { // 使用了 v-upload:arg ,更新 arg 绑定的值
              vnode.context[modelName] = res.key
            }
            if (success) { // 使用了回调函数的情况
              const data = {
                name: fileName,
                size: file.size,
                suffix,
                duration: res.duration
              }
              // 调用成功上传之后的回调函数
              success(res.key, data, params)
            }
          } else if (fileType === 'image') { // 图片上传
            const key = await Vue.prototype.$assist.uploadImgSync(file)
            el.inputElement.value = ''
            if (modelName) { // 使用了 v-upload:arg ,更新 arg 绑定的值
              vnode.context[modelName] = key
            }
            if (success) { // 使用了回调函数的情况
              const data = {
                name: fileName,
                size: file.size,
                suffix,
                duration: 0
              }
              // 调用成功上传之后的回调函数
              success(key, data, params)
            }
          }
        }
        el._onchange = onchange
        el.inputElement.addEventListener('change', el._onchange, false)
      },
      unbind: function(el, binding) {
        el.removeEventListener('change', el._onchange, false)
        delete el._onchange
        delete el.inputElement
      }
    })
  }
}
