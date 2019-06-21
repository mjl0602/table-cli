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
        <el-table-column label="考试名称" align="center">
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
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="选择课程" prop="course">
          <el-select v-model="formData.courseId" style="width:100%" clearable placeholder="请选择课程">
            <el-option
              v-for="(item,i) in courseList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="题目设置" prop="questions">
          <template v-for="(item,i) in formData.questions">
            <div :key="`questions-${i}`" class="content">
              <div class="question">
                <div style="display:inline-block;width:20px">
                  {{ i+1 }}、
                </div>
                <el-input v-model="item.name" class="exam" style="width:300px" />
                <el-select v-model="item.type" @change="changeType(i)">
                  <el-option
                    v-for="(el,zIndex) in ['单选','多选']"
                    :key="el"
                    :label="el"
                    :value="zIndex"
                  />
                </el-select>
                <el-button type="success" @click="addOptions(item)">
                  增加选项
                </el-button>
                <el-button type="danger" @click="delCurrent(i)">
                  删除题目
                </el-button>
              </div>
              <div class="answer">
                <template v-if="item.type===1">
                  <template v-for="(child,index) in item.options">
                    <el-checkbox :key="`child-${index}`" v-model="child.score" style="margin-bottom:8px" @change="checkboxChange">
                      <span>{{ index | toLetter }}</span>

                      <el-input v-model="item.options[index].name" style="max-width:200px" class="tag" type="text">
                        <!-- <i slot="suffix" class="el-input__icon el-icon-close" @click="removeChild(item,index)" /> -->
                      </el-input>
                      <i class="el-icon-delete remove" @click="removeChild(item,index)" />
                    </el-checkbox>
                  </template>
                </template>
                <template v-else>
                  <el-radio-group v-model="item.answer" style="width:100%" @change="radioChange">
                    <template v-for="(child,index) in item.options">
                      <el-radio :key="`child-${index}`" :label="index" style="margin-bottom:8px">
                        <span>{{ index | toLetter }}</span>

                        <el-input v-model="item.options[index].name" style="max-width:200px" class="tag" type="text">
                          <!-- <i slot="suffix" class="el-input__icon el-icon-close" @click="removeChild(item,index)" /> -->
                        </el-input>
                        <i class="el-icon-delete remove" @click.prevent="removeChild(item,index)" />
                      </el-radio>
                    </template>
                  </el-radio-group>
                </template>
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
        <el-form-item label="考试分析">
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
      objStr: '考试',
      defaultData: {
        id: '',
        name: '',
        index: '',
        courseId: '',
        questions: [
          { type: 0, answer: '', options: [{ score: 0 }, { score: 0 }] }
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
        name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
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
    await this.getAllCourse()
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
    changeType(i) {
      const list = this.formData.questions[i].options
      list.forEach(el => {
        el.score = 0
      })
    },
    checkboxChange() {
      console.log(this.formData.questions)
    },
    radioChange(val) {
      console.log(this.formData.questions)
    },
    async getAllCourse() {
      const res = await this.$http.get('enterpriseAdmin/enterpriseCourse/all')
      if (res) {
        this.courseList = res.map(el => {
          if (el.course) {
            return { id: el.course.id, name: el.course.name }
          } else {
            return {}
          }
        })
        console.log('course', this.courseList)
      }
    },
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/exam',
        params: this.query,
        type
      })
    },
    async editData(row) {
      this.isNew = false
      const res = await this.$http.get('enterpriseAdmin/exam/' + row.id)

      if (res) {
        res.questions.forEach(el => {
          el.options.forEach(item => {
            if (el.type === 1) {
              item.score = item.score > 0
            }
          })
        })
        this.formData = res
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, JSON.parse(JSON.stringify(this.defaultData)))
      this.addDialogVisible = true
    },
    delData(row) {
      this.del(`enterpriseAdmin/exam/${row.id}`)
    },
    async scan(row) {
      const res = await this.$http.get('enterpriseAdmin/exam/' + row.id)
      if (res) {
        this.$refs.info.formData = res
        this.$refs.info.infoVisible = true
      }
    },
    submitForm() {
      let answer = false
      let tips
      const data = JSON.parse(JSON.stringify(this.formData))
      for (const el of data.questions) {
        if (!el.name) {
          tips = '请输入问题题目'
          this.$notify.error(tips)
          return false
        }
        answer = false

        for (const item of el.options) {
          if (el.type === 1) {
            if (item.score) {
              answer = true
            }
          } else {
            const index = el.answer
            if (/^[0-9]$/.test(index)) {
              answer = true
            }
          }
          console.log('answer', answer)

          if (!item.name) {
            tips = '请输入问题选项！'
            this.$notify.error(tips)
            return false
          }
        }
        if (!answer) {
          tips = '请勾选问题答案！'
          this.$notify.error(tips)
          return false
        }
      }
      data.questions.forEach(el => {
        const index = el.answer
        if (index >= 0 && /^[0-9]$/.test(index)) {
          el.options[index].score = 1
        }
        console.log('index', index)

        el.options.forEach((item, i) => {
          item.score = item.score ? 1 : 0
        })
      })
      console.log('data', data)
      this.submit('enterpriseAdmin/exam', data)
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
  .answer{
    margin-top: 10px;
    margin-left: 30px;
    >div{
      margin-bottom:5px;
      display: inline-block;
      &:not(first-child){
        margin-right:10px;
      }
    }
  }
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
  .remove{
      color:#c7c7c7;
      margin-left:8px;
      &:hover{
        color:red;
      }
    }
</style>
