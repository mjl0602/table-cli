<template>
  <div class="ttx-directive-upload-demo">
    <section>
      <p>情况一：v-upload:arg 模式 ,其中arg为变量名</p>
      <el-button ref="btn" v-upload:key1>
        点击上传
      </el-button>
      <div>key1:{{ key1 }}</div>
      <img :src="$cfg.getImgPath(key1)" alt="">
    </section>

    <section>
      <p>情况二：使用回调函数模式：v-upload="{success:function(key,{name,size,suffix,duration}){},maxSize:2*124*1024,type:'*' }"</p>
      <el-button v-upload="{success,maxSize:2*124*1024,type:'*'}">
        点击上传
      </el-button>
      <div>key2:{{ key2 }}</div>
      <img :src="$cfg.getImgPath(key2)" alt="">
    </section>

    <section>
      <p>情况三：同时使用以上两种模式： v-upload:key1="{success}" </p>
      <el-button v-upload:key1="{success}">
        点击上传
      </el-button>
    </section>

    <section>
      <p>情况四：在数组中使用，借助 参数params，该参数会在回调的时候用到 " </p>
      <div v-for="(item,index) in keys" :key="item.name+index">
        <el-button v-upload="{success:successTwo,params:item}">
          点击上传
        </el-button>
        key:{{ item.key }}
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key1: '',
      key2: '',
      keys: [{ key: '', name: 'name1' }, { key: '', name: 'name2' }, { key: '', name: 'name3' }]
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.btn.value = '111'
    }, 1000)
  },
  methods: {
    success(key, { name, size, suffix, duration }) {
      this.key2 = key
      console.log('success-callback：', key, name, size, suffix, duration)
    },
    successTwo(key, data, params) {
      params.key = key
      console.log('successTwo-callback：', key, params)
    }
  }
}
</script>
