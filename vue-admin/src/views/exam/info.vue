<template>
  <el-dialog :visible.sync="infoVisible" title="查看测评">
    <el-form
      :model="formData"
      label-position="left"
      label-width="100px"
      style="min-width: 400px; margin-left:50px;"
      class="demo-ruleForm"
    >
      <el-form-item label="考试编号">
        <span>{{ formData.id }}</span>
      </el-form-item>
      <el-form-item label="考试名称" prop="name">
        <span>{{ formData.name }}</span>
      </el-form-item>
      <el-form-item label="排序" prop="index">
        <span>{{ formData.index }}</span>
      </el-form-item>
      <el-form-item label="等级设定" prop="index">
        <el-tag>A：90以上</el-tag>
        <el-tag type="success">
          B：80以上
        </el-tag>
        <el-tag type="info">
          C：70以上
        </el-tag>
        <el-tag type="warning">
          D：60以上
        </el-tag>
        <el-tag type="danger">
          F：59以下
        </el-tag>
      </el-form-item>
      <el-form-item label="题目设置" prop="questions">
        <template v-for="(item,i) in formData.questions">
          <div :key="`questions-${i}`" class="content">
            <div class="question">
              <div style="display:inline-block;width:20px">
                {{ i+1 }}、
              </div>
              <span class="exam_name">{{ item.name }}</span>
              <span>{{ item.type?'多选':'单选' }}</span>
            </div>
            <div class="answer">
              <template v-if="item.type===1">
                <div class="items">
                  <div v-for="(child,index) in item.options" :key="`child-${index}`" :class="[child.score>0?'success':'faild']">
                    <span>{{ index | toLetter }}</span>
                    <span>{{ item.options[index].name }}</span>
                    <!-- <el-input v-model="item.options[index].name" style="max-width:200px" class="tag" type="text" /> -->
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="items">
                  <div v-for="(child,index) in item.options" :key="`child-${index}`" :class="[item.answer===index?'success':'faild']">
                    <span>{{ index | toLetter }}</span>
                    <span>{{ item.options[index].name }}</span>
                    <!-- <el-input v-model="item.options[index].name" style="max-width:200px" class="tag" type="text" /> -->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-form-item>

      <el-form-item label="考试分析" class="analyze">
        <el-form-item label="A" label-width="20px">
          <pre>{{ formData.commentA }}</pre>
        </el-form-item>
        <el-form-item label="B" label-width="20px">
          <pre>{{ formData.commentB }}</pre>
        </el-form-item>
        <el-form-item label="C" label-width="20px">
          <pre>{{ formData.commentC }}</pre>
        </el-form-item>
        <el-form-item label="D" label-width="20px">
          <pre>{{ formData.commentD }}</pre>
        </el-form-item>
        <el-form-item label="E" label-width="20px">
          <pre>{{ formData.commentE }}</pre>
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="infoVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  filters: {
    toLetter(id) {
      const toEnglish = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I'
      }
      return toEnglish[id] || ''
    }
  },
  data() {
    return {
      infoVisible: false,
      formData: {
        questions: []
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .analyze{
    pre{
      margin: 0;
    }
  }
  .items{
    margin-left: 20px;
    display: flex;
    flex-flow: row wrap;
    >div{
      margin-right:20px;
      line-height: 20px;
      margin-bottom:8px;
    }
  }
  .exam_name{
    color: black;
    margin-right:40px;
  }
  .success{
    color: #409EFF;
    // font-weight: bold;
  }
  .faild{
    color:#909399;
    // color: #606266;
  }
</style>

