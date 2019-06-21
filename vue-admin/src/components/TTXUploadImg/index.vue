<template>
  <div class="ttx-imgs-wrap">
    <template v-if="editable">
      <div v-for="(item,index) in fileList" :key="index" class="item">
        <div class="img-wrap">
          <img v-preview :src="item.url">
          <div class="operate-wrap">
            <span class="operate-update" @click="updateImg(index)">更新</span>
            <span class="operate-delete" @click="deleteImg(index)">删除</span>
          </div>
          <label v-if="item.key" class="success-upload">
            <i />
          </label>
        </div>
      </div>
      <div v-if="fileList.length < limit" class="item">
        <div class="upload-icon-wrap" @click="addImg()">
          <i class="el-icon-plus" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="(item,index) in fileList" :key="index" class="item">
        <div class="img-wrap">
          <img v-preview :src="item.url">
        </div>
      </div>
    </template>
    <input :id="'uploadImg'+Id" type="file" accept="image/*" style="display:none;" @change="imgChange($event)">
  </div>
</template>

<script>
import upload from './upload.js'

export default {
  props: {
    value: {// v-model 绑定的值
      type: Array,
      required: true
    },
    limit: { // 限制的数目
      type: Number,
      required: false,
      default: 3
    },
    editable: { // 是否可编辑,默认可编辑
      type: Boolean,
      required: false,
      default: true
    },
    autoUpload: { // 是否自动上传，默认自动上传
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    const Id = Date.now() + Math.round(Math.random() * 10000) + '' + Math.round(Math.random() * 1000)
    return {
      Id: Id,
      fileUploadUrl: this.$cfg.fileUploadUrl,
      getImgPath: this.$cfg.getImgPath,
      imgKeys: [],
      fileList: [], // {url:'',key:'',raw:''}
      handleChange: '',
      handleChangeParams: null
    }
  },
  watch: {
    value: function(val) {
      // console.log('watch-value')
      if (val.length > 0) {
        for (const item in val) {
          this.imgKeys[item] = val[item]
        }
        this.fileList = []
        this.imgKeys.forEach(item => {
          this.fileList.push({ url: this.getImgPath(item), key: item, raw: null })
        })
      } else {
        this.imgKeys.length = 0 // 清空 imgKeys 数组，并且不触发 watch-imgKeys,避免形成死循环
        this.fileList = [] // 清空 fileList 数组，并且触发试图响应
      }
    },
    imgKeys: function(val) {
      // console.log('watch-imgKeys')
      this.$emit('input', val)
      this.$emit('change')
    }
  },
  mounted() {
    for (const item in this.value) {
      this.imgKeys[item] = this.value[item]
    }
    this.fileList = []
    this.imgKeys.forEach(item => {
      this.fileList.push({ url: this.getImgPath(item), key: item, raw: null })
    })
  },
  methods: {
    // 添加图片
    addImg() {
      this.handleChange = 'handleAddImg'
      document.getElementById('uploadImg' + this.Id).click()
    },
    // 添加图片，选取到图片后的回调函数
    async handleAddImg(file) {
      if (this.autoUpload) { // 自动上传
        const imgKey = await this.$assist.uploadImgSync(file)
        // let imgKey = 'sanzang/13km1eghga2o0' // 模拟数据[mork]
        this.imgKeys.push(imgKey)
      } else {
        const fr = new FileReader()
        let url = ''
        const self = this
        fr.onload = function() {
          url = fr.result
          self.fileList.push({ url: url, key: '', raw: file })
        }
        fr.readAsDataURL(file)
      }
    },
    // 更新图片
    updateImg(index) {
      console.log('updateImg')
      this.handleChange = 'handleUpdateImg'
      this.handleChangeParams = index
      document.getElementById('uploadImg' + this.Id).click()
    },

    //  更新图片，选取到图片后的回调函数
    async handleUpdateImg(file, index) {
      if (this.autoUpload) { // 自动上传
        const imgKey = await this.$assist.uploadImgSync(file)
        // let imgKey = 'sanzang/13km1eghga2o0' // 模拟数据[mork]
        this.imgKeys.splice(index, 1, imgKey)
      } else {
        const fr = new FileReader()
        let url = ''
        const self = this
        fr.onload = function() {
          url = fr.result
          self.fileList.splice(index, 1, { url: url, key: '', raw: file })
        }
        fr.readAsDataURL(file)
      }
    },
    // 删除图片
    deleteImg(index) {
      if (this.autoUpload) { // 自动上传
        this.imgKeys.splice(index, 1)
      } else {
        this.fileList.splice(index, 1)
      }
    },
    // 选取图片
    imgChange($event) {
      const file = $event.target.files[0]
      this[this.handleChange](file, this.handleChangeParams)
      document.getElementById('uploadImg' + this.Id).value = ''
    },
    // 手动确认上传
    async submitUpload() {
      const needUploadList = this.fileList.filter(item => { return !item.key })
      let token = null
      if (needUploadList.length > 0) {
        try {
          token = await this.$http.get('upToken')
          console.log(token)
        } catch (error) {
          console.log('******')
          token = this.$cfg.staticToken
        }
      }

      // 上传图片到七牛云服务器。如果file上传成功，fileList数组里对应的file具有key属性
      await upload({ url: this.fileUploadUrl, fileArr: needUploadList, token })
      const imgKeys = []
      this.fileList.forEach(item => {
        if (item.key) {
          imgKeys.push(item.key)
        }
      })
      this.imgKeys = imgKeys
    }
  }
}
</script>

<style lang="scss" scoped>
.ttx-imgs-wrap{
  display: flex;
  flex-wrap: wrap;
  line-height: 0;

  .item{
    position: relative;
    padding: 0 10px 10px 0;

  }

  .img-wrap{
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    img{
      width: 140px;
      height: 140px;
      cursor: pointer;
      border-radius: 6px;
    }
    .operate-wrap{
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      width: 100%;
      overflow: hidden;
      left: 0;
      bottom: 0;
      height: 0;
      font-size: 0px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;

      transition: height .3s ease;
      .operate-update{
        cursor: pointer;
        color: #66b1ff;
      }
      .operate-delete{
        cursor: pointer;
        color: rgb(253, 42, 42);
      }
    }
    &:hover .operate-wrap{
      font-size: 14px;
      height: 40px;
      background: rgba(0, 0, 0, 0.6);
    }
  }
  .upload-icon-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 140px;
    width: 140px;
    font-size: 28px;
    font-weight: 400;
    color: #8c939d;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
    cursor: pointer;
    &:hover{
      border: 1px dashed #66b1ff;
    }
  }

  .success-upload{
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    i{
      color: #fff;
      font-family: element-icons!important;
      font-size: 12px;
      margin-top: 11px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      &::before{
        content: "\E611";
      }
    }
  }
  .noselect{ // 使文字不可以选择
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
