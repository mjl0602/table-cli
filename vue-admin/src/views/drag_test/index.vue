<template>
  <div class="card_container">
    <div
      v-for="(item,index) in dataArr"
      :key="item.id"
      ondragstart="return false"
      class="card"
      :style="[cardTransform(index),indexTransform(index)]"
      @touchstart.stop.capture="touchStart($event,index)"
      @touchmove.stop.capture="touchMove($event,index)"
      @touchend.stop.capture="touchEnd($event,index)"
      @mousedown.stop.capture="touchStart($event)"
      @mousemove.stop.capture="touchMove($event)"
      @mouseup.stop.capture="touchEnd"
      @transitionend="onTransitionEnd(index)"
    >
      {{ index }}
    </div>
    <!--

     -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataArr: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      // 当前展示的图片index
      currentIndex: 0,
      // 记录偏移量
      displacement: {
        x: 0,
        y: 0
      },
      // 位置信息
      position: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        direction: 1, // 滑动方向，左是-1，右是1
        swipping: false // 是否在拖动交换过程中
      },
      // 记录每一个丢出去的方向
      directionArr: [],
      // 显示图片的堆叠数量
      visible: 4,
      // 视口宽度
      winWidth: 0,
      //  滑动阈值
      slideWidth: 70,
      // 超过阈值时的自动偏移量
      offsetWidth: 120
    }
  },
  methods: {
    // 初始化每张卡片的样式
    cardTransform(index) {
      const style = {}
      // 卡片自动位移距离（飞出屏幕多远）
      let offset = 0
      if (this.directionArr[index] === 1) {
        offset = 800
      } else if (this.directionArr[index] === -1) {
        offset = -800
      }

      style['z-index'] = this.currentIndex - index + this.visible
      style['transform'] = `translate3d(0,0,${(this.currentIndex - index) * 100}px)`
      // 让藏在后面的卡片缩小样式堆叠在一起并透明不显示。一旦飞走一张，下一张卡片会自动过渡动画往前推进
      if (index - this.currentIndex < 0) {
        style['opacity'] = 0
        style['transform'] = `translate3d(${this.position.end.x + offset}px,${this.position.end.y}px,${(this.currentIndex - index) * 60}px) rotate(${this.position.direction * -65}deg)`
      }

      // 非手势滑动状态才添加过渡动画
      if (!this.position.swipping) {
        style['transitionTimingFunction'] = 'ease'
        style['transitionDuration'] = 300 + 'ms'
      }

      return style
    },
    // 第一张卡片的样式
    indexTransform(index) {
      const style = {}
      if (index === this.currentIndex) {
        style['transform'] = `translate3d(${this.displacement.x}px,${this.displacement.y}px,${(this.currentIndex - index) * 60}px) rotate(${this.displacement.x / this.winWidth * -65}deg)`
      }
      // 非手势滑动状态才添加过渡动画
      if (!this.position.swipping) {
        style['transitionTimingFunction'] = 'ease'
        style['transitionDuration'] = 300 + 'ms'
      }

      return style
    },
    touchMove(e, index) {
      const x = e.offsetX
      const y = e.offsetY
      this.position.end = { x, y }
      this.position.direction = 1
      e.target.style.transform = `translate3d(${this.position.end.x}px,${this.position.end.y}px,${(this.currentIndex) * 60}px) rotate(${this.position.direction * -65}deg)`
      console.log((index))
    },
    touchStart(e) {
      const x = e.offsetX
      const y = e.offsetY
      this.position.start = { x, y }
      console.log(e.offsetX)
    },
    touchEnd() {

    },
    onTransitionEnd() {

    }

  }
}
</script>

<style scoped>
  .card_container {
    margin: 100px;
    position: relative;
    width: 200px;
    height: 200px;
    perspective: 1000px;
    perspective-origin: 50% 150%;
    -webkit-perspective: 1000px;
    -webkit-perspective-origin: 50% 150%;
  }
.card {
  transform-style: preserve-3d;
  width: 100%;
  height: 100%;
  text-align:center;
  position: absolute;
  opacity: 1;
}
.card_container>div:nth-child(1){
  background:red;
}
.card_container>div:nth-child(2){
  background: blue;
}
.card_container>div:nth-child(3){
  background: yellow;
}
.card_container>div:nth-child(4){
  background: green;
}
</style>
