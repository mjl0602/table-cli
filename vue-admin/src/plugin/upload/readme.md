# v-upload 上传指令
## 1.指令格式：
```typescript
  v-upload:arg="{ 
      success: (key:string, data: {name:string, size:number, suffix:string, duration:number }, params:Object )=>void , 
      maxSize:number ,
      type:(string | string[]), 
      params:Object 
    }"
```
+ ```arg```:将会把成功上传七牛后获得的key值给名为 arg 的变量
+ ```success```: 上传成功之后的回调函数
  1.第一个函数参数 key 是上传七牛之后获得的key值，
  2.第二个参数 data 是关于上传的文件的一些信息：文件名称（不包括后缀名）、文件大小（单位B）、后缀名、时长（当文件是视频和音频类型，就有时长）
  3.第三个参数是 调用者传递给回调函数的参数列表，该参数在 v-for 循环时，将有大作用
+ ```maxSize``` 允许文件上传的最大大小，单位是B
+ ```type``` 允许上传的文件类型，默认是 type=['image', 'video', 'audio'] ,即支持 图片、视频、音频，type既可以是string类型也可以是string类型数组，将会覆盖默认值。实际上，type=['image', 'video', 'audio'] 将会使得生成的原生上传元素为 ```<input type='file' accept='image/*,video/*,audio/*'>```，所以，若是要想可以上传所有的文件类型，则 ``` type='*' ```
+ ```params``` 与```success```里面的```params```变量是同一个，专门传递给```success```回调函数的参数

## 2.指令的使用：
#### 简介：v-upload 指令是为了上传单个文件（图片、视频、音频等）而实现的，使用时主要是有两种模式：v-upload:arg 模式 和 回调函数模式：v-upload="{success}"，该指令可以添加在div、span、p等基本元素标签或者是组件上。以下是 4种基本情形：
### （1）v-upload:arg 模式 ,其中arg为变量名
```html
  <section>
    <el-button v-upload:key1>
      点击上传
    </el-button>
    <div>key1:{{ key1 }}</div>
    <img :src="$cfg.getImgPath(key1)" alt="">
  </section>
```
```javascript
  data() {
    return {
      key1: '',
    }
  }
```
### （2）使用回调函数模式：v-upload="{success}"
```html
  <section>
    <el-button v-upload="{success,maxSize:2*124*1024,type:'*'}">
      点击上传
    </el-button>
    <div>key2:{{ key2 }}</div>
    <img :src="$cfg.getImgPath(key2)" alt="">
  </section>
```
```javascript
  data() {
    return {
      key2: '',
    }
  },
  methods:{
    success(key, { name, size, suffix, duration }) {
      this.key2 = key
      console.log('success-callback：', key, name, size, suffix, duration)
    }
  }
```
### (3)同时使用以上两种模式： v-upload:key1="{success}"
```html
  <section>
    <el-button v-upload:key1="{success}">
      点击上传
    </el-button>
  </section>
```
```javascript
  data() {
    return {
      key1: '',
      key2: '',
    }
  },
  methods:{
    success(key, { name, size, suffix, duration }) {
      this.key2 = key
      console.log('success-callback：', key, name, size, suffix, duration)
    }
  }
```
### (4)在数组中使用，借助 参数params，该参数会在回调的时候用到 
```html
  <section>
    <div v-for="(item,index) in keys" :key="item.name+index">
      <el-button v-upload="{success:successTwo,params:item}">
        点击上传
      </el-button>
      key:{{ item.key }}
    </div>
  </section>
```
```javascript
  data() {
    return {
      keys: [{ key: '', name: 'name1' }, { key: '', name: 'name2' }, { key: '', name: 'name3' }]
    }
  },
  methods:{
    successTwo(key, data, params) {
      params.key = key
      console.log('successTwo-callback：', key, params)
    }
  }
```
## 3.指令依赖：
1. 同在plugin文件夹下的assist插件的 ```uploadImgSync``` 和 ```uploadAVSync``` 这两个方法分别用来上传图片和上传音频、视频文件到七牛云上。要确保这两个方法是可行的。

## 4.后续要进行的工作：
- [ ] 实现错误提示，目前只是抛出错误到控制台上
- [ ] 未测试，上传图片到七牛云失败的情形
- [ ] 未知的bug测试和使用

## 5.指令更新记录
+ 2019/3/24: 初步实现该指令