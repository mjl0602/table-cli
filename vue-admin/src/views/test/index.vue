<template>
  <div class="app-container">
    <el-header>
      <el-button type="primary" @click="addData">
        新 增
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="测评名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-tag @click="changeIndex(scope.row)">
              {{ scope.row.index }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delData(scope.row)">
              删除
            </el-button>
            <el-button type="primary" size="mini" @click="editData(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="mini" @click="scan(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>

    <!-- 编辑 -->
    <el-dialog :visible.sync="addDialogVisible" :before-close="handleClose" :title="dialogTitle">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="min-width: 400px; margin-left:50px;"
        class="demo-ruleForm"
      >
        <el-form-item v-if="!isNew" label="编号">
          <span>{{ formData.id }}</span>
        </el-form-item>
        <el-form-item label="测评名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入测评名称" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" placeholder="请输入排序" />
        </el-form-item>
        <!-- <el-form-item label="选择课程" prop="course">
          <el-select v-model="formData.courseId" style="width:100%" clearable placeholder="请选择课程">
            <el-option
              v-for="(item,i) in courseList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="题目设置" prop="questions">
          <template v-for="(item,i) in formData.questions">
            <div :key="`questions-${i}`" class="content">
              <div class="question">
                <div style="display:inline-block;width:20px">
                  {{ i+1 }}、
                </div>
                <el-input v-model="item.name" class="test" style="width:300px" />

                <el-button type="success" size="mini" @click="addOptions(item)">
                  增加选项
                </el-button>
                <el-button type="danger" size="mini" @click="delCurrent(i)">
                  删除题目
                </el-button>
              </div>
              <div class="answer">
                <div class="items">
                  <div v-for="(child,index) in item.options" :key="`child-${index}`" :class="[item.answer===index?'success':'faild']">
                    <span>{{ index | toLetter }}</span>
                    <el-input v-model="item.options[index].name" style="max-width:200px" placeholder="问题选项" />
                    <el-input v-model.number="item.options[index].score" style="width:60px" placeholder="分数" />
                    <i class="el-icon-delete remove" @click="removeChild(item,index)" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="action">
            <el-button type="primary" @click="addQuestion">
              新增题目
            </el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item label="题目总分" prop="grade">
          <el-input v-model="formData.grade" placeholder="请输入题目总分" />
        </el-form-item> -->
        <el-form-item label="测评分析">
          <el-form-item label="A" class="analyze" label-width="20px">
            <el-input
              v-model="formData.commentA"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入分析"
            />
          </el-form-item>
          <el-form-item label="B" class="analyze" label-width="20px">
            <el-input
              v-model="formData.commentB"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入分析"
            />
          </el-form-item>
          <el-form-item label="C" class="analyze" label-width="20px">
            <el-input
              v-model="formData.commentC"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入分析"
            />
          </el-form-item>
          <el-form-item label="D" class="analyze" label-width="20px">
            <el-input
              v-model="formData.commentD"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入分析"
            />
          </el-form-item>
          <el-form-item label="E" class="analyze" label-width="20px">
            <el-input
              v-model="formData.commentE"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入分析"
            />
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <info-page ref="info" />
  </div>
</template>
<script>
import infoPage from './info'
import Main from '../mixins'
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
  components: {
    infoPage
  },
  mixins: [Main],
  data() {
    return {
      objStr: '测评',
      defaultData: {
        id: '',
        name: '',
        index: '',
        questions: [
          { type: 0, options: [{ score: 0 }, { score: 0 }] }
        ],
        commentA: '',
        commentB: '',
        commentC: '',
        commentD: '',
        commentE: ''
      },
      formData: {

      },
      courseList: [{}],
      query: {
        filterType: 0,
        searchString: ''
      },
      rules: {
        name: [{ required: true, message: '请输入测评名称', trigger: 'blur' }],
        index: [{ required: true, validator: this.validInteger, trigger: 'blur' }],
        courseId: [{ required: true, message: '请输入选择课程', trigger: 'change' }]

      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = JSON.parse(JSON.stringify(this.defaultData))

        this.$refs.ruleForm.resetFields()
      }
    }
  },
  async mounted() {
    this.getData()
  },
  methods: {
    changeIndex(row) {
      this.changeProp(row, {
        prop: 'index',
        tips: '请输入排序',
        errorMsg: '请输入整数',
        reg: /^[0-9]*[1-9][0-9]*$/,
        url: 'enterpriseAdmin/test'
      })
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/test',
        params: this.query,
        type
      })
    },
    async editData(row) {
      this.isNew = false
      const res = await this.$http.get('enterpriseAdmin/test/' + row.id)
      if (res) {
        this.formData = res
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = JSON.parse(JSON.stringify(this.defaultData))
      this.addDialogVisible = true
    },
    delData(row) {
      this.del(`enterpriseAdmin/test/${row.id}`)
    },
    async scan(row) {
      const res = await this.$http.get('enterpriseAdmin/test/' + row.id)
      if (res) {
        this.$refs.info.formData = res
        this.$refs.info.infoVisible = true
      }
    },
    submitForm() {
      let tips
      const data = JSON.parse(JSON.stringify(this.formData))
      for (const el of data.questions) {
        if (!el.name) {
          tips = '请输入问题题目'
          this.$notify.error(tips)
          return false
        }

        for (const item of el.options) {
          if (!item.name) {
            tips = '请输入问题选项！'
            this.$notify.error(tips)
            return false
          }
        }
      }
      this.submit('enterpriseAdmin/test', data)
    },
    // 删除选项
    removeChild(item, index) {
      if (item.options.length > 2) {
        item.options.splice(index, 1)
      } else {
        return this.$notify.error('至少保留两个选项')
      }
    },
    // 删除题目
    delCurrent(i) {
      const data = this.formData.questions
      if (data.length > 1) {
        data.splice(i, 1)
      } else {
        this.$message.warning('至少保留一个题目！')
      }
    },
    // 新增选项
    addOptions(item) {
      if (item.options.length < 8) {
        item.options.push({ score: 0 })
      } else {
        this.$message.warning('已超出最大限制！')
        return
      }
    },
    addQuestion() {
      this.formData.questions.push({ name: '', options: [{ score: 0 }, { score: 0 }], type: 0 })
    }
  }
}
</script>
<style lang="less" scoped>

  .demo-ruleForm{
    .content:not(first-child){
      margin-bottom:10px;
    }
    .action{
      margin:50px 0 0 20px;
      text-align: center;
    }
  }
  .analyze{
    margin-bottom:10px;
  }
  .items{
    margin-left: 20px;
    margin-top:10px;
    display: flex;
    flex-flow: row wrap;
    .remove{
      color:#c7c7c7;
      margin-left:8px;
      &:hover{
        color:red;
      }
    }
    >div{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      margin-right:20px;
      line-height: 20px;
      margin-bottom:8px;
      >div{
        margin-left:5px;
      }
    }
  }
</style>
