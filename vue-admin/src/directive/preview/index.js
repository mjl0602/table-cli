export default {
  install(Vue, options) {
    // 自定义指令 - 图片预览
    Vue.directive('preview', {
      bind: (el, binding) => {
        if (el.tagName !== 'IMG' && !binding.value) {
          return
        }
        el.onclick = (e) => {
          e.stopPropagation()
          e.preventDefault()
          const src = binding.value || el.src
          if (!src) return
          const img = new Image()
          let cover = document.createElement('div')
          img.classList.add('preview_img')
          cover.classList.add('preview_cover')
          img.src = src
          cover.appendChild(img)
          document.body.appendChild(cover)
          cover.addEventListener('click', function(ev) {
            if (ev.target === this) {
              document.body.removeChild(cover)
              cover = null
            }
          })
        }
      },
      update: (el, binding) => {
        if (el.tagName !== 'IMG' && !binding.value) {
          return
        }
        el.onclick = (e) => {
          e.stopPropagation()
          e.preventDefault()
          const src = binding.value || el.src
          if (!src) return
          const img = new Image()
          let cover = document.createElement('div')
          img.classList.add('preview_img')
          cover.classList.add('preview_cover')
          img.src = src
          cover.appendChild(img)
          document.body.appendChild(cover)
          cover.addEventListener('click', function(ev) {
            if (ev.target === this) {
              document.body.removeChild(cover)
              cover = null
            }
          })
        }
      }
    })
  }
}
