<template>
  <div class="app-container">
    <el-header class="common-head">
      <el-button type="primary" @click="addData">
        新 增
      </el-button>
      <el-button type="success" @click="getData">
        刷 新
      </el-button>
    </el-header>
    <el-main>
      <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
        <el-table-column label="部门编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="部门人数(人)" align="center">
          <template slot-scope="scope">
            {{ scope.row.count || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="下设员工列表" align="center">
          <template slot-scope="scope">
            <el-tag style="cursor:pointer" @click="getPerson(scope.row)">
              查看
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <!-- <el-button type="danger" size="small" @click="delData(scope.row)">
              删除
            </el-button> -->
            <el-button type="primary" size="small" @click="editData(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- <el-footer>
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer> -->

    <!-- 编辑 -->
    <el-dialog :visible.sync="addDialogVisible" :before-close="handleClose" :title="dialogTitle">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" place-holder="请输入部门名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog :visible.sync="seeVisible" title="部门查看">
      <el-form

        label-position="left"
        label-width="150px"
        style="width: 80%;min-width:400px; margin-left:50px;"
      >
        <el-form-item label="部门编号">
          <span>{{ detail.id }}</span>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <span>{{ detail.name }}</span>
        </el-form-item>
        <el-form-item label="部门人数" prop="name">
          <span>{{ detail.count||0 }}</span>
        </el-form-item>
        <el-form-item label="下设员工列表">
          <el-table v-loading="staffLoading" :data="staffList" element-loading-text="拼命加载中" border fit highlight-current-row>
            <el-table-column label="员工编号" align="center">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="员工姓名" align="center">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="员工手机号" align="center">
              <template slot-scope="scope">
                {{ scope.row.tel }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="staffList.length>0"
            style="margin-top:10px"
            :current-page="query.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detail.count"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">

        <el-button type="info" @click="seeVisible = false">关闭</el-button>
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
      objStr: '部门',
      defaultData: {
        name: ''

      },
      formData: {

      },
      query: {
        department: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]

      },
      detail: {
        id: '',
        name: '',
        count: 0
      },
      seeVisible: false,
      staffLoading: true,
      staffList: []
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val) {
        this.formData = Object.assign({}, this.defaultData)

        this.$refs.ruleForm.resetFields()
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(type) {
      this.formData = Object.assign({}, this.defaultData)
      this.get({
        url: 'enterpriseAdmin/department',
        type
      })
    },
    editData(row) {
      this.isNew = false
      this.formData = Object.assign({}, row)
      this.addDialogVisible = true
    },
    addData() {
      this.isNew = true
      this.formData = Object.assign({}, this.defaultData)
      this.addDialogVisible = true
    },
    delData(row) {
      this.del('enterpriseAdmin/department/' + row.id)
    },
    submitForm() {
      this.submit('enterpriseAdmin/department', this.formData)
    },
    async getPersonList() {
      this.staffLoading = true

      const res = await this.$http.get('enterpriseAdmin/employee', { params: this.query })
      if (res) {
        this.staffLoading = false
        this.staffList = res.rows
      }
    },
    getPerson(row) {
      const { id, name, count } = row
      this.detail = { id, name, count }
      this.seeVisible = true
      this.query.department = row.name
      this.getPersonList()
    },
    sizeChange(size) {
      this.query.pageSize = size
      this.getPersonList()
    },
    currentChange(num) {
      this.query.pageNum = num
      this.getPersonList()
    }
  }
}
</script>
