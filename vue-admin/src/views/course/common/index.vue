<template>
  <div class="app-container course">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="课程编号/姓名/老师姓名" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="课程编号" :value="0" />
          <el-option label="课程名称" :value="1" />
          <el-option label="老师名称" :value="2" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <el-select v-model="query.cClass" clearable placeholder="请选择分类" @change="getData">
        <el-option
          v-for="(item,i) in options"
          :key="i"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-select v-if="type===3" v-model="query.department" clearable placeholder="岗位筛选" @change="getData">
        <el-option
          v-for="(item,i) in departments"
          :key="i"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-button v-if="type===1" type="primary" @click="addData">
        新增课程
      </el-button>
      <router-link v-if="type===2" :to="{name: 'courseplatform'}">
        <el-button type="primary">
          新增课程
        </el-button>
      </router-link>

      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="课程编号" align="center">
          <template slot-scope="scope">
            {{ type===2?scope.row.courseId:scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="课程简介" min-width="300px">
          <template slot-scope="scope">
            <div class="courseInfo">
              <div class="left">
                <img v-preview :src="$cfg.getImgPath(scope.row.banners[0])" width="80" height="80">
              </div>
              <div class="right">
                <div><span>课程名称：</span>{{ scope.row.name }}</div>
                <div><span>老师编号：</span>{{ scope.row.teacherId }}</div>
                <div><span>课程老师：</span>{{ scope.row.teacher?scope.row.teacher.name:'' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属岗位" align="center">
          <template slot-scope="scope">
            {{ Array.isArray(scope.row.department)?scope.row.department.toString():'' }}
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            {{ Array.isArray(scope.row.classes)?scope.row.classes.toString():'' }}
          </template>
        </el-table-column>
        <el-table-column label="课程学分" align="center">
          <template slot-scope="scope">
            {{ scope.row.credit }}
          </template>
        </el-table-column>
        <el-table-column v-if="type===3" label="是否添加" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAdded?'success':'danger'">
              {{ scope.row.isAdded?'已添加':'未添加' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="type!==3" label="上/下架" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOnline"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeIsOnline(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button v-if="type!==3" type="danger" size="mini" @click="delData(scope.row)">
              删除
            </el-button>
            <el-button v-if="type===3&&scope.row.isAdded" type="danger" size="mini" @click="delData(scope.row)">
              取消添加
            </el-button>
            <el-button v-if="type===3&&!scope.row.isAdded" type="success" size="mini" @click="addCourse(scope.row)">
              添加至课程
            </el-button>
            <el-button v-if="type===1" type="primary" size="mini" @click="editData(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="mini" @click="scanData(scope.row)">
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
    <el-dialog :visible.sync="addDialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类" prop="name">
          <el-select v-model="formData.classes" style="width:100%" multiple placeholder="请选择分类">
            <el-option
              v-for="(item,i) in options"
              :key="i"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程学分" prop="credit">
          <el-input v-model="formData.credit" placeholder="请输入课程学分" />
        </el-form-item>
        <el-form-item label="课程老师" prop="teacherId">
          <el-select v-model="formData.teacherId" style="width:100%" placeholder="请选择老师">
            <el-option
              v-for="(item,i) in teachers"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" prop="banners">
          <ttx-upload-img ref="banners" v-model="formData.banners" :limit="5" :auto-upload="false" />
        </el-form-item>

        <el-form-item label="所属岗位" prop="department">
          <el-select v-model="formData.department" style="width:100%" multiple placeholder="请选择岗位">
            <el-option
              v-for="(item,i) in departments"
              :key="i"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上线状态" prop="isOnline">
          <el-switch
            v-model="formData.isOnline"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <el-form-item label="课时" prop="chapters">
          <div>
            <el-button type="primary" style="margin-bottom:10px" @click="addLesson">
              增加课时
            </el-button>
          </div>
          <el-table :data="formData.chapters" border fit>
            <el-table-column label="编号" align="center">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="课时名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="课时名称" />
              </template>
            </el-table-column>
            <el-table-column label="上传附件" align="center">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  :action="$cfg.fileUploadUrl"
                  :limit="1"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :on-success="handleSuccess"
                  :before-upload="beforeVideoUpload"
                  :data="upData"
                  accept="video/*,audio/*"
                  :file-list="scope.row.file"
                >
                  <el-button size="small" type="primary" @click="currentIndex=scope.$index">
                    点击上传
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column label="播放时长" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.file[0]?parseSecond(scope.row.file[0].duration):'' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delLesson(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="课程内容" prop="detail">
          <tinymce ref="detail" v-model="formData.detail" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <course-info ref="info" :teachers="teachers" />
  </div>
</template>
<script>
import axios from 'axios'
import { createUniqueString, parseSecond } from '@/utils'
import { validInteger } from '@/utils/validate'
import courseInfo from './courseInfo'
import Main from '../../mixins'
const lesson = {
  name: '',
  file: []
}
export default {
  components: {
    courseInfo
  },
  mixins: [Main],
  props: {
    urls: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      query: {
        filterType: 0,
        searchString: '',
        cClass: '',
        department: ''
      },
      currentIndex: null,
      deleteId: [],
      upData: {},
      objStr: '课程',
      teachers: [{}], // 所有老师
      departments: [{}], // 所有岗位
      options: [{}], // 所有分类
      defaultData: {
        id: '',
        name: '',
        teacherId: '',
        banners: [],
        totalHours: '',
        department: [],
        credit: '',
        isOnline: true,
        detail: '',
        chapters: [],
        classes: [],
        departments: []

      },
      formData: {

      },
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        teacherId: [{ required: false, message: '请选择课程老师', trigger: 'change' }],
        banners: [{ required: false, message: '请输入上传图片', trigger: 'change' }],
        department: [{ required: false, message: '请选择课程岗位', trigger: 'change' }],
        classes: [{ required: false, message: '请选择课程分类', trigger: 'change' }],
        credit: [{ required: false, validator: validInteger, trigger: 'blur' }],
        isOnline: [{ required: false, message: '请输入上/下架', trigger: 'blur' }],
        detail: [{ required: false, message: '请输入课程详情', trigger: 'blur' }],
        chapters: [{ required: false, message: '请输入课时', trigger: 'blur' }]
      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)

        this.$refs.ruleForm.resetFields()
      } else {
        this.$refs.detail && (this.$refs.detail.setContent(this.formData.detail))
      }
    }
  },
  async mounted() {
    await this.getAllClass()
    await this.getAllDepartment()
    if (this.type === 1) {
      await this.getAllTeacher()
    }
    this.getData()
  },
  methods: {
    parseSecond,
    // 获取所有分类
    async getAllClass() {
      const res = await this.$http.get(this.urls.class)
      if (res) {
        this.options = res
      }
    },
    // 获取所有老师
    async getAllTeacher() {
      const res = await this.$http.get('teacher/all')
      if (res) {
        this.teachers = res
      }
    },
    // 获取所有岗位
    async getAllDepartment() {
      const res = await this.$http.get(this.urls.department)
      if (res) {
        this.departments = res
      }
    },
    async getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      // this.get(this.urls.main, this.query)
      this.listLoading = true
      console.log('type==>', type)
      if (type !== 'pagination') {
        this.query.pageNum = 1
      }
      const res = await this.$http.get(this.urls.main, { params: this.query })
      this.listLoading = false
      if (res) {
        console.log('res', res)
        let data
        if (this.type === 2) {
          data = res.rows.map(el => {
            // eslint-disable-next-line no-unused-vars
            const { id, ...obj } = el.course
            return { id: el.id, index: el.index, isOnline: el.isOnline, ...obj, courseId: id }
          })
        } else {
          data = res.rows
        }
        this.list = data
        this.total = res.count
      }
    },
    async editData(row) {
      this.isNew = false
      const res = await this.$http.get(`${this.urls.info}/${row.id}`)
      if (res) {
        this.formData = res
        this.addDialogVisible = true
      }
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
      this.$refs.detail && (this.$refs.detail.setContent(''))
    },
    async scanData(row) {
      let url
      if (this.type === 2) {
        url = `${this.urls.info}/${row.courseId}`
      } else {
        url = `${this.urls.info}/${row.id}`
      }
      const res = await this.$http.get(url)
      if (res) {
        this.$refs.info.formData = res
        this.$refs.info.seeVisible = true
      }
    },
    // 增加课时
    addLesson() {
      this.formData.chapters.push(lesson)
    },
    delData(row) {
      let id
      let tips
      if (this.type !== 2) {
        id = row.id
      } else {
        id = row.courseId
      }
      if (this.type !== 1) {
        tips = '此操作将从课程列表移除该数据, 是否继续?'
      }

      this.del(`${this.urls.del}/${id}`, tips)
    },
    // 删除课时
    delLesson(i) {
      if (this.formData.chapters.length > 1) {
        this.formData.chapters.splice(i, 1)
      } else {
        this.$notify.warning('至少添加一个课时！')
      }
    },
    async changeIsOnline(row) {
      this.listLoading = true
      const res = await this.$http.put(`${this.urls.main}/${row.id}/isOnline`, { value: row.isOnline })
      this.listLoading = false
      if (res) {
        this.$notify.success('修改成功！')
      } else {
        row.value = !row.value
      }
    },
    async submitForm() {
      const { chapters } = this.formData
      if (chapters.length < 1 || (!Array.isArray(chapters))) {
        this.$notify.warning('请添加至少一个课时！')
        return
      }
      let sured = true
      for (var item of chapters) {
        if (!item.name || !item.file[0].url) {
          console.log(!item.name)
          console.log(item.file[0])
          sured = false
          break
        }
        if (this.deleteId.indexOf(item.file[0].uid) > -1) {
          sured = false
          break
        }
      }

      if (sured) {
        await this.$refs.banners.submitUpload()
        this.submit(this.urls.main, this.formData)
      } else {
        this.$notify.error('存在未上传视频或未填写名称的课时！')
      }
      console.log('formData', this.formData)
    },
    //  添加至课程列表
    async addCourse(row) {
      const { index, isOnline, id } = row
      const res = await this.$http.post(this.urls.del, { index, isOnline, courseId: id })
      if (res) {
        this.$notify.success('添加成功！')
        this.getData()
      }
    },
    // el-upload
    handleExceed(files, fileList) {
      this.$message.warning(`当前只能上传一个视频，若要修改请删除原来的文件`)
    },
    handleRemove(file, fileList) {
      this.deleteId.push(file.uid)
      console.log(this.deleteId)
      // this.formData.chapters[this.currentIndex].file = []
    },

    async handleSuccess(res, file) {
      console.log('res', res)
      const obj = {}
      const data = await axios.get(this.$cfg.getImgPath(res.key) + '?avinfo')
      obj.duration = Math.floor(data.data.format.duration) // 文件时长
      obj.type = data.data.streams[0].codec_type
      obj.size = data.data.format.size
      obj.url = res.key
      obj.name = file.name
      this.formData.chapters[this.currentIndex].file = [obj]
    },
    async beforeVideoUpload() {
      let token
      try {
        token = await this.$http.get('upToken')
        console.log(token)
      } catch (error) {
        console.log('******')
        token = this.$cfg.staticToken
      }
      const key = 'course/' + createUniqueString()
      this.upData = {
        token,
        key
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .app-container{
    &.course{
    box-sizing: border-box;
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;

    .el-main{
      flex:1;
    }

  }
    .courseInfo{
      display: flex;
      .left{
        width:80px;
        margin-right:20px;
      }
    }
  }

</style>

