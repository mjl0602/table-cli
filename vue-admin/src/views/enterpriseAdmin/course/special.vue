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
        <el-table-column label="专题图片" align="center">
          <template slot-scope="scope">
            <img v-if="Array.isArray(scope.row.banners)" :src="$cfg.getImgPath(scope.row.banners[0])" width="80px" height="80px" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column label="专题名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-tag style="cursor:pointer" @click="changeIndex(scope.row)">
              {{ scope.row.index }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="专题简介" align="center">
          <template slot-scope="scope">
            <pre style="white-space:pre-line">
              {{ scope.row.introduction }}
            </pre>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delData(scope.row)">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="editData(scope.row)">
              编辑
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
      >
        <el-form-item label="专题图片" prop="banners">
          <ttx-upload-img v-model="formData.banners" :limit="4" />
        </el-form-item>
        <el-form-item label="专题名称" prop="name">
          <el-input v-model="formData.name" place-holder="请输入专题名称" />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input v-model="formData.index" place-holder="请输入排序" />
        </el-form-item>
        <el-form-item label="专题课程">
          <el-input v-model="courseId" style="width:200px" clearable placeholder="请输入课程编号" />
          <el-button type="primary" @click="addLesson">
            添加课程
          </el-button>
          <div>
            <el-tag
              v-for="(tag,i) in addList"
              :key="tag.id||i"
              closable
              style="margin-right:10px"
              @close="reduceLesson(i,tag.id)"
            >
              <span v-if="tag">{{ `${i+1}、${tag.name} (ID:${tag.id})` }}</span>
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="专题课简介" prop="courses">
          <el-input
            v-model="formData.introduction"
            type="textarea"
            :autosize="{ minRows: 6}"
            place-holder="请输入专题简介"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Main from '../../mixins'
export default {
  mixins: [Main],
  data() {
    return {
      courseId: '',
      courseList: [], // 课程列表
      addList: [],
      objStr: '专题',
      defaultData: {
        name: '',
        index: '',
        courses: [],
        banners: [],
        introduction: '',
        id: ''
      },
      formData: {

      },
      query: {
        filterType: 0,
        searchString: ''
      },
      rules: {
        name: [{ required: false, message: '请输入专题名称', trigger: 'blur' }],
        index: [{ required: false, message: '请输入排序', trigger: 'blur' }],
        courses: [{ required: false, message: '请输入专题课程', trigger: 'blur' }],
        banners: [{ required: false, message: '请输入专题图片', trigger: 'blur' }],
        introduction: [{ required: false, message: '请输入专题简介', trigger: 'blur' }],
        id: [{ required: false, message: '请输入编号', trigger: 'blur' }]

      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)
        this.$refs.ruleForm.resetFields()
        this.courseId = ''
        this.addList = []
      }
    }
  },
  async mounted() {
    await this.getAllCourse()
    this.getData()
  },
  methods: {
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
    getData() {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/topic'
      })
    },
    async editData(row) {
      this.isNew = false
      const res = await this.$http.get('enterpriseAdmin/topic/' + row.id)
      if (res) {
        const { courses, name, index, banners, introduction, id } = res
        this.formData = { courses, name, index, banners, introduction, id }
        if (Array.isArray(res.courseList) && res.courseList.length > 0) {
          this.addList = res.courseList.map(el => {
            return { id: el.id, name: el.name }
          })
        }
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    changeIndex(row) {
      this.changeProp(row, {
        prop: 'index',
        tips: '请输入排序',
        errorMsg: '请输入整数',
        reg: /^[0-9]*[1-9][0-9]*$/,
        url: 'enterpriseAdmin/topic'
      })
    },
    delData(row) {
      this.del('enterpriseAdmin/topic')
    },
    submitForm() {
      this.submit('enterpriseAdmin/topic', this.formData)
    },
    addLesson() {
      console.log('data', this.courseList)

      const data = this.courseList.find(el => {
        console.log(el.id, this.courseId)
        // eslint-disable-next-line eqeqeq
        return el.id == this.courseId
      })
      const res = this.addList.findIndex(el => {
        return el.id === this.courseId
      })
      if (res > -1) {
        this.$notify.error('该课程不存在！')
        return
      }
      if (!data) {
        this.$notify.error('该课程不存在！')
        return
      }
      this.addList.push(data)

      this.formData.courses.push(this.courseId)
    },
    reduceLesson(i, id) {
      const index = this.formData.courses.indexOf(`${id}`)
      if (index > -1) {
        this.formData.courses.splice(index, 1)
      }
      console.log(this.formData.courses, id)

      this.addList.splice(i, 1)
    }
  }
}
</script>
