<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-input v-model="query.searchString" placeholder="课程编号/名称/老师姓名" class="input-with-select" @keyup.enter.native="getData">
        <el-select slot="prepend" v-model="query.filterType" style="width:150px;" placeholder="请选择搜索类型">
          <el-option label="课程编号" :value="0" />
          <el-option label="课程名称" :value="1" />
          <el-option label="老师姓名" :value="1" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData" />
      </el-input>
      <!-- <el-select v-model="query.department" clearable placeholder="课程分类" @change="getData">
        <el-option
          v-for="(item,i) in courseList"
          :key="i"
          :label="item.name"
          :value="item.name"
        />
      </el-select> -->
      <el-button type="primary" @click="addData">
        分发课程
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="课程编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.courseId }}
          </template>
        </el-table-column>
        <el-table-column label="发布课程" align="center">
          <template slot-scope="scope">
            <div class="courseInfo">
              <div class="left">
                <img v-preview :src="scope.row.banners&&$cfg.getImgPath(scope.row.banners[0])" width="80" height="80">
              </div>
              <div class="right">
                <div><span>课程名称：</span>{{ scope.row.name }}</div>
                <div><span>课程老师：</span>{{ scope.row.teacherName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createdAt?$assist.dateFormatter(scope.row.createdAt):"" }}
          </template>
        </el-table-column>
        <el-table-column label="考试完成情况（人）" align="center">
          <template slot-scope="scope">
            {{ `${scope.row.doneCount} / ${scope.row.totalCount}` }}
            <!-- <el-tag style="cursor:pointer" @click="getPerson(scope.row)">
              查看
            </el-tag> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="上下架" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOnline"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeIsOnline(scope.row)"
            />
          </template>
        </el-table-column> -->

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="scanData(scope.row)">
              查 看
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
        label-width="150px"
        style="width: 100%"
      >
        <el-form-item label="添加课程" prop="name">
          <el-select v-model="formData.id" clearable placeholder="请选择课程">
            <el-option
              v-for="(item,i) in courseList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程所属部门" prop="department">
          <el-select v-model="department" clearable placeholder="请选择所属部门" @change="getAllStaff">
            <el-option
              v-for="(item,i) in partList"
              :key="i"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="添加员工">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="formData.ids" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="staff in staffs" :key="`${staff.id}`" :label="staff.id">
              {{ staff.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <info-page :id="infoId" ref="info" />
  </div>
</template>
<script>
import infoPage from './info'
import Main from '../mixins'
export default {
  components: {
    infoPage
  },
  mixins: [Main],
  data() {
    return {
      infoId: '',
      objStr: '课程',
      courseList: [{}],
      defaultData: {
        id: '',
        ids: []
      },
      department: '',
      partList: [{}],
      query: {
        filterType: 0,
        searchString: '',
        department: ''
      },
      formData: {

      },
      rules: {
        name: [{ required: false, message: '请选择课程', trigger: 'change' }],
        department: [{ required: false, message: '请选择部门', trigger: 'change' }]
      },
      checkAll: true,
      staffs: [],
      isIndeterminate: false
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)
        this.isIndeterminate = false
        this.$refs.ruleForm.resetFields()
        this.department = ''
      }
    }
  },
  async mounted() {
    this.formData = Object.assign({}, this.defaultData)
    await this.getAllDepartment()
    await this.getAllCourse()
    // await this.getAllStaff()
    this.getData()
  },
  methods: {
    async getAllDepartment() {
      const res = await this.$http.get('enterpriseAdmin/department/enterprise/all')
      if (res) {
        this.partList = res
      }
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
    async getAllStaff() {
      const data = { pageSize: 100000, pageNum: 1, department: this.department }
      try {
        if (!data.department) {
          this.checkAll = false
          return
        }
        const res = await this.$http.get('enterpriseAdmin/employee', { params: data })
        if (res) {
          if (res.rows.length < 1) {
            this.checkAll = false
          } else {
            this.checkAll = true
          }
          this.staffs = res.rows.map(el => {
            return { id: el.id, name: el.name }
          })
          this.formData.ids = res.rows.map(el => {
            return el.id
          })
        }
      } catch {
        console.log('getAllStaff error')
        return
      }
    },
    getData(type) {
      this.get({
        url: 'enterpriseAdmin/courseDeliver',
        params: this.query,
        type
      })
    },
    scanData(row) {
      this.infoId = row.courseId
      this.$refs.info.seeVisible = true
      // this.formData = Object.assign({}, row)
      // this.addDialogVisible = true
    },
    async addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      await this.getAllStaff()
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('enterpriseAdmin/employee/' + row.id)
    },
    submitForm() {
      this.submit(`enterpriseAdmin/courseDeliver/${this.formData.id}`, this.formData)
    },
    getPerson(row) {

    },
    handleCheckAllChange(val) {
      console.log('val', val)
      this.checkedCities = val ? ['上海', '北京', '广州', '深圳'] : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      console.log('value', value)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.staffs.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.staffs.length
    }

  }
}
</script>
<style lang="less" scoped>
  .app-container{
    .courseInfo{
      display: flex;
      align-items: center;
      .left{
        width:80px;
        margin-right:20px;
      }
    }
  }
</style>
