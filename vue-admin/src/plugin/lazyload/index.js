
// test
const initData = {
  default: 'https://gw.alicdn.com/tps/i1/TB147JCLFXXXXc1XVXXxGsw1VXX-112-168.png',
  listenList: [],
  imageCatcheList: []
}
const isAlredyLoad = imageSrc => {
  if (initData.imageCatcheList.indexOf(imageSrc) > -1) {
    return true
  } else {
    return false
  }
}
// 检测图片是否可以加载，如果可以则进行加载
const isCanShow = item => {
  if (isAlredyLoad(src)) {
    return true
  }
  const { el, src, height } = item
  // 图片距离页面顶部的距离
  var top = el.getBoundingClientRect().top
  // 页面可视区域的高度
  // var windowHeight = window.innerHight
  // top + 10 已经进入了可视区域10像素s
  if (top + 10 < height) {
    var image = new Image()
    image.src = src
    image.onload = function() {
      el.src = src

      initData.imageCatcheList.push(src)

      // listenList.remove(item)
      initData.listenList.forEach((el, index) => {
        if (el.src === item.src) {
          initData.listenList.splice(index, 1)
        }
      })
    }

    return true
  } else {
    return false
  }
}
const onListenScroll = () => {
  window.addEventListener('scroll', function() {
    console.log('init', initData)
    var length = initData.listenList.length
    for (let i = 0; i < length; i++) {
      isCanShow(initData.listenList[i])
    }
  })
}

export default {
  install(Vue, options) {
    Vue.directive('lazyload', {
      inserted: function(el, binding) {
        console.log(binding.value)
        // 绑定的图片地址
        var imageSrc = binding.value
        // 如果已经加载过，则无需重新加载，直接将src赋值
        if (isAlredyLoad(imageSrc)) {
          el.src = imageSrc
          return false
        }
        var item = {
          el: el,
          src: imageSrc,
          height: window.innerHeight
        }
        // 图片显示默认的图片
        el.src = initData.default
        // // 先将图片地址和元素均放入监听的lisenList里
        initData.listenList.push(item)
        // 再看看是否可以显示此图片
        if (isCanShow(item)) {
          return
        }

        // // 然后开始监听页面scroll事件
        onListenScroll()
      },
      updated: function(el, binding) {
        console.log('update')
        // 绑定的图片地址
        var imageSrc = binding.value
        // 如果已经加载过，则无需重新加载，直接将src赋值
        if (isAlredyLoad(imageSrc)) {
          el.src = imageSrc
          console.log('init', initData)
          console.log('src', imageSrc)
          return false
        }

        var item = {
          el: el,
          src: imageSrc,
          height: window.innerHeight
        }
        // 图片显示默认的图片
        el.src = initData.default
        // 再看看是否可以显示此图片
        if (isCanShow(item)) {
          return
        }

        // // 否则将图片地址和元素均放入监听的lisenList里
        initData.listenList.push(item)

        // // 然后开始监听页面scroll事件
        onListenScroll()
      }
    })
  }
}
